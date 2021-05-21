// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Content } from './content';
import { CookiePolicy, DisplayOptions, InternalOptionDictionary, Options, ReadAloudOptions, StyleOverrideOptions, TranslationOptions } from './options';
import { Error, ErrorCode } from './error';
import { LaunchResponse } from './launchResponse';
declare const VERSION: string;

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */
const sdkPlatform = 'js';
const sdkVersion = VERSION;

type Message = {
    launchToPostMessageSentDurationInMs: number;
    request?: Content;
    apiResponse?: ApiResponseSuccessMessage;
    cogSvcsAccessToken?: string;
    cogSvcsSubdomain?: string | null;
    disableFirstRun?: boolean;
    readAloudOptions?: ReadAloudOptions;
    translationOptions?: TranslationOptions;
    displayOptions?: DisplayOptions;
    sendPreferences?: boolean;
    preferences?: string;
    internalOptions?: InternalOptionDictionary;
};

// TODO Future: This can be split between the 2 functions since there is no overlap at the moment
type UnifiedExtraFunctionOptions = {
    content?: Content;
    subdomain?: string;
    reject?: (reason: Error) => void;
    resolve?: (value: LaunchResponse | PromiseLike<LaunchResponse>) => void;
    sendContentIfReady?: () => void;
    startTime?: number;
    token?: string;
};

const PostMessagePreferences = 'ImmersiveReader-Preferences:';
const PostMessageLaunchResponse = 'ImmersiveReader-LaunchResponse:';

const errorMessageMap: { [errorCode: string]: string } = {};
errorMessageMap[ErrorCode.TokenExpired] = 'The access token supplied is expired.';
errorMessageMap[ErrorCode.Throttled] = 'You have exceeded your quota.';
errorMessageMap[ErrorCode.ServerError] = 'An error occurred when calling the server to process the text.';
errorMessageMap[ErrorCode.InvalidSubdomain] = 'The subdomain supplied is invalid.';

// Added globals to persist between functions
let isLoading: boolean = false;
let timeoutId: number | null = null;
let parent: Node = null;
let iframeContainer: HTMLDivElement = null;
let iframe: HTMLIFrameElement = null;
let noscroll: HTMLStyleElement = null;
let messageHandler: (e: any) => void = null;

enum FuncType { launchAsync, launchWithoutContentAsync }
/* ------------------------------- End Shared ------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               S2S (Internal)                               */
/* -------------------------------------------------------------------------- */
type LaunchResponseMessage = {
    success: boolean;
    errorCode?: ErrorCode;
    sessionId: string;
    meteredContentSize?: number;
};

type ApiResponseSuccessMessage = {
    data: any;
    meta: any;
    status: number;
};

type LaunchWithoutContentResponse = {
    provideApiResponse: (apiResponse: ApiResponseSuccessMessage) => Promise<LaunchResponse>;
    cancelAndCloseReader: () => void;
};

type LaunchWithoutContentResolve = (value: LaunchWithoutContentResponse) => void;
type LaunchResponseResolve = (value: LaunchResponse) => void;
type LaunchReject = (reason: Error) => void;

let readyForContent: boolean = false;
let apiResponseMessage: ApiResponseSuccessMessage;

let launchResponseResolve: LaunchResponseResolve;
let launchResponseReject: LaunchReject;
let launchResponseError: Error;
/* --------------------------------- End S2S -------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           Shared Helper Functions                          */
/* -------------------------------------------------------------------------- */
function _getAndSetOptionDefaults(options?: Options): Options {

    const { allowFullscreen, cookiePolicy, hideExitButton, internalOptions, onExit, parent, timeout, uiZIndex, useWebview } = options || {};

    const _options = {
        ...options,
        allowFullscreen: allowFullscreen || true,
        cookiePolicy: cookiePolicy ?? CookiePolicy.Disable, // Disabled by default. Customers must explicitly enable
        hideExitButton: hideExitButton || false,
        internalOptions: internalOptions ?? {},
        onExit,
        timeout: timeout ?? 15000,  // Default to 15 seconds
        uiZIndex: (!uiZIndex || typeof options.uiZIndex !== 'number') ? 1000 : uiZIndex, // Default to 1000 if not valid
        useWebview: useWebview || false
    };

    _createIFrame(parent, useWebview, allowFullscreen, internalOptions?.styleOverrides);

    return _options;
}

