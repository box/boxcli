# Mass Update User Zones #

**For detailed script overview, please follow [this guide][user-guide].**

Provisions users to specified data residency Zones within a Multizone Box tenant. It performs the following steps:

1. It uses admin or co-admin login email address to find the associated enterprise and the zone policy assigned to this enterprise. An assigned zone policy is inherited by all users unless specified otherwise. It is sometimes called the **default zone**.
2. It performs zone assignment based on an input `.csv` file containing user email addresses and zone mappings.
Usually, you use the script once to do the initial provisioning of user zones, but you can also use it for subsequent runs to make zone assignment updates.

If you would like to use Admin Console for zone assignment, see [here](https://support.box.com/hc/en-us/articles/360044193533-Assigning-Zones-through-the-Admin-Console). For more information about Box Zones, see the [official website](https://www.box.com/zones).

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

4. Setting up the CLI requires creating a Box application that uses server authentication with JWT. See the [Box CLI Using JWT Authentication][jwt-cli] page for instructions. 
    * The Box application must have the following application **access level** enabled in the configuration page: `App + Enterprise Access`
    * The Box application must have the following **application scopes** enabled in the configuration page: `Manage Enterprise Properties`, `Manage Users`
    * The Box application must have the following **advanced features** enabled in the configuration page: `Generate User Access Tokens`

5. The  **Box Admin** or **Co-Admin Account** user must have `Manage Users` privileges at a minimum.


## 1. Script Parameters
1. Update the [UserZonesUpdatePath][UserZonesUpdatePath-param] to set your own User Zones Update `.csv` file path. The `.csv` file must have two columns with the following headers: **Email** and **Region**.
   * **Email** contains the primary email address of a Box user.
   * **Region**  contains the user-friendly name for the zone to which the script will assign the user. This name is provided by the [ZonesTable][zonestable] that is a hash table used to define zones. The keys are the zone's user-friendly names, and the corresponding value is the global ID of the zone.

     ```bash
     $ZonesTable = @{
     US = "100001"             #US
     GermanyIreland = "100002" #Germany/Ireland with in region uploads/downloads/previews
     Australia = "100003"      #Australia
     Japan = "100004"          #Japan with in region uploads/downloads/previews
     Canada = "100005"         #Canada
     JapanSingapore = "100007" #Japan/Singapore with in region uploads/downloads/previews
     GermanyUK = "100008"      #Germany/UK
     UK = "100009"             #UK with in region uploads/downloads/previews
     France = "100012"         #France
     }
     ```
     

   > Consult the BC or CSM contact to get the IDs corresponding to the zones enabled in a specific enterprise.

   A [sample input][example-csv] `.csv` file containing emails and zone names is provided with this script. Its content looks as follows:

   | Email|Region|
   |------|-------|
   |betty@company.com|US|
   |roger@company.com|France|
   |sally@company.com|JapanSingapore|   


2. Update the [adminEmail][adminEmail-param] to the admin or co-admin login email address of the account that will be used to make zone assignments.  If you don't specify this value, the script will prompt you for it.
3. Optional: To run the script in dry run mode, set the `DryRun` boolean flag when running the script:
`./Mass_Update_User_Zones.ps1 -DryRun`.
 Dry run doesn't mean that API calls won't be made, instead any create/update/delete calls will be skipped only.

## 2. Run the script
Change the directory to the folder containing the script.
In this example, it is the `Mass Update User Zones` folder.

```
rvb@lab:~/box-cli/examples/Mass Update User Zones$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/Mass Update User Zones>
```

Run the script:
```bash
./Mass_Update_User_Zones.ps1
```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Mass_Update_User_Zones_all.txt` that contains all log entries.
* `Mass_Update_User_Zones_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
[jwt-cli]: https://developer.box.com/guides/cli/cli-docs/jwt-cli/
[UserZonesUpdatePath-param]: /examples/Mass%20Update%20User%20Zones/Mass_Update_User_Zones.ps1#L18
[example-csv]: User_Zones_Update.csv
[zonestable]:/examples/Mass%20Update%20User%20Zones/Mass_Update_User_Zones.ps1#L23
[adminEmail-param]: /examples/Mass%20Update%20User%20Zones/Mass_Update_User_Zones.ps1#L21
[user-guide]: https://developer.box.com/guides/cli/scripts/user-zones-mass-update/
