# Deprovision & Delete Users Automation
This Box CLI script deprovision a list of users by first transfering user content to another user's root folder under "Employee Archive" before deleting that user.

> For every user, script makes 7 API calls to archive their content and delete the account.

**For detailed script overview, please follow [this guide](https://developer.box.com/guides/cli/scripts/deprovision-users/).**

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
   
   ```bash
   mikechen@mbp create-users-automation % pwsh
   PowerShell 7.2.1
   Copyright (c) Microsoft Corporation.
   
   https://aka.ms/powershell
   Type 'help' to get help.
   
   PS /Users/mikechen>
   ```

4. Create an OAuth Application using the [CLI Setup Quick Start][oauth-guide].

## Configure the script
### Update the list of employees for deletion

The header row should look like the below:

name,email

For example, update the [Employees_to_delete.csv](/examples/User%20Deprovisioning/Employees_to_delete.csv) with the following data:
```
Managed,User 1,ManagedUser1@test.com,manageduser1
Managed,User 2,ManagedUser2@test.com,manageduser2
Managed,User 3,ManagedUser3@test.com,manageduser3
```

### List of parameters
- `EmployeeList`: Path to Employee List CSV with employees to be deleted.
- `SkipTransferContent`: [Optional, default value: `$false`] Set this flag to skip transfer of user content before deletion when running the script:
`./Users_Deprovision.ps1 -SkipTransferContent`.
Otherwise user's content will be transferred.
- `NewFilesOwnerID`: [Optional in interactive mode] The ID of the user to transfer files to before deleting the user.
If not specified, the script will prompt to input in the interactive mode, or use the current authenticated user ID to receive the content.
- `EmployeeArchiveFolderName`: [Optional, default value: 'Employee Archive'] The name of a folder, where users' content will be moved to if `$SkipTransferContent` is set to `$false`.
If a folder with this name already exists in the user's `$NewFilesOwnerID` root folder, it will be used. Otherwise, a new one will be created.
- `DryRun`: [Optional, default value: $false] A flag that determines the script should be run in a mode, where no delete/create/update calls will be made, only read ones. The default is `$false`, which means that all calls will be made. To enable `dry run` mode, set this flat when running the script:
`./Users_Deprovision.ps1 -DryRun`.

### Define script parameters

There are 3 ways to pass parameters:

* Use hardcoded value in script:

Please update all needed parameters in the script [here](/examples/User%20Deprovisioning/Users_Deprovision.ps1#L17-L36) before running.

* Run script with parameters:

You can also specify parameters while run the command, for example:

```bash
PS > ./Users_Deprovision.ps1 -EmployeeList ./Employees_to_delete.csv `
   -NewFilesOwnerID  123456789`
   -EmployeeArchiveFolderName "Employee Archive"

Starting User Deprovisioning script...
```

* If you don't specify parameters, the script will prompt you to enter it.

```bash
PS > ./Users_Deprovision.ps1
Please enter the path to the employee list CSV file:
./Employees_to_delete.csv
Please specify the user ID of the user who will own the files of the users being deprovisioned.
Press Enter if you want to use the current user as the new owner.
User ID: 1234567689
Starting User Deprovisioning script...
```

## Run the script
Now all you need to do is run the script. Change the directory to the folder containing the script. In this example, it is the `User Deprovisioning` folder.

```bash
rvb@lab:~/box-cli/examples/User Deprovisioning$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/User Deprovisioning>
```

Run the script:

```bash
./Users_Deprovision.ps1
```

When all parameters are defined, you will see following output to confirm the script started:

```bash
PS /home/rvb/box-cli/examples/User Deprovisioning> ./Users_Deprovision.ps1
Starting User Deprovisioning script...
```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Users_Deprovision_all.txt` that contains all log entries.
* `Users_Deprovision_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
