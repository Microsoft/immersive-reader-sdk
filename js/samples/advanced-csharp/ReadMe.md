# Immersive Reader - Advanced Sample

## Overview

This sample demonstrates more of the functionality provided by the Immersive Reader, such as rendering math content, rendering content that contains multiple languages, setting the language of the Immersive Reader UI, and rendering Microsoft Word documents.

This sample also demonstrates how to use a canary to improve security in your web app. A canary is a short-lived, server-generated token, which is generated during an authenticated call to the server. Later, when the user invokes the Immersive Reader, the canary is used to authenticate the call to the server. This mechanism improves security because it adds authentication to the call to launch the Immersive Reader.

## Prerequisites

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads)

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
1. Open __AdvancedSampleWebApp.sln__ in Visual Studio.
1. Right-click on the project in the Solution Explorer and choose __Manage User Secrets__. This will open a file called `secrets.json`. Replace the contents of that file with the following, supplying your values as appropriate:

    ```json
    {
      "SubscriptionKey": YOUR_SUBSCRIPTION_KEY,
      "Region": YOUR_REGION
    }
    ```

> [!IMPORTANT]
> **Be sure not to commit any references that contain secrets into source control, as secrets should not be made public**.

1. Run **Debug > Start Debugging**.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