function _createMessageHandler(options: Options, funcType: FuncType, extras: UnifiedExtraFunctionOptions) {
    return (e: any) => {
        // Don't process the message if the data is not a string
        if (!e || !e.data || typeof e.data !== 'string') { return; }

        if (e.data === 'ImmersiveReader-ReadyForContent') {
            resetTimeout(); // Reset the timeout once the reader page loads successfully. The Reader page will report further errors through PostMessage if there is an issue obtaining the ContentModel from the server
            switch (funcType) {
                case FuncType.launchAsync: {
                    const {
                        content,
                        subdomain,
                        startTime,
                        token
                    } = extras;
                    const message: Message = {
                        cogSvcsAccessToken: token,
                        cogSvcsSubdomain: subdomain,
                        request: content,
                        launchToPostMessageSentDurationInMs: Date.now() - startTime,
                        disableFirstRun: options.disableFirstRun,
                        readAloudOptions: options.readAloudOptions,
                        translationOptions: options.translationOptions,
                        displayOptions: options.displayOptions,
                        sendPreferences: !!options.onPreferencesChanged,
                        preferences: options.preferences,
                        internalOptions: options.internalOptions?.messageOptions
                    };
                    iframe.contentWindow!.postMessage(JSON.stringify({ messageType: 'Content', messageValue: message }), '*');
                    break;
                }
                case FuncType.launchWithoutContentAsync: {
                    readyForContent = true;
                    const { sendContentIfReady } = extras;
                    sendContentIfReady();
                    break;
                }
            }
        } else if (e.data === 'ImmersiveReader-Exit') {
            exit(options.onExit);
        } else if (e.data.startsWith(PostMessageLaunchResponse)) {
            let launchResponse: LaunchResponse = null;
            let error: Error = null;
            let response: LaunchResponseMessage = null;
            try {
                response = JSON.parse(e.data.substring(PostMessageLaunchResponse.length));
            } catch {
                // No-op
            }

            if (response && response.success) {
                const playMessageValue: any = {
                    command: 'PlayState',
                    parameters: 'Play'
                };

                const pauseMessageValue: any = {
                    command: 'PlayState',
                    parameters: 'Pause'
                };

                launchResponse = {
                    container: iframeContainer,
                    sessionId: response.sessionId,
                    charactersProcessed: response.meteredContentSize,
                    postLaunchOperations: {
                        pause: () => {
                            iframe.contentWindow!.postMessage(JSON.stringify({ messageType: 'InstrumentationCommand', messageValue: pauseMessageValue }), '*');
                        },
                        play: () => {
                            iframe.contentWindow!.postMessage(JSON.stringify({ messageType: 'InstrumentationCommand', messageValue: playMessageValue }), '*');
                        }
                    }
                };
            } else if (response && !response.success) {
                error = {
                    code: response.errorCode,
                    message: errorMessageMap[response.errorCode],
                    sessionId: response.sessionId
                };
            } else {
                error = {
                    code: ErrorCode.ServerError,
                    message: errorMessageMap[ErrorCode.ServerError]
                };
            }

            isLoading = false;

            switch (funcType) {
                case FuncType.launchAsync: {
                    const {
                        reject,
                        resolve
                    } = extras;
                    if (launchResponse) {
                        resetTimeout();
                        resolve(launchResponse);
                    } else if (error) {
                        exit(options.onExit);
                        reject(error);
                    }
                    break;
                }
                case FuncType.launchWithoutContentAsync: {
                    if (launchResponse) {
                        resetTimeout();
                        if (launchResponseResolve) {
                            launchResponseResolve(launchResponse);
                        }
                    } else if (error) {
                        exit(options.onExit);
                        if (launchResponseReject) {
                            launchResponseReject(error);
                        }
                    }
                }
            }
        } else if (e.data.startsWith(PostMessagePreferences)) {
            if (options.onPreferencesChanged && typeof options.onPreferencesChanged === 'function') {
                try {
                    options.onPreferencesChanged(e.data.substring(PostMessagePreferences.length));
                } catch {
                    // no-op?
                }
            }
        }
    };
}

function _makeSrcUrl(options: Options, funcType: FuncType): string {
    let src = '';
    if (funcType === FuncType.launchAsync) {
        src = 'reader?exitCallback=ImmersiveReader-Exit';
    } else if (funcType === FuncType.launchWithoutContentAsync) {
        src = 'https://learningtools.onenote.com/learningtoolsapp/cognitive/reader?exitCallback=ImmersiveReader-Exit&skipearlygcm=true';
    }

    src += `&sdkPlatform=${sdkPlatform}&sdkVersion=${sdkVersion}`;

    src += `&cookiePolicy=${((options.cookiePolicy === CookiePolicy.Enable) ? 'enable' : 'disable')}`;

    if (options.cognitiveAppId) {
        src += `&cognitiveAppId=${options.cognitiveAppId}`;
    }

    if (options.hideExitButton) {
        src += '&hideExitButton=true';
    }

    if (options.uiLang) {
        src += `&omkt=${options.uiLang}`;
    }

    const queryParameters: InternalOptionDictionary = options?.internalOptions?.queryParameters;
    for (const parameterName in queryParameters) {
        src += '&' + parameterName + '=' + queryParameters[parameterName];
    }

    return src;
}

