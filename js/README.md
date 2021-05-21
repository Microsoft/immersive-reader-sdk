# Azure Immersive Reader - Immersive Reader JavaScript SDK

[![Build status](https://dev.azure.com/ms/immersive-reader-sdk/_apis/build/status/96)](https://dev.azure.com/ms/immersive-reader-sdk/_build?definitionId=96)

The Immersive Reader JavaScript SDK is a JavaScript library that allows you to easily and quickly integrate the [Immersive Reader](https://azure.microsoft.com/services/cognitive-services/immersive-reader/) into your web application.

## Usage

Microsoft 1st Party Office applications should use the `v0.5.8` Immersive Reader JavaScript SDK, this SDK's authentication token is retrieved by providing a `SubscriptionKey` and `Region`. This will ensure the Immersive Reader uses Office compliant APIs deployed to OSI.

Here are the steps:

1. Create a Microsoft Internal billable App Service Subscription via the AIRS portal: https://aka.ms/airs and be sure to add more than one owner.
1. Once you have access to the Subscription created via AIRS in the Azure portal https://portal.azure.com - use it to create the Immersive Reader Resource.
1. From the Subscription go to Resources and click the `Add` button.
1. Search for "Immersive Reader" and click the `Create` button.
1. Provide the project details, ensuring one of the following regions is selected: `eastus`, `westus`, `northeurope`, `westeurope`, `centralindia`, `japaneast`, `australiaeast` (the Learning tools Service on OSI only supports these regions) and click next.
1. (optional) Add any tags and click next.
1. Review the terms and click the `Create` button (it’ll take a moment to deploy).
1. Once deployed, click the `Go to resource` button.
1. Click on the `Keys and Endpoint` button in the side menu.
1. These are your secrets. `KEY 1` is the `SubscriptionKey`, `LOCATION` is the `Region`.

> [!IMPORTANT]
> **Be sure not to commit any references that contain secrets into source control, as secrets should not be made public**.

You can find examples of how to acquire an authentication token in the [samples](./samples).

Include the library of the stable build in your web application:

```html
<script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-sdk.0.5.8.js'></script>
```

```bash
npm install @microsoft/immersive-reader-sdk@0.5.8
```

```bash
yarn add @microsoft/immersive-reader-sdk@0.5.8
```

Add an HTML element to your webpage with the `immersive-reader-button` class attribute.

```html
<div class='immersive-reader-button' onclick='launchImmersiveReader()'></div>
```

Next, invoke the Immersive Reader when the button is clicked:

```javascript
function launchImmersiveReader() {
    const content = {
        title: 'Immersive Reader',
        chunks: [ {
            content: 'Hello, world!'
        } ]
    };
    ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, content, options);
}
```

Take a look at the [samples](./samples) for examples of a full end-to-end integration.

The Immersive Reader may use persistent cookies to maintain user preferences and track feature usage. When embedding the Immersive Reader into applications, please consider the requirements of EU Cookie Compliance Policy. Setting the [cookiePolicy option](./src/options.ts) to **CookiePolicy.Enable** will enable the Immersive Reader to use cookies. It is the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy.

## Building

In order to build the SDK, ensure that you have [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), and [Yarn](https://yarnpkg.com/) installed.

Clone a copy of the repo:

```bash
git clone https://github.com/microsoft/immersive-reader-sdk
```

Check out the v0.5.x-master branch of the repo:

```bash
git checkout origin/0.5.x-master
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
