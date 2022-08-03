# Create Users & Provisioning Automation
This User Creation and Provisioning powershell script will use the Box CLI to build and create a user (admin or service account) owned "Onboarding" folder structure, create managed users in bulk, and provision the new users by collaborating them as viewer and uploaders into the newly created folder structure.

For detailed script overview, please follow [PowerShell Scripts with the Box CLI guide](https://developer.box.com/guides/cli/quick-start/powershell-script-templates/)

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

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/

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
3. Update the [FolderStructureJSONPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L13) to set your own Folder Structure JSON path.
4. Optional: To directly upload folder structure from local directory, update [LocalUploadPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L14), comment out [Create-Folder-Structure](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L37), and uncomment [OnboardingFolderId](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L40). 

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


## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Box

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
