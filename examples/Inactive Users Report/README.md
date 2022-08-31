# Report inactive Users 

> Due to scale issue, CLI can't handle more than 1M events per run and as a run the Inactive Users Report will fail.

**For detailed script overview, please follow [this guide][user-guide].**

Identifies inactive enterprise users by looking at user activity within a defined period of time. This script helps manage the number of seats within an enterprise and works in synergy with the deprovisioning script.

This script generates a `.csv` file with a list of users who has been inactive for a number of days. It performs the following steps:

1. Looks for the users who have the role `user`.
   > The script does not consider other roles, such as `AppUser`.

2. Uses [Box Events][boxevents] to check if the user performed any actions   
   for a specified number of days.
   The default list of [event types][event-types] includes: `LOGIN`,`UPLOAD`,`COPY`,`MOVE`,`PREVIEW`,`DOWNLOAD`,`EDIT`,`DELETE`,`UNDELETE`,`LOCK`,`UNLOCK`, `NEW_USER`. You can modify this list in the script settings.
3. Adds users who didn't perform any actions to a `.csv` file with
   inactive users. You can use this file as input for other scripts, for example to [deprovision users][deprovisionscript].


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
4. Create an OAuth Application following the [CLI Setup Quick Start][oauth-guide].

## 1. Script Parameters
1. Set the [number of days][daysInactive-param] you want the script to scan for user events. If you   don't specify this value or leave the default, the script will prompt you to enter it.
3. Optional: To change the report output file name, define the [ReportOutputFile][ReportName-param] parameter
4. Optional: To change event types, define the list for [eventType][events-param] parameter.

## 2. Run the script

Change the directory to the folder containing the script. In this example, it is the `Inactive Users Report` folder.
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

When the script run is completed, you will see the following
output or a similar one.

   ```bash
    Looking for users inactive for more than 3 days.
    Found 6 users.
    Found 7 events in last 3 days
    Enterprise has: 0 App user, 6 regular users. With 1 admin role, 5 user roles.
    Need to check 5 users (regular user, with user role) for inactive.
    Found 5 users inactive for more than 3 days.
    Report is available at InactiveUsers.csv
   ```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Inactive_Users_Report_all.txt` that contains all log entries.
* `Inactive_Users_Report_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.

[boxevents]:https://developer.box.com/reference/resources/event/
[event-types]: https://developer.box.com/reference/resources/event/#param-event_type
[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
[daysInactive-param]: /examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L14
[ReportName-param]: /examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L11
[events-param]: /examples/Inactive%20Users%20Report/Inactive_Users_Report.ps1#L17
[deprovisionscript]: https://developer.box.com/guides/cli/scripts/deprovision-users/
[user-guide]: https://developer.box.com/guides/cli/scripts/report-inactive-users/
