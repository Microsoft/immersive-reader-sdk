// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// launchAsync.ts needs to read VERSION (which is passed in from package.json via webpack)
(window as any).VERSION = '000.000.000';

import { launchAsync, launchWithoutContentAsync } from '../src/immersive-reader-sdk';
import { resetLoadingForTest } from '../src/launchAsync';
import { Content } from '../src/content';
import { CookiePolicy, Options } from '../src/options';

describe('launchAsync tests', () => {
    const SampleToken: string = 'not-a-real-token';
    const SampleSubdomain: string = 'not-a-real-subdomain';
    const SampleContent: Content = { chunks: [{ content: 'Hello, world' }] };

    it('fails to launch due to expired token', async () => {
        expect.assertions(2);
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent);

        window.postMessage('ImmersiveReader-LaunchResponse:{"success":false, "errorCode":"TokenExpired"}', '*');

        try {
            await launchPromise;
        } catch (error) {
            expect(error.code).toBe('TokenExpired');
            expect(error.message).toBe('The access token supplied is expired.');
        }
    });

    it('fails due to missing token', async () => {
        expect.assertions(1);
        try {
            await launchAsync(null, SampleSubdomain, SampleContent);
        } catch (error) {
            expect(error.code).toBe('BadArgument');
        }
    });

    it('fails due to missing content', async () => {
        expect.assertions(1);
        try {
            await launchAsync(SampleToken, SampleSubdomain, null);
        } catch (error) {
            expect(error.code).toBe('BadArgument');
        }
    });

    it('fails due to missing chunks', async () => {
        expect.assertions(1);
        try {
            await launchAsync(SampleToken, SampleSubdomain, { chunks: null });
        } catch (error) {
            expect(error.code).toBe('BadArgument');
        }
    });

    it('fails due to empty chunks', async () => {
        expect.assertions(1);
        try {
            await launchAsync(SampleToken, SampleSubdomain, { chunks: [] });
        } catch (error) {
            expect(error.code).toBe('BadArgument');
        }
    });

    it('launches with onExit callback', async () => {
        jest.useRealTimers();
        expect.assertions(1);

        const cbOnExit = jest.fn(() => { });

        const options: Options = { onExit: () => { cbOnExit(); } };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        await launchPromise;

        window.postMessage('ImmersiveReader-Exit', '*');

        // this is to yield this thread of execution to allow the exit message to get processed
        await new Promise(resolve => { setTimeout(resolve, 1); });

        expect(cbOnExit).toHaveBeenCalledTimes(1);
    });

    it('succeeds', () => {
        expect.assertions(1);
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent)
            .then(iframe => {
                expect(iframe).not.toBeNull();
            });

        // launchAsync creates an iframe which points to the Immersive Reader,
        // which then sends a postMessage to the parent window with the message
        // 'ImmersiveReader-LaunchResponse:{"success":true}'. This mocks that behavior.
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        return launchPromise;
    });

    it('sets the display language', async () => {
        expect.assertions(1);
        const options: Options = { uiLang: 'zh-Hans' };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;
        expect(iframe.src.toLowerCase()).toMatch('omkt=zh-hans');
    });

    it('without setting the display language', async () => {
        expect.assertions(1);
        const options: Options = { uiLang: '' };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;
        expect(iframe.src).not.toContain('&omkt=');
    });

    it('sets the z-index of the iframe', async () => {
        const zIndex = 12345;
        expect.assertions(1);
        const options: Options = { uiZIndex: zIndex };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        expect(response.container.style.zIndex).toEqual('' + zIndex);
    });

    it('launches with default z-index', async () => {
        expect.assertions(1);
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        expect(response.container.style.zIndex).toEqual('1000'); // Default is 1000;
    });

    it('launches with a webview tag instead of an iframe', async () => {
        expect.assertions(1);
        const options: Options = { useWebview: true };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const firstElementTagName = response.container.firstElementChild.tagName;

        expect(firstElementTagName.toLowerCase()).toBe("webview");
    });

    it('fails to launch due to timeout', async () => {
        jest.useFakeTimers();

        expect.assertions(1);
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent);

        // Skip forward in time to trigger timeout logic
        jest.runAllTimers();

        try {
            await launchPromise;
        } catch (error) {
            expect(error.code).toBe('Timeout');
        }
    });

    it('launches with a custom subdomain', async () => {
        expect.assertions(1);
        const options: Options = { customDomain: 'https://foo.com/' };
        const launchPromise = launchAsync(SampleToken, null, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;
        expect(iframe.src.toLowerCase()).toMatch('https://foo.com/');
    });

    it('launches with a custom subdomain 2', async () => {
        expect.assertions(1);
        const options: Options = { customDomain: '' };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;
        expect(iframe.src.toLowerCase()).toContain(`https://learningtools.onenote.com/learningtoolsapp/cognitive/reader?exitcallback=immersivereader-exit&sdkplatform=js&sdkversion=000.000.000&cookiepolicy=disable`);
    });

    it('launches with exit button hidden', async () => {
        expect.assertions(1);
        const options: Options = { hideExitButton: true };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.src).toContain('&hideExitButton=true');
    });

    it('launches with custom style overrides on iframe', async () => {
        expect.assertions(1);
        const options: Options = { internalOptions: { styleOverrides: { iframeStyleOverrides: "border-radius: 20px; width: 50%;" } } };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.style.cssText).toContain('border-radius: 20px; width: 50%;');
    });

    it('launches with custom style overrides on the iframe container', async () => {
        expect.assertions(1);
        const options: Options = { internalOptions: { styleOverrides: { iframeContainerStyleOverrides: "border-radius: 20px; width: 50%;" } } };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframeContainer = <HTMLIFrameElement>response.container;

        expect(iframeContainer.style.cssText).toContain('border-radius: 20px; width: 50%;');
    });

    it('launches with exit button displayed', async () => {
        expect.assertions(1);
        const options: Options = { hideExitButton: false };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.src).not.toContain('&hideExitButton=true');
    });

    it('launches with full screen button displayed', async () => {
        expect.assertions(1);
        const options: Options = { allowFullscreen: true };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.getAttribute('allowfullscreen')).not.toBeNull();
    });

    it('launches with full screen button hidden', async () => {
        expect.assertions(1);
        const options: Options = { allowFullscreen: false };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.getAttribute('allowfullscreen')).toBeNull();
    });

    it('launches with Cookie Policy enabled', async () => {
        expect.assertions(1);
        const options: Options = { cookiePolicy: CookiePolicy.Enable };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.src).toContain('&cookiePolicy=enable');
    });

    it('launches with Cookie Policy disabled', async () => {
        expect.assertions(1);
        const options: Options = { cookiePolicy: CookiePolicy.Disable };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        const response = await launchPromise;
        const iframe = <HTMLIFrameElement>response.container.firstElementChild;

        expect(iframe.src).toContain('&cookiePolicy=disable');
    });

    it('launches with preferences not set', async () => {
        expect.assertions(1);
        const options: Options = { preferences: null };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options)
            .then(iframe => {
                expect(iframe).not.toBeNull();
            });
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        return launchPromise;
    });

    it('launches with preferences set', async () => {
        expect.assertions(1);
        const options: Options = { preferences: 'foo' };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options)
            .then(iframe => {
                expect(iframe).not.toBeNull();
            });
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        return launchPromise;
    });

    it('launches with onPreferencesChanged set', async () => {
        jest.useRealTimers();
        expect.assertions(1);
        const options: Options = {
            onPreferencesChanged: (value) => {
                expect(value).toBe('hello world');
            }
        };
        const launchPromise = launchAsync(SampleToken, SampleSubdomain, SampleContent, options);
        window.postMessage('ImmersiveReader-LaunchResponse:{"success":true}', '*');

        await launchPromise;

        window.postMessage('ImmersiveReader-Preferences:hello world', '*');

        // this is to yield this thread of execution to allow the exit message to get processed
        await new Promise(resolve => { setTimeout(resolve, 1); });
        // });
    });
});

