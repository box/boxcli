# Create Users & Provisioning Automation
This User Creation and Provisioning powershell script will use the Box CLI to build and create a user (admin or service account) owned "Onboarding" folder structure, create managed users in bulk, and provision the new users by collaborating them as viewer and uploaders into the newly created folder structure.

## Setup Pre-Requisites
1. Clone this github repo.
2. Install the latest version of [dotnet core.](https://dotnet.microsoft.com/download)
3. Test PowerShell by running the `pwsh` command in your terminal.
```
mikechen@mbp create-users-automation % pwsh
PowerShell 7.2.1
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /Users/mikechen>
```
4. Create an OAuth Application using either the [CLI Setup Quick Start](https://developer.box.com/guides/tooling/cli/quick-start/) or in the [Box Developer Console](https://account.box.com/developers/services) using the [OAuth Setup Guide](https://developer.box.com/guides/authentication/oauth2/oauth2-setup/)

## Script Parameters
1. Update the [EmployeeList](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L10) to set your own Employee List CSV Path.
2. Update the [FolderStructureJSONPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L13) to set your own Folder Structure JSON path.
3. Optional: To directly upload folder structure from local directory, update [LocalUploadPath](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L14), comment out [Create-Folder-Structure](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L37), and uncomment [OnboardingFolderId](/examples/User%20Creation%20%26%20Provisioning/Users_Create_Provision.ps1#L40). 

## Mock Employee Data
* Generate 1 Employees: [employees_1.csv](/examples/User%20Creation%20%26%20Provisioning/employees_1.csv)
* Generate 5 Employees: [employees_5.csv](/examples/User%20Creation%20%26%20Provisioning/employees_5.csv)
* Generate 10 Employees: [employees_10.csv](/examples/User%20Creation%20%26%20Provisioning/employees_10.csv)

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Mike Chen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
