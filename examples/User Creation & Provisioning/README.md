# Provision users and folders

This PowerShell script uses the Box CLI to build and create a personal folder structure, create managed users in bulk, and provision such new users by adding them to the newly created folder structure as collaborators with viewer or uploader roles.

**For detailed script overview, please follow [this guide](https://developer.box.com/guides/cli/quick-start/powershell-script-templates/).**

## Setup Pre-Requisites
1. Clone this github repo or download files from the `/examples` directory.
	```bash
	git clone https://github.com/box/boxcli.git
	```
2. Install PowerShell or .Net core.
	> If you encounter issues make sure you install both dotnet core and PowerShell
    1. For MacOS & Linux, Install the latest version of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2).
    2. For Windows, Install the latest version of [dotnet core](https://dotnet.microsoft.com/download).
	
3. Test PowerShell by running the `pwsh` command in your terminal.
	```bash
	pwsh
	```
	
	You will see similar output:
	```
	mikechen@mbp create-users-automation % pwsh
	PowerShell 7.2.1
	Copyright (c) Microsoft Corporation.

	https://aka.ms/powershell
	Type 'help' to get help.

	PS /Users/mikechen>
	```

4. Create an OAuth Application using the [CLI Setup Quick Start][oauth-guide].

## Configure the script
### Update the list of employee accounts for creation

The header row should look like the below:

firstName,lastName,email,username

NOTE 1 - EMAILS MUST BE UNIQUE ACROSS ALL OF BOX - CANNOT CREATE EMAILS USED PREVIOUSLY

NOTE 2 - USERNAME MUST BE UNIQUE ACROSS YOUR BOX INSTANCE. - THIS IS USED FOR THE PERSONAL FOLDER NAME

For example, update the [employees_5.csv](/examples/User%20Creation%20%26%20Provisioning/Employees_5.csv) with the following data:
```
Managed,User 1,ManagedUser1@test.com,manageduser1
Managed,User 2,ManagedUser2@test.com,manageduser2
Managed,User 3,ManagedUser3@test.com,manageduser3
```
### List of parameters

- `EmployeeList`: Path to Employee List CSV.
- `PersonalFolderParentID`: Destination folder ID for all personal folders to be created in, either when using JSON file as input to create folder structure, or uploading local structure. This folder should be made prior to running the script the first time. It is not advised to make this value 0, as this will create individual Personal folders in root of the account you set up the cli with.
- `FolderStructureJSONPath`: Your own Folder Structure JSON Path. 
- `PersonalFolderSlug`. Ending name of the folder that will be created as parent for folders from JSON structure. It's set to `Personal Folder` by default, but feel free to set it to your needs. The username is concatenated with this value to create each user's personal folder name. ex - `rsmith2's Personal Folder`.
- `LocalUploadPath`: Local directory to directly upload folder structure.

**Note**: Please specify either a local upload path or a folder structure JSON path, not both.

### Define script parameters

There are 3 ways to pass parameters:
* Use hardcoded value in script:

Please update all needed parameters in the script [here](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L19-L38) before running.

* Run script with parameters:

You can also specify parameters while run the command, for example:
```
PS > ./Users_Create_Provision.ps1 -EmployeeList ./Employees_1.csv `
	-FolderStructureJSONPath ./Folder_Structure.json `
	-PersonalFolderSlug "Personal Folder" `
	-PersonalFolderParentID 123456789

Starting User Creation & Provisioning script...
```

* If you don't specify parameters, the script will prompt you to enter it.

```
PS > ./Users_Create_Provision.ps1
Please enter the path to the employee list CSV file:
./Employees_1.csv
Please enter the path to the folder structure JSON file or the local upload path:
Folder_Structure.json
Folder structure JSON path set to: Folder_Structure.json
Please enter the ID of the parent folder for the personal folders to be created in:
1234567689
Starting User Creation & Provisioning script...
```

## Run the script
Now all you need to do is run the script. Change the directory to the folder containing the script. In this example, it is the `User Creation & Provisioning` folder.
```
rvb@lab:~/box-cli/examples/User Creation & Provisioning$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/User Creation & Provisioning>
```

Run the script: 
```bash
./Users_Create_Provision.ps1
```

When all parameters are defined, you will see following output to confirm the script started:
```
PS /home/rvb/box-cli/examples/User Creation & Provisioning> ./Users_Create_Provision.ps1
Starting User Creation & Provisioning script...
```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Users_Create_Provision_all.txt` that contains all log entries.
* `Users_Create_Provision_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
