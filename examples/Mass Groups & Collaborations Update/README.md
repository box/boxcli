# Mass Groups & Collaborations Update #

## Overview ##
The Mass Groups and Collaborations Update powershell script will use the Box CLI to create or update groups, add users to them and finally to create collaborations for groups to the folders.

The entire script consists of two parts, each of which can be run separately or both.

1. The first part is responsible for creating groups if they don't already exist, and adding users to them if they are not already there. It takes a .csv file from [GroupsUpdatePath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L19) as input. As you can see in an example csv file [Groups_Update.csv](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Groups_Update.csv), each row defines a pair between a group and a user. So each group name can be used multiple times with different users, as well as user can be used multiple times with different groups.
if you want however to skip this part of creating groups, you just need to set a `-SkipGroupsUpdate` flag when running the script.

   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipGroupsUpdate
   ```

2. The second part is responsible for creating collaborations for groups to the folders only if they don't already exist. It takes a .csv file from [CollaborationsCreationPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L22) as input. As you can see in an example csv file [Collaborations_Creation.csv](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Collaborations_Creation.csv), each row defines a relation between a group `GroupName` and a folder `FolderId`. Then for each row the script checks if this group exists and if it's not already added as a collaborator to pointed folder.
if both of these conditions are met, then new collaboration is created using the role defined in `CollaborationRole` column.
In case when you want to skip this part of creating collaborations, you just need to set a `-SkipCollabsCreation` flag when running the script.

   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipCollabsCreation
   ```

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
1. Update the [GroupsUpdatePath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L19) to set your own Groups Update .csv file path. This .csv file should have two columns with the following headers: `GroupName` and `UserEmail`. The `UserEmail` column should contain the primary email address for the user in Box. The `GroupName` column should contain the name of group. If the group with this name isn't exist, then it will be created.

	This is an example input .csv:
	|GroupName |UserEmail              |
	|----------|-----------------------|
	|Group 1   | ManagedUser1@test.com |
	|Group 1   | ManagedUser2@test.com |
	|Group 2   | ManagedUser3@test.com |
	|Group 3   | ManagedUser1@test.com |
	|Group 3   | ManagedUser3@test.com |


2. Update the [CollaborationsCreationPath](/examples/Mass%20Groups%20%26%20Collaborations%20Update/Mass_Groups_Collabs_Update.ps1#L22) to set your own Collaborations Creation .csv file path. This .csv file should have three columns with the following headers: `GroupName`, `FolderId` and `CollaborationRole`. The `GroupName` column should contain the name of group, which will be added as a collaborator.  The `FolderId` column should contain ID of a folder to which the collaborator will be added to. The `CollaborationRole` column should contain the name of the role which will be used when creating collaboration.

	This is an example input .csv:
	|GroupName |FolderId |CollaborationRole |
	|----------|---------|------------------|
	|Group 1   | 1111111 | editor           |
	|Group 2   | 1111111 | viewer_uploader  |
	|Group 2   | 2222222 | viewer           |
	|Group 3   | 1111111 | viewer_uploader  |
	|Group 3   | 3333333 | editor           |
	|Group 3   | 4444444 | editor           |


3. Optional: To run the script only for groups updates (skipping collaboration creation), set the `-SkipCollabsCreation` boolean flag when running the script:
   ```bash
   Mass_Groups_Collabs_Update.ps1 -SkipCollabsCreation
   ```

4. Optional: To run the script only for collaborations creation (skipping groups updates), set the `-SkipGroupsUpdate` boolean flag when running the script:
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
Logs are written to a `logs` folder within the folder that contains this script. The logs are named `Mass_Groups_Collabs_Update_all.txt` and `Mass_Groups_Collabs_Update_errors.txt`. The former contains all log entries and the latter contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Box

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
