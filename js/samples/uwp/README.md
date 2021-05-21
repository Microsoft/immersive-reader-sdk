# ImmersiveReaderView control for UWP


The ImmersiveReaderView control is a Windows Runtime component that allows you to easily and quickly integrate the [Immersive Reader](https://azure.microsoft.com/services/cognitive-services/immersive-reader/) into your UWP application.

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

> [!IMPORTANT]
> **Be sure not to commit any references that contain secrets into source control, as secrets should not be made public**.

11. For sample usage, launch the `ImmersiveReader.sln` file in Visual Studio 2019. Ensure that you have the UWP development tooling installed. Note that ImmersiveReaderView only supports the Fall Creator's Update (16299) or higher.
12. Press `F5` to run the sample application. Enter your Azure information into the sample app and click the `Start immersive reader` button.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.