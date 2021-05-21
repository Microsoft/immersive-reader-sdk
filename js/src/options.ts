// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type Options = {
    uiLang?: string;           // Language of the UI, e.g. en, es-ES (optional). Defaults to browser language if not specified.
    timeout?: number;          // Duration (in milliseconds) before launchAsync fails with a timeout error (default is 15000 ms).
    uiZIndex?: number;         // Z-index of the iframe that will be created (default is 1000)
    useWebview?: boolean;      // Use a webview tag instead of an iframe, for compatibility with Chrome Apps (default is false).
    onExit?: () => any;        // Executes when the Immersive Reader exits
    allowFullscreen?: boolean; // The ability to toggle fullscreen (default is true).
    parent?: Node;               // Node in which the iframe/webview container is placed (default is body).
    hideExitButton?: boolean;  // Whether or not to hide the Immersive Reader's exit button arrow (default is false). This should only be true if there is an alternative mechanism provided to exit the Immersive Reader (e.g a mobile toolbar's back arrow).
    cookiePolicy?: CookiePolicy;             // Setting for the Immersive Reader's cookie usage (default is CookiePolicy.Disable). It's the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy.
    disableFirstRun?: boolean;               // Disable the first run experience.
    readAloudOptions?: ReadAloudOptions;     // Options to configure Read Aloud.
    translationOptions?: TranslationOptions; // Options to configure Translation.
    displayOptions?: DisplayOptions;         // Options to configure text size, font, etc.
    preferences?: string;                           // String returned from onPreferencesChanged representing the user's preferences in the Immersive Reader.
    onPreferencesChanged?: (value: string) => any;  // Executes when the user's preferences have changed.
    customDomain?: string;                  // Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null).
    cognitiveAppId?: string;                // String to delineate for 1st party application to hide MS logo (i.e. 'Teams' - default is 'Cognitive').
    internalOptions?: InternalOptions;       // Options reserved for internal use.
};

export enum CookiePolicy { Disable, Enable }

export type ReadAloudOptions = {
    voice?: string;      // Voice, either 'male' or 'female'. Note that not all languages support both genders.
    speed?: number;      // Playback speed, must be between 0.5 and 2.5, inclusive.
    autoplay?: boolean;  // Automatically start Read Aloud when the Immersive Reader loads.
};

export type TranslationOptions = {
    language: string;                         // Set the translation language, e.g. fr-FR, es-MX, zh-Hans-CN. Required to automatically enable word or document translation.
    autoEnableDocumentTranslation?: boolean;  // Automatically translate the entire document
    autoEnableWordTranslation?: boolean;      // Automatically enable word translation
};

export enum ThemeOption { Light, Dark, Contrast }

export type DisplayOptions = {
    textSize?: number;          // Valid values are 14, 20, 28, 36, 42, 48, 56, 64, 72, 84, 96.
    increaseSpacing?: boolean;  // Set whether increased spacing is enabled.
    fontFamily?: string;        // Valid values are 'Calibri', 'ComicSans', and 'Sitka'
    themeOption?: ThemeOption               // option to set custom theme
};

// Reserved for internal use. Style overrides, strings: [iframeStyleOverrides, iframeContainerStyleOverrides]
export type StyleOverrideOptions = {
    iframeStyleOverrides?: string;
    iframeContainerStyleOverrides?: string;
};

export type InternalOptions = {
    messageOptions?: InternalOptionDictionary   // Reserved for internal use. Additional options to be sent through Content message.
    queryParameters?: InternalOptionDictionary  // Reserved for internal use. Additional query parameters.
    styleOverrides?: StyleOverrideOptions
};

export type InternalOptionDictionary = {
    [option: string]: boolean | string | number // Reserved for internal use. Option dictionary.
};
