# Immersive Reader - Android Kotlin Sample

## Prerequisites

* [Android Studio](https://developer.android.com/studio)

## Usage

Microsoft 1st Party Office applications should use the `v0.5.8` Immersive Reader JavaScript SDK and the SDK's authentication token is retrieved by providing a `SubscriptionKey` and `Region`. This will ensure the Immersive Reader uses Office compliant APIs deployed to OSI.

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
1. Launch Android Studio and open the project from the **immersive-reader-sdk/js/samples/quickstart-kotlin** directory.
1. Create a file named **env** to the **/assets** folder and add the following, supplying values as appropriate. Be sure not to commit this file into source control, as it contains secrets that should not be made public.

    ```text
    SUBSCRIPTION_KEY=<YOUR_SUBSCRIPTION_KEY>
    REGION=<YOUR_REGION>
    ```

1. Choose a device emulator from the AVD Manager and run the project.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