function _createIFrame(_parent: Node, useWebview: boolean, allowFullscreen: boolean, styleOverrides: StyleOverrideOptions): void {
    parent = _parent || document.body;
    iframeContainer = document.createElement('div');
    iframe = useWebview ? <HTMLIFrameElement>document.createElement('webview') : document.createElement('iframe');
    iframe.allow = 'autoplay';
    iframe.title = 'Immersive Reader Frame';
    iframe.setAttribute('aria-modal', 'true');
    if (allowFullscreen) { // Style iframe
        iframe.setAttribute('allowfullscreen', '');
    }
    // Send an initial message to the webview so it has a reference to this parent window
    if (useWebview) {
        iframe.addEventListener('loadstop', () => {
            iframe.contentWindow.postMessage(JSON.stringify({ messageType: 'WebviewHost' }), '*');
        });
    }

    const { iframeStyleOverrides } = styleOverrides || {};
    if (iframeStyleOverrides && iframeStyleOverrides !== '') {
        iframe.style.cssText = iframeStyleOverrides;
    } else {
        iframe.style.cssText = _parent
        ? 'position: static; width: 100%; height: 100%; left: 0; top: 0; border-width: 0;'
        : 'position: static; width: 100vw; height: 100vh; left: 0; top: 0; border-width: 0;';
    }

    noscroll = document.createElement('style');
    noscroll.innerHTML = 'body{height:100%;overflow:hidden;}';
}

function _setIframeProps(src: string, options: Options): void {

    const { internalOptions, parent: optionParent, uiZIndex } = options || {};
    const { styleOverrides } = internalOptions || {};

    iframe.src = src;

    if (!!styleOverrides?.iframeContainerStyleOverrides) {
        iframeContainer.style.cssText = styleOverrides?.iframeContainerStyleOverrides;
    } else {
        iframeContainer.style.cssText = optionParent
            ? `position: relative; width: 100%; height: 100%; border-width: 0; -webkit-perspective: 1px; z-index: ${uiZIndex}; background: white; overflow: hidden`
            : `position: fixed; width: 100vw; height: 100vh; left: 0; top: 0; border-width: 0; -webkit-perspective: 1px; z-index: ${uiZIndex}; background: white; overflow: hidden`;
    }

    iframeContainer.appendChild(iframe);
    parent.appendChild(iframeContainer);

    // Disable body scrolling
    document.head.appendChild(noscroll);
}

function resetTimeout(): void {
    window.clearTimeout(timeoutId);
    timeoutId = null;
}

function reset(): void {
    // Remove container along with the iframe inside of it
    if (parent.contains(iframeContainer)) {
        parent.removeChild(iframeContainer);
    }

    window.removeEventListener('message', messageHandler);

    // Clear the timeout timer
    resetTimeout();

    // Re-enable scrolling
    if (noscroll.parentNode) {
        noscroll.parentNode.removeChild(noscroll);
    }
}

function exit(onExit: Function): void {
    reset();
    isLoading = false;
    // Execute exit callback if we have one
    if (onExit) {
        try {
            onExit();
        } catch {
            console.log('Error on exit');
        }
    }
}
/* ----------------------- End Shared Helper Functions ---------------------- */

/**
 * Launch the Immersive Reader within an iframe.
 * @param token The authentication token.
 * @param subdomain The Immersive Reader Cognitive Service subdomain. This is a required parameter for Azure AD authentication in this and future versions of this SDK. Use of the Cognitive Services issueToken endpoint-based authentication tokens is deprecated and no longer supported.
 * @param content The content that should be shown in the Immersive Reader.
 * @param options Options for configuring the look and feel of the Immersive Reader.
 * @return A promise that resolves with a LaunchResponse when the Immersive Reader is launched.
 */
