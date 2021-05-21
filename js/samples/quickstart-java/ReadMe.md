# Immersive Reader - Java Sample

## Prerequisites

* [IntelliJ IDEA Community](https://www.jetbrains.com/idea/download)
* [Java 8 JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

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
1. Launch the IntelliJ IDE.
1. Create a new project in IntelliJ by clicking **New -> Project from Existing Sources...** from the menu bar.
    1. Choose the **immersive-reader-sdk/js/samples/quickstart-java** folder.
    1. Click **Import project from external model** and select **Maven**. Click Next.
    1. Leave all default settings and click Next.
    1. Under **Select Maven projects to import**, ensure **Microsoft.ImmersiveReader.quickstart-java:1.0-SNAPSHOT** is checked and press Next.
    1. Under **Project SDK**, if the Java JDK does not show up, click the plus sign and select the Java JDK from the location it was downloaded to, then click Next.
    1. After naming the project and selecting a location for the project, click Finish.

1. Add a new run configuration by clicking **Run -> Edit Configurations...**
    1. Click the plus sign on the left side of the **Run/Debug Configurations** popup to add a new configuration and select **Maven**.
    1. In the **Name** field, enter **Tomcat**.
    1. Under the **Parameters** tab, in the **Working directory** field, ensure the path to the project is entered.
    1. In the **Command line** field, enter **tomcat7:run**.
    1. At the bottom of the popup under **Before launch: Activate tool window**, click the plus sign and select **Run Maven Goal**.
    1. In the **Command line** field enter **clean**. Click OK.
    1. Click Apply, then click OK to close the window.

1. Add a file named `.env` to the root folder and add the following, supplying values as appropriate. Be sure not to commit this file into source control, as it contains secrets that should not be made public.

    ```text
    SUBSCRIPTION_KEY=<YOUR_SUBSCRIPTION_KEY>
    REGION=<YOUR_REGION>
    ```

1. Run the sample project by pressing **Shift + F10** or by clicking the **Run** button.

1. Open a web browser and navigate to [http://localhost:8888](http://localhost:8888) to view the sample.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
