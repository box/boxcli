# Box CLI

## Prerequisites for Building from Source
* [.Net Core SDK v2.0](https://www.microsoft.com/net/core)

### Steps to Build from Source
1. Clone, fork, or download this Github repo.
2. Navigate to the `BoxCLI/BoxCLI` folder
3. Run the following command to create a build:
    * `dotnet build -r <target-runtime>`
    * Replace `<target-runtime>` with the OS you're building for, such as osx.10.12-x64
    * The binary will be located in `./bin/Debug/netcoreapp2.0/<target-runtime>/box`
4. If you're building for production, run the following command instead:
    * `dotnet publish --configuration Release --runtime <target-runtime>`
    * The binary will now be located in `./bin/Release/netcoreapp1.1/<target-runtime>/publish`
    * You'll need the entire contents of the publish folder

## CLI Initial Setup
### Step 1. Create a Box application
1. Log in or create a free developer account through the [Box Developer Console](https://developers.box.com)
2. Select "Create New App"
    * Select "Enterprise Integration" and press "Next"
    * Select "Server Authentication" and press "Next"
    * Name the application "Box CLI - YOUR NAME"
        * *Application names must be unique across Box*
    * Press "Create App" and then "View Your App"
3. You can customize the access you give the Box CLI by changing your application settings.
    * Under "Application Access", if you select "Enterprise" you can work with existing Managed Users in your Enterprise.
    * If you want to work with existing Managed Users in your Enterprise, you'll also need to toggle "Perform Actions as Users" to on.
    * Checking "Manage Webhooks" allows the CLI to create, read, update, and delete webhooks in your Enterprise.
    * To use the token creation feature within the CLI, you'll need to toggle "Generate User Access Tokens" to on.

### Step 2. Generate your private and public keys
1. You can generate a private/public keypair directly from the Developer Console, or optionally, create your own private/public keypair.
    * If you choose to generate a keypair from the Developer Console, save the resulting JSON file to a secure location on your computer. You'll need this file later. 
    * *Note:* Box does not store your private key, so this is the only time you can retrieve your private key.
#### To generate your own private/public keypair follow these steps:
*Note*: You may need to download a tool like [Cygwin](https://www.cygwin.com/) to use commands like `openssl` in a Windows environment.
1. In a secure location on your computer, run the following commands to generate a private key:
    ```
    openssl genrsa -aes256 -out private_key.pem 2048
    openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```
    You'll need the passphrase for your private key later
2. To add the public key to the application, click "Add Public Key"
    * You will need to set up 2-factor authentication, if you haven't already
3. Copy the public key: `cat public_key.pem | pbcopy`
4. Paste it into the "Public Key" field
5. Click "Verify and Save"
    * You will need to enter a 2-factor confirmation code
    * You'll need the ID of your public key later

### Step 3. Download your configuration file
1. In the Developer Console under "App Settings", you can download a JSON configuration file for this application. You'll provide this configuration file to the CLI in the next section.
    * If you used the Developer Console to generate your private/public keypair, you already have this configuration file and can skip this step.
2. Click "Download as JSON" and open the JSON file in a text editor.
3. Within a subsection of the JSON, you should see the following: 
    ```json
    ...
    "appAuth": {
      "publicKeyID": "",
      "privateKey": "",
      "passphrase": ""
    }
    ...
    ```
4. You'll need to add the values for `publicKeyID` and `passphrase` from the keypair you created in Step 2.
5. For the `privateKey` field, enter a file path to the private key PEM file you generated in Step 2.
    * For example, `"privateKey": "~/keys/box/private_key.pem"` or `"privateKey": "/Users/agrobelny/keys/box/private_key.pem"`
    * The CLI is flexible with this setting. You can also use an option to provide the file path to the private key PEM file separately, as shown later.
6. Save this file in a secure location on your computer.

### Step 4. Authorize the application into your Box account
1. In a new tab, log into your Box account as an admin and go to the Admin Console
    * *Applications that use Server Authentication must be authorized by the admin of the account*
    * Each free developer account comes with a Box Enterprise, so you can try out the CLI in this environment before installing into your company Enterprise.
2. Under the gear icon, go to Enterprise Settings (or Business Settings, depending on your account type)
    * You'll need the "Enterprise ID" of your account later
3. Go to the Apps tab
3. Under "Custom Applications", press "Authorize New App"
4. Enter your "Client ID" from the developer console in the "API Key" field
    * Your application is now authorized to access your Box account

### Step 5. Download, install, and set up the CLI
1. Download the version of the CLI for your OS.
2. The Box CLI supports configuring multiple environments each with their own JSON configuration files. 
3. To set your first environment, run the following command and provide the file path to your JSON configuration file:
    * `box configure environments add ~/Downloads/config.json --name CLI`
    * To set the private key PEM file path separately, use the following command: `box configure environments add ~/Downloads/config.json --name CLI --private-key-path ./private_key.pem`
4. Check that the CLI is configured correctly and working with the following command:
    * `box users get me`

## Settings
The Box CLI has several settings you use to change its default behavior.

Access the Box CLI settings with the `box configure settings` command.

* `box configure settings list`
    * Use this command to see all current settings

### Box Reports and Box Downloads
One of the Box CLI settings is for the folders that the CLI uses to generate reports and to download files.

The reports folder is named `Box Reports` and stored in the appropriate `Documents` area for your OS and current user.

The downloads folder is named `Box Downloads` and stored in the appropriate `Downloads` area for your OS and current user.

* `get-folder-name`
    * Use the `-r|--reports` or `-d|--downloads` flag to see the current name of the Box Reports and Box Downloads folders
* `set-folder-name`
    * Use the `-r|--reports` or `-d|--downloads` flag change the default name of the Box Reports and Box Downloads folders
* `get-folder-path`
    * Use the `-r|--reports` or `-d|--downloads` flag to see the current path of the Box Reports and Box Downloads folders
* `set-folder-path`
    * Use the `-r|--reports` or `-d|--downloads` flag change the default path of the Box Reports and Box Downloads folders

### Toggle JSON Output
The CLI will print responses to the commands you use in plain text with informative messages. 

If you'd prefer to instead receive the direct JSON response from the API for all calls, you can toggle this setting instead of including `--json` on every individual call.

* `toggle-output-json`
    * Sets every command to print the JSON response from the API.

### Box Reports File Format
When you use `--save` with a command, the CLI defaults to JSON for the file format. You can change this to CSV to automatically save as CSV files instead.

* `get-file-format`
    * Get the current file format for reports.
* `set-file-format`
    * Set the current file format for reports. Use `-j|json` or `-c|--csv`.

## Common CLI Commands and Options
* `-h|--help`
    * The help option will list more instructions on using commands and subcommands.
* `--as-user`
    * Many commands support taking actions on-behalf of users. You'll need the user's ID, which you can often retrieve quickly with the `box users search` command.
    * Your application must have the "Perform Actions as Users" setting turned on.
* `--save`
    * Many commands support the `save` option to create reports from Box data. These files are saved to your `Documents` folder under `Box-Reports` by default. You can change this within `box configure settings`.
* `--file-format`
    * Paired with the `save` command, you can select either `json` or `csv` for the reports saved from the CLI.
* `--json`
    * Using this option sends back the API's JSON response directly to stdout. It's useful to pair this option to create files from stdout: `box folders list-items 0 --json > ~/Documents/folders-list-items-0.json`.
* `--id-only`
    * Using this option is useful for chaining commands together based on stdout.
    * For example, with Bash:
    ```sh
    USER_ID="$(box users create otis --app-user --id-only)" && \
    FOLDER_ID="$(box folders create 0 first-folder --as-user $USER_ID --id-only)" && \
    box files upload ~/Documents/Welcome.pptx --as-user $USER_ID -p $FOLDER_ID
    ```
    * Or, with PowerShell:
    ```
    # Change this file path
    $FILE_PATH = "C:\Users\AM\Documents\Welcome.pptx"
    $USER_ID = box users create otis --app-user --id-only;
    $FOLDER_ID = box folders create 0 first-folder --as-user $USER_ID --id-only;
    box files upload $FILE_PATH --as-user $USER_ID -p $FOLDER_ID;
    ```
    * The previous command creates a new App User, creates a folder within that App User's root folder, and uploads a "Welcome.pptx" file to this new folder.
* `--bulk-file-path`
    * Used to take bulk actions on Box objects. See the section below on bulk actions for more information.
* `box configure environments add ~/Downloads/954218_4lvitde1_config.json --name AMSXBGCLI`
* `box configure environments set-current NEWENV`
* `box users list`
* `box users search allenmichael -m`
    * Searches across users for this keyword and only returns Managed Users in the results
* `box folders list-items 0 --save --as-user 275111793`
    * This command will list files and folders under the root folder for a user.
    * If you use this command without `--as-user`, the CLI lists files and folders owned by the Service Account. 
* `box files upload ~/Documents/Welcome.pptx -p 0`
    * Uploads a file to a folder -- in this case, the root folder as indicated by "0".
    * Upload utilizes the optimized chunked upload if files are larger than 50MB.
* `box files download 204158255477`
    * Downloads a file to your local disk.
    * Downloaded files are saved to your `Documents` folder under `Box-Downloads` by default. You can change this within `box configure settings`.
    * *Note:* Downloading a file with the same name as an existing file in `Box-Downloads` will overwrite the file in `Box-Downloads`.
* `box events poll --as-user 275111793`
    * Starting the events poll with an Admin user ID will capture Enterprise events
* `box webhooks create 34250344135 folder "FILE.UPLOADED,FILE.DOWNLOADED" https://amsxbg.ngrok.io`
    * See [this guide](https://developer.box.com/v2.0/docs/getting-started-with-webhooks-v2) for more on webhooks.
    * The Service Account should create most webhooks. Only use `as-user` with `box webhooks create` if you have an explicit reason.
* `box tokens get`
    * Returns a token for the Service Account.
* `box tokens get -u 275111793`
    * Returns a token for this user. Your application must have the "Generate User Access Tokens" setting turned on.
* `box tokens exchange base_explorer -t hrc8tDs2fIeNuXDvMmtLksFRzBC1m0xx --folder-id 34250344135`
    * Utilizes token exchange to get a downscoped token.
* `box folders metadata create 36173775345 enterprise cli --kv "settings=one, two, three&home=2002-10-02T10:00:00-05:00&env=app"`
    * Creates metadata on a folder using the Enterprise scope, a metadata template with the key `cli`, and the `--kv` flag to enter fields for `settings` (a string data type), `home` (a date data type), and `env` (an enum data type).

## Bulk Actions
The CLI supports bulk actions for several commands. Each bulk action requires a file containing the Box objects you're performing bulk actions against.

*Note:* Bulk `delete` actions ignore any prompting and default to not notify and to force deletion if the Box object supports those features.

For example:

`box users create --bulk-file-path ~/Documents/Box-Reports/create-users.json`

The CLI automatically detects the file format is JSON. The JSON must adhere to the following formatting:
```json
{
    "entries": [
        ...
        {
            "name": "AM",
            "is_platform_access_only": true
        },
        {
            "name": "Otis",
            "is_platform_access_only": true
        }
        ...
    ]
}
```
In the case of `delete` and `update` commands that support bulk actions, the Box objects usually need to include the objects' IDs. For `delete`, usually an ID is all that is needed.

`box users delete --bulk-file-path ~/Documents/delete-users.json`
```json
{
    "entries": [
        ...
        {
            "id": "2362696581"
        },
        {
            "id": "2362696772"
        }
        ...
    ]
}
```
*Note:* CSV files are also supported for bulk actions, but require special CSV templates. 

## Service Account
The application you created in the initial steps grants you access to a Box [Service Account](https://developer.box.com/docs/service-account). One immediate benefit of having a Service Account is the ability to store, manage, and collaboration content owned by this Service Account. 

For example: 
```sh
FOLDER_ID="$(box folders create 0 "Welcome to Box" --id-only)" && \
box files upload ~/Documents/Welcome.pptx -p $FOLDER_ID && \
USER_ID="$(box users create otis --app-user --id-only)" && \
box collaborations add $FOLDER_ID folder --editor --user-id $USER_ID && \
box collaborations add $FOLDER_ID folder --editor --user-id 275111793 
```
This script creates a new "Welcome to Box" folder and uploads a "Welcome.pptx" file to this folder. The script then creates a new user and collaborates both the new user and an existing user as editors on this folder.

Support
-------

Need to contact us directly?
* [Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum).

Copyright and License
---------------------

Copyright 2017 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
