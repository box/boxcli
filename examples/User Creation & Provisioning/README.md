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

## 1. Script Parameters
1. Update the [EmployeeList](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L10) to set your own Employee List CSV Path.
2. Customize the input file of employee accounts for creation.
    For example, update the [employees_5.csv](/examples/User%20Creation%20%26%20Provisioning/Employees_5.csv) with the following data:
    ```
    firstName,lastName,email
    Managed,User 1,ManagedUser1@test.com
    Managed,User 2,ManagedUser2@test.com
    Managed,User 3,ManagedUser3@test.com
    ```
3. Update the [RootFolderParentID](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L21) to set destination folder ID for your changes, either when using JSON file as input to create folder structure, or uploading local structure. It is set to `0` by default, but feel free to set it to your needs.
4. Update the [FolderStructureJSONPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L13) to set your own Folder Structure JSON path. You can also change the [RootFolderName](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L17). It's a name of the folder, that will be created as parent for folders from JSON structure. It's set to `Onboarding` by default, but feel free to set it to your needs.
5. Optional: To directly upload folder structure from local directory, update [LocalUploadPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L14), comment out [New-Folder-Structure](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L113), and uncomment [RootFolderID](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L116-L117). 

## 2. Run the script
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

You will see following output to confirm the script started:
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
