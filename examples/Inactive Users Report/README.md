
# Report Inactive Users #

## Overview ##
The Report Inactive Users script utilizes the Box CLI to generate a `.csv` file with list of users which inactive for last specific days.

The script will get list of all users in the enterprise, mapping with Box Events in last specific days, for users which have [role](https://developer.box.com/reference/resources/user--full/#param-role) `user` and not an App user will be checked. All user which don't have any event in last days, will be consider as inactive and write into a `.csv` file. Result file from this script can be compatible for other scripts like [Users Deprovisioning Automation](/examples/User%20Deprovisioning).

List of [event type](https://developer.box.com/reference/resources/event/#param-event_type) can be mark as an active user (can be change by modify the script): `LOGIN`,`UPLOAD`,`COPY`,`MOVE`,`PREVIEW`,`DOWNLOAD`,`EDIT`,`DELETE`,`UNDELETE`,`LOCK`,`UNLOCK`, `NEW_USER`

## Setup Pre-Requisites
1. Clone this github repo.
2. Install PowerShell or .Net core.
   > If you encounter issues make sure you install both dotnet core and PowerShell
    1. For MacOS & Linux, Install the latest version of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2).
    2. For Windows, Install the latest version of [dotnet core](https://dotnet.microsoft.com/download).
    
3. Test PowerShell by running the `pwsh` command in your terminal.

```
mikechen@mbp report-inactive-users % pwsh
PowerShell 7.2.1
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /Users/mikechen>
```

4. Setting up the CLI requires creating a Box application that uses server authentication with JWT. See the [Box CLI Using JWT Authentication](https://developer.box.com/guides/tooling/cli/jwt-cli/) page for instructions. 
    * The Box application must have the following application **access level** enabled in the configuration page: `App + Enterprise Access`
	* The Box application must have the following **application scopes** enabled in the configuration page: `Manage Enterprise Properties`, `Manage Users`


## Script Parameters
1. Update the [daysInactive](/examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L20) to set the number of days which event will be scanned, for all users have no specific event in these days will be consider as inactive. If value not changed, or equal to -1, you will be prompted when run the script.

2. Optional: Change the report output file name, set the value for [ReportName]((/examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L16)

## Logging ##
Logs are written to a `logs` folder within the folder that contains this script. The logs are named `Inactive_Users_Report_all.txt` and `Inactive_Users_Report_errors.txt`. The former contains all log entries and the latter contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Box

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.