export function launchAsync(token: string, subdomain: string, content: Content, options?: Options): Promise<LaunchResponse> {
    if (isLoading) {
        return Promise.reject('Immersive Reader is already launching');
    }

    return new Promise((resolve, reject: (reason: Error) => void): void => {
        if (!token) {
            reject({ code: ErrorCode.BadArgument, message: 'Token must not be null' });
            return;
        }

        if (!content) {
            reject({ code: ErrorCode.BadArgument, message: 'Content must not be null' });
            return;
        }

        if (!content.chunks) {
            reject({ code: ErrorCode.BadArgument, message: 'Chunks must not be null' });
            return;
        }

        if (!content.chunks.length) {
            reject({ code: ErrorCode.BadArgument, message: 'Chunks must not be empty' });
            return;
        }

        isLoading = true;
        const startTime = Date.now();

        options = _getAndSetOptionDefaults(options);

        const extras: UnifiedExtraFunctionOptions = {
            content,
            subdomain,
            reject,
            resolve,
            startTime,
            token
        };

        messageHandler = _createMessageHandler(options, FuncType.launchAsync, extras);

        // Reset variables
        reset();

        window.addEventListener('message', messageHandler);

        // Reject the promise if the Immersive Reader page fails to load.
        timeoutId = window.setTimeout((): void => {
            reset();
            isLoading = false;
            reject({ code: ErrorCode.Timeout, message: `Page failed to load after timeout (${options.timeout} ms)` });
        }, options.timeout);

        const domain = options.customDomain ? options.customDomain : 'https://learningtools.onenote.com/learningtoolsapp/cognitive/';
        const src = domain + _makeSrcUrl(options, FuncType.launchAsync);

        _setIframeProps(src, options);
    });
}

/**
 * Launch the Immersive Reader within an iframe.
 * @param options Options for configuring the look and feel of the Immersive Reader.
 * @return A promise that resolves with a LaunchWithoutContentResponse to provide the S2S response
 */
export function launchWithoutContentAsync(options?: Options): Promise<LaunchWithoutContentResponse> {
    if (isLoading) {
        return Promise.reject('Immersive Reader is already launching');
    }

    isLoading = true;
    const startTime = Date.now();

    options = _getAndSetOptionDefaults(options);

    const sendContentIfReady = (): void => {
        if (readyForContent && apiResponseMessage) {
            const message: Message = {
                apiResponse: apiResponseMessage,
                launchToPostMessageSentDurationInMs: Date.now() - startTime,
                disableFirstRun: options.disableFirstRun,
                readAloudOptions: options.readAloudOptions,
                translationOptions: options.translationOptions,
                displayOptions: options.displayOptions,
                sendPreferences: !!options.onPreferencesChanged,
                preferences: options.preferences
            };

            iframe.contentWindow!.postMessage(JSON.stringify({ messageType: 'ContentModelWithOptions', messageValue: message }), '*');
        }
    };

    const extras: UnifiedExtraFunctionOptions = {
        sendContentIfReady
    };

    messageHandler = _createMessageHandler(options, FuncType.launchAsync, extras);

    // Reset variables
    reset();

    window.addEventListener('message', messageHandler);

    // Reject the promise if the Immersive Reader page fails to load.
    timeoutId = window.setTimeout((): void => {
        reset();
        isLoading = false;

        const error: Error = { code: ErrorCode.Timeout, message: `Page failed to load after timeout (${options.timeout} ms)` };

        if (launchResponseReject) {
            launchResponseReject(error);
        } else {
            // Can't reject yet, will reject at earliest possible moment
            launchResponseError = error;
        }
    }, options.timeout);

    const src = _makeSrcUrl(options, FuncType.launchWithoutContentAsync);

    _setIframeProps(src, options);

    const launchWithoutContentResponse: LaunchWithoutContentResponse = {
        cancelAndCloseReader: () => exit(options.onExit),
        provideApiResponse: (apiResponse: ApiResponseSuccessMessage): Promise<LaunchResponse> => {
            if (!apiResponse) {
                return Promise.reject({ code: ErrorCode.BadArgument, message: 'No Api Response' });
            }

            if (apiResponse.status !== 200) {
                return Promise.reject({ code: ErrorCode.BadArgument, message: 'Unsuccessful Api Response' });
            }

            if (!apiResponse.data) {
                return Promise.reject({ code: ErrorCode.BadArgument, message: 'No data in Api Response' });
            }

            if (!apiResponse.meta) {
                return Promise.reject({ code: ErrorCode.BadArgument, message: 'No meta in Api Response' });
            }

            apiResponseMessage = apiResponse;
            sendContentIfReady();

            return new Promise((resolve: LaunchResponseResolve, reject: LaunchReject) => {
                launchResponseResolve = resolve;
                launchResponseReject = reject;

                // Errored before host provided an api response
                if (launchResponseError) {
                    reject(launchResponseError);

                    // Make sure we only reject once
                    launchResponseError = null;
                }
            });
        }
    };

    const launchWithoutContentPromise: Promise<LaunchWithoutContentResponse> = new Promise((resolve: LaunchWithoutContentResolve, _reject: LaunchReject) => {
        resolve(launchWithoutContentResponse);
    });

    return launchWithoutContentPromise;
}

export function resetLoadingForTest(): void {
    isLoading = false;
}

export function close(): void {
    window.postMessage('ImmersiveReader-Exit', '*');
}
