
# Report Inactive Users #

## Overview ##
The Report Inactive Users script utilizes the Box CLI to generate a `.csv` file with a list of users which are inactive for last specific days.

The script will get list of all users in the enterprise, mapping with Box [Events](https://developer.box.com/reference/resources/event/) in last specific days, for users who have [role](https://developer.box.com/reference/resources/user--full/#param-role) `user` and not an App user will be checked. All users which don't have any event in last days, will be considered as inactive and written into a `.csv` file. Result file from this script can be compatible with other scripts like [Users Deprovisioning Automation](/examples/User%20Deprovisioning).

List of [event type](https://developer.box.com/reference/resources/event/#param-event_type) can be mark as an active user (can be change by modify the script): `LOGIN`,`UPLOAD`,`COPY`,`MOVE`,`PREVIEW`,`DOWNLOAD`,`EDIT`,`DELETE`,`UNDELETE`,`LOCK`,`UNLOCK`, `NEW_USER`

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

## 1. Script Parameters
1. Update the [daysInactive](/examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L15) to set the number of days which event will be scanned, for all users that have no specific event in these days will be considered as inactive. If value not changed, or equal to -1, you will be prompted when running the script.

2. Optional: To change the report output file name, set the value for [ReportName](/examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L11) variable.

## 2. Run the script
Now all you need to do is run the script. Change the directory to the folder containing the script. In this example, it is the `Inactive Users Report` folder.

```
rvb@lab:~/box-cli/examples/Inactive Users Report$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/Inactive Users Report>
```

Run the script:

```bash
./Inactive_Users_Report.ps1
```

## Logging
Logs are written to a `logs` folder within the folder that contains this script. The logs are named `Inactive_Users_Report_all.txt` and `Inactive_Users_Report_errors.txt`. The former contains all log entries and the latter contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Box

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
