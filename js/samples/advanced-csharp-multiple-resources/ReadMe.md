﻿# Immersive Reader - C# Multiple Resources Sample

## Prerequisites

* Install [Yarn](https://yarnpkg.com), [npm](https://npmjs.com)

## Usage

Microsoft 1st Party Office applications should use the `v0.0.3` Immersive Reader JavaScript SDK and the `v0.0.1` SDK's authentication token retrieved by providing a `SubscriptionKey` and `Region`. This will ensure the Immersive Reader uses Office compliant APIs deployed to OSI.

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
1. Open **MultipleResourcesSampleWebApp.sln** in Visual Studio.
1. Right-click on the project in the Solution Explorer and choose **Manage User Secrets**. This will open a file called **secrets.json**. Replace the contents of that file with the following, supplying your values as appropriate:

    ```json
    {
        "ImmersiveReaderResourceOne":
        {
            "SubscriptionKey": "<YOUR_SUBSCRIPTION_KEY>",
            "Region": "<YOUR_REGION>"
        },
        "ImmersiveReaderResourceTwo":
        {
            "SubscriptionKey": "<YOUR_SUBSCRIPTION_KEY>",
            "Region": "<YOUR_REGION>"
        }
    }
    ```

> [!IMPORTANT]
> **Be sure not to commit any references that contain secrets into source control, as secrets should not be made public**.

1. Run **Debug > Start Debugging**.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