describe('launchWithoutContentAsync tests', () => {
    it('able to launch reader', () => {
        expect.assertions(1);

        const launchPromise = launchWithoutContentAsync()
            .then(response => {
                resetLoadingForTest();
                expect(response).not.toBeNull();
            });

        return launchPromise;
    });

    it('send invalid api response', async () => {
        expect.assertions(1);

        launchWithoutContentAsync()
            .then(async response => {
                try {
                    await response.provideApiResponse(null);
                } catch (error) {
                    resetLoadingForTest();
                    expect(error.code).toBe('BadArgument');
                }
            });
    });

    it('send invalid status', async () => {
        expect.assertions(1);

        launchWithoutContentAsync()
            .then(async response => {
                try {
                    const provideApiResponse: any = {
                        data: null,
                        meta: null,
                        status: null
                    };

                    await response.provideApiResponse(provideApiResponse);
                } catch (error) {
                    resetLoadingForTest();
                    expect(error.code).toBe('BadArgument');
                }
            });
    });

    it('send invalid data', async () => {
        expect.assertions(1);

        launchWithoutContentAsync()
            .then(async response => {
                try {
                    const provideApiResponse: any = {
                        data: null,
                        meta: null,
                        status: 200
                    };

                    await response.provideApiResponse(provideApiResponse);
                } catch (error) {
                    resetLoadingForTest();
                    expect(error.code).toBe('BadArgument');
                }
            });
    });

    it('send invalid meta', async () => {
        expect.assertions(1);

        launchWithoutContentAsync()
            .then(async response => {
                try {
                    const provideApiResponse: any = {
                        data: {},
                        meta: null,
                        status: 200
                    };

                    await response.provideApiResponse(provideApiResponse);
                } catch (error) {
                    resetLoadingForTest();
                    expect(error.code).toBe('BadArgument');
                }
            });
    });
});

const fs = require('fs');
describe('Verify SDK version is valid', () => {
    it('check version', () => {
        const packageJson: string = fs.readFileSync("package.json", "utf8");
        const sdkVersion: string = JSON.parse(packageJson).version;
        console.log(`SDK version: ${sdkVersion}`);

        expect(isValidSDKVersion(sdkVersion)).toBe(true);
    });
});

// sdk version must be in format xxx.xxx.xxx (each version segment between 1 and 3 digits)
function isValidSDKVersion(sdkVersion: string): boolean {
    if (!sdkVersion) {
        return false;
    }

    const regExp = /^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/;
    return regExp.test(sdkVersion);
}