# Immersive Reader - Python Sample

## Installation

### Windows Installation

1. Install [Python](https://www.python.org/downloads/). Choose **custom installation** and set the installation path as your root folder, e.g. `C:\Python37-32\`.
1. Open a Command Prompt.
1. Run `setx PATH "%PATH%;C:\Python37-32\Scripts"` to add the path of your [pip](https://docs.python.org/3/installing/index.html) installation to your PATH environment variable.
1. Run `pip install flask` to install [Flask](https://www.fullstackpython.com/flask.html).
1. Run `pip install Jinja2` to install [Jinja](http://jinja.pocoo.org/docs/2.10/intro/#installation).
1. Run `pip install virtualenv` to install [virtualenv](https://virtualenv.pypa.io/en/latest).
1. Run `pip install virtualenvwrapper-win` to install [virtualenvwrapper](https://pypi.org/project/virtualenvwrapper-win/).
1. Run `pip install requests` to install the [requests](https://pypi.org/project/requests/2.7.0/) module.
1. Run `pip install python-dotenv` to install the [python-dotenv](https://github.com/theskumar/python-dotenv) module.

### OSX Installation

1. Install [Python](https://www.python.org/downloads/). The Python root folder, e.g. `Python37-32`, should now be in the Applications folder.
1. Launch Terminal.
1. Run `curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py` followed by `python get-pip.py --user` to install [pip](https://docs.python.org/3/installing/index.html) for the current user.
1. Add the path of your pip installation to your PATH variable.
   1. Run `sudo nano /etc/paths`.
   1. Enter your password, when prompted.
   1. Go to the bottom of the file, and enter the path of your pip installation as the last item of the list, e.g. `PATH=$PATH:/usr/local/bin`.
   1. Press Control-X to quit.
   1. Enter `Y` to save the file.
1. Run `pip install flask --user` to install [Flask](https://www.fullstackpython.com/flask.html).
1. Run `pip install Jinja2 --user` to install [Jinja](http://jinja.pocoo.org/docs/2.10/intro/#installation).
1. Run `pip install virtualenv --user` to install [virtualenv](https://virtualenv.pypa.io/en/latest/).
1. Run `pip install virtualenvwrapper --user` to install [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/).
1. Run `pip install requests --user` to install the [requests](https://pypi.org/project/requests/2.7.0/) module.
1. Run `pip install python-dotenv --user` to install the [python-dotenv](https://github.com/theskumar/python-dotenv) module.
1. Run `mkdir ~/.virtualenvs` to configure a folder to store your virtual environments.

## Usage

### Windows Usage

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
1. Open a Command Prompt.
1. Run `mkvirtualenv quickstart-python` to make a virtual environment.
1. `cd` to the sample project root folder on your local machine e.g. `cd C:\immersive-reader-sdk\js\samples\quickstart-python`.
1. Run `setprojectdir .` to connect the sample project to the virtual environment.
1. Run `activate` command to ensure the virtual environment is activated.

1. Create a file called **.env** and add the following to it, supplying the corresponding information where appropriate:

    ```text
    SUBSCRIPTION_KEY={YOUR_SUBSCRIPTION_KEY}
    REGION={YOUR_REGION}
    ```

1. Run `flask run` to run the sample project.

1. Open a web browser and navigate to [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to view the sample.

### OSX Usage

1. Launch Terminal and `cd` to the sample project root folder, e.g. `cd immersive-reader-sdk/js/samples/quickstart-python`.

1. Run `mkvirtualenv -p /usr/local/bin/python3 quickstart-python` to make a virtual environment.

1. Create a file called **.env** and add the following to it, supplying the corresponding information where appropriate:

    ```text
    SUBSCRIPTION_KEY={YOUR_SUBSCRIPTION_KEY}
    REGION={YOUR_REGION}
    ```

1. Run `flask run` to run the sample project.

1. Open a web browser and navigate to [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to view the sample.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.
