# Mass Groups & Collaborations Update
Creates and updates collaboration groups,  adds role-based group access to folders.
The script consists of two parts described in detail in the sections below. You can run them both or use the optional flags to decide which part to run.

1. The first part creates groups if they don't already exist, and adding users to them if they are not already there. It takes a .csv file from [UserGroupAdditionPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L20) as input. As you can see in an example CSV file [User_Group_Addition.csv](/examples/Mass%20Groups%20%26%20Collaborations%20Update/User_Group_Addition.csv), each row defines a pair between a group and a user. So each group name can be used multiple times with different users, as well as user can be used multiple times with different groups.
If you want however to skip this part of creating groups, you just need to set a `-SkipGroupsUpdate` flag when running the script.

   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipGroupsUpdate
   ```

2. The second part creates collaborations for groups to the folders only if they don't already exist. It takes a .csv file from [CollaborationsCreationPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L23) as input. As you can see in an example CSV file [Collaborations_Creation.csv](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Collaborations_Creation.csv), each row defines a relation between a group `GroupName` and a folder `FolderId`. Then for each row, the script checks if this group exists and if it's not already added as a collaborator to the pointed folder.
If both of these conditions are met, then a new collaboration is created using the role defined in `CollaborationRole` column.
In case when you want to skip this part of creating collaborations, you just need to set a `-SkipCollabsCreation` flag when running the script.

   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipCollabsCreation
   ```

## Setup Pre-Requisites
1. Clone this GitHub repo or download files from the `/examples` directory
   ```bash
   git clone https://github.com/box/boxcli.git
   ```
2. Install PowerShell or .Net core.
   > If you encounter issues make sure you install both dotnet core and PowerShell
    1. For MacOS & Linux, install the latest version of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2).
    2. For Windows, Install the latest version of [dotnet core](https://dotnet.microsoft.com/download).
    
3. Test PowerShell by running the `pwsh` command in your terminal.
    ```bash
    pwsh
    ```

    ```
    mikechen@mbp create-users-automation % pwsh
    PowerShell 7.2.1
    Copyright (c) Microsoft Corporation.
	
    https://aka.ms/powershell
    Type 'help' to get help.
	
    PS /Users/mikechen>
    ```


4. Create an OAuth Application using the [CLI Setup Quick Start][oauth-guide].

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/


## 1. Script Parameters
1. Update the [UserGroupAdditionPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L20) to set your own Groups Update .csv file path. This .csv file should have two columns with the following headers: `GroupName` and `UserEmail`. The `UserEmail` column should contain the primary email address for the user in Box. The `GroupName` column should contain the name of the group. If the group with this name isn't exist, then it will be created.

	This is an example input .csv:
	|GroupName |UserEmail              |
	|----------|-----------------------|
	|Group 1   | ManagedUser1@test.com |
	|Group 1   | ManagedUser2@test.com |
	|Group 2   | ManagedUser3@test.com |
	|Group 3   | ManagedUser1@test.com |
	|Group 3   | ManagedUser3@test.com |


2. Update the [CollaborationsCreationPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L23) to set your own Collaborations Creation .csv file path. This .csv file should have three columns with the following headers: `GroupName`, `FolderId` and `CollaborationRole`. The `GroupName` column should contain the name of the group, which will be added as a collaborator.  The `FolderId` column should contain ID of a folder to which the collaborator will be added to. The `CollaborationRole` column should contain the name of the role which will be used when creating collaboration.

	This is an example input .csv:
	|GroupName |FolderId |CollaborationRole |
	|----------|---------|------------------|
	|Group 1   | 1111111 | editor           |
	|Group 2   | 1111111 | viewer_uploader  |
	|Group 2   | 2222222 | viewer           |
	|Group 3   | 1111111 | viewer_uploader  |
	|Group 3   | 3333333 | editor           |
	|Group 3   | 4444444 | editor           |

3. Optional: There may be cases where a group has already been a collaborator for a specific folder, but with a role other than that defined in the CSV file.
This script will simply inform you about that case without making any change to existing collaboration. But if you want to update an existing collaboration with role defined in CSV file, you need to pass an additional switch `-UpdateExistingCollabs` when running the script.
   ```bash
   Mass_Groups_Collabs_Update.ps1 -UpdateExistingCollabs
   ```


4. Optional: To run the script only for groups updates (skipping collaboration creation), set the `-SkipCollabsCreation` boolean flag when running the script:
   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipCollabsCreation
   ```

5. Optional: To run the script only for collaborations creation (skipping groups updates), set the `-SkipGroupsUpdate` boolean flag when running the script:
   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipGroupsUpdate
   ```

###  Variables
* `AvailableCollaborationRoles`: This variable defines all available roles that can be used in [Collaborations_Creation.csv](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Collaborations_Creation.csv) file.

	```powershell
	$AvailableCollaborationRoles = @("editor", "viewer", "previewer", "uploader", "previewer_uploader", "viewer_uploader", "co-owner")
	```

## 2. Run the script
Now all you need to do is run the script. Change the directory to the folder containing the script. In this example, it is the `Mass Groups & Collaborations Update` folder.
```
rvb@lab:~/box-cli/examples/Mass Groups & Collaborations Update$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/Mass Groups & Collaborations Update>
```

Run the script:
```bash
./Mass_Groups_Collabs_Update.ps1
```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Mass_Groups_Collabs_Update_all.txt` that contains all log entries.
* `Mass_Groups_Collabs_Update_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.
