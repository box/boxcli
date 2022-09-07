# Provision users and folders

This PowerShell script uses the Box CLI to build and create an onboarding folder structure, create managed users in bulk, and provision such new users by adding them to the newly created folder structure as collaborators with viewer or uploader roles.

**For detailed script overview, please follow [this guide](https://developer.box.com/guides/cli/quick-start/powershell-script-templates/).**

## Setup Pre-Requisites
1. Clone this github repo or download files from the `/examples` directory
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
For example, update the [employees_5.csv](/examples/User%20Creation%20%26%20Provisioning/Employees_5.csv) with the following data:
```
firstName,lastName,email
Managed,User 1,ManagedUser1@test.com
Managed,User 2,ManagedUser2@test.com
Managed,User 3,ManagedUser3@test.com
```
### List of parameters

- `EmployeeList`: Path to Employee List CSV.
- `RootFolderParentID`: Destination folder ID for your changes, either when using JSON file as input to create folder structure, or uploading local structure. It is set to `0` by default, but feel free to set it to your needs.
- `FolderStructureJSONPath`: Your own Folder Structure JSON Path. You can also change the `RootFolderName`. It's a name of the folder, that will be created as parent for folders from JSON structure. It's set to `Onboarding` by default, but feel free to set it to your needs.
- `LocalUploadPath`: Local directory to directly upload folder structure.

**Note**: Please specify either a local upload path or a folder structure JSON path, not both.

### Define script parameters

There are 3 ways to pass parameters:
* Use hardcoded value in script:

Please update all needed parameters in the script [here](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L26-L38) before running.

* Run script with parameters:

You can also specify parameters while run the command, for example:
```
PS > ./Users_Create_Provision.ps1 -EmployeeList ./Employees_1.csv `
	-FolderStructureJSONPath ./Folder_Structure.json `
	-RootFolderName Onboarding `
	-RootFolderParentID 0

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
Please enter the ID of the parent folder for the root folder:
0
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
