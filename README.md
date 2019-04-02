# Cognitive Services - Immersive Reader SDK

[![Build status](https://dev.azure.com/ms/immersive-reader-sdk/_apis/build/status/96)](https://dev.azure.com/ms/immersive-reader-sdk/_build?definitionId=96)

The Immersive Reader SDK is a JavaScript library that allows you to easily and quickly integrate the Immersive Reader into your web application.

## Usage

Usage of this SDK requires an Azure subscription to Immersive Reader. Follow [these steps](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account) first to set up a subscription.

Once you have a subscription key, use that to acquire an access token by following [these steps](https://docs.microsoft.com/en-us/azure/cognitive-services/authentication#authenticate-with-an-authentication-token).

Include the library in your web application:

* Stable build

```html
<script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-0.0.1.js'></script>
```

* Canary build (use at your own risk!)

```html
<script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-preview.js'></script>
```

Invoke the Immersive Reader:

```typescript
const content = {
    title: 'Immersive Reader',
    chunks: [ {
        content: 'Hello, world!'
    } ]
};
ImmersiveReader.launchAsync(YOUR_TOKEN, content);
```

Take a look at the [samples](./samples) for examples of a full end-to-end integration.

## Building

In order to build the SDK, ensure that you have [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), and [Yarn](https://yarnpkg.com/) installed.

Clone a copy of the repo:

```bash
git clone https://github.com/Microsoft/immersive-reader-sdk
```

Change to the immersive-reader-sdk directory:

```bash
cd immersive-reader-sdk
```

Install dependencies:

```bash
yarn
```

Build and test:

```bash
yarn run build
yarn run test
```

## Contributing

We welcome [contributions](CONTRIBUTING.md) to this project.

* [Submit bugs](https://github.com/Microsoft/immersive-reader-sdk/issues) and help us verify fixes as they are checked in.
* Submit and review [source code changes](https://github.com/Microsoft/immersive-reader-sdk/pulls).
* Join the discussion on [StackOverflow](https://stackoverflow.com/questions/tagged/immersive-reader) and [Twitter](https://twitter.com/hashtag/ImmersiveReader).

## Reporting Security Issues

Security issues and bugs should be reported privately, via email, to the Microsoft Security Response Center (MSRC) at
[secure@microsoft.com](mailto:secure@microsoft.com). You should receive a response within 24 hours. If for some reason
you do not, please follow up via email to ensure we received your original message. Further information, including the
[MSRC PGP](https://technet.microsoft.com/en-us/security/dn606155) key, can be found in the
[Security TechCenter](https://technet.microsoft.com/en-us/security/default).

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE.txt) License.
