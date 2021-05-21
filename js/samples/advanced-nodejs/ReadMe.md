# Immersive Reader - Node.js Sample

## Prerequisites

* Install [Yarn](https://yarnpkg.com), [npm](https://npmjs.com)

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
1. Open a command prompt (Windows) or terminal (OSX, Linux)
1. Navigate to the **immersive-reader-sdk/js/samples/advanced-nodejs** directory
1. Run `yarn install`
1. Create a file called **.env** and add the following, supplying values as appropriate.

    ```text
      SUBSCRIPTION_KEY={YOUR_SUBSCRIPTION_KEY}
      REGION={YOUR_REGION}
    ```

> [!IMPORTANT]
> **Be sure not to commit any references that contain secrets into source control, as secrets should not be made public**.

1. Run `yarn build:dev`

1. Run `yarn run start` (or `nodemon start` if you want to view changes you make after doing a browser refresh)

1. Open a web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the sample

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
