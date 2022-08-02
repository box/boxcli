# Mass Group Creation #

## Overview ##
The Mass Update User Zones script utilizes the Box CLI to provision users to the specified data residency Zone within a Multizone Box tenant.

The script takes a .csv containing users and zone mappings as input and makes the zone assignment as specified. It also uses the admin or co-admin login email address to look up the associated enterprise and the zone policy assigned to the enterprise (which is inherited by all users unless otherwise specified; sometimes referred to as the "default zone"). 

Zone assignments are interpreted using the `ZonesTable`.  This script is designed to be run once to do the initial provisioning of user zones, however, it can also be used for subsequent runs to make zone updates ad hoc.

If you are wondering how to assign Zones through the Admin Console, see [here](https://support.box.com/hc/en-us/articles/360044193533-Assigning-Zones-through-the-Admin-Console) for more details. For more information about Box Zones, please visit our [page here](https://www.box.com/zones).

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

4. Setting up the CLI requires creating a Box application that uses server authentication with JWT. See the [Box CLI Using JWT Authentication](https://developer.box.com/guides/tooling/cli/jwt-cli/) page for instructions. 
    * The Box application must have the following application **access level** enabled in the configuration page: `App + Enterprise Access`
    * The Box application must have the following **application scopes** enabled in the configuration page: `Manage Enterprise Properties`, `Manage Users`
    * The Box application must have the following **advanced features** enabled in the configuration page: `Generate User Access Tokens`

5. The  **Box Admin** or **Co-Admin Account** user must have `Manage Users` privileges at a minimum.


## 1. Script Parameters
1. Update the [UserZonesUpdatePath](/examples/Mass%20Update%20User%20Zones/Mass_Update_User_Zones.ps1#L18) to set your own User Zones Update .csv file path. This .csv file should have two columns with the following headers: Email, Region. The Email column should contain the primary email address for the user in Box. The Region column should contain the friendly name (as defined in the `ZonesTable`) for the zone to which the corresponding user should be assigned. 

	This is an example input .csv and a `ZonesTable` that might interpret it:
	|Email             |Region          |
	|------------------|----------------|
	|betty@company.com | US             |
	|roger@company.com | France         |
	|sally@company.com | JapanSingapore |

2. Update the [adminEmail](/examples/Mass%20Update%20User%20Zones/Mass_Update_User_Zones.ps1#L21) to the admin or co-admin login email address of the account that will be used to make zone assignments.  If it is not specified in the script, you will be prompted for it.
3. Optional: To run the script in simulate mode, set the `simulate` boolean flag when running the script:
`./Mass_Update_User_Zones.ps1 -simulate`

###  Variables
* `ZonesTable`: This is the logic that defines the zones. In this hashtable, the keys are the "friendly name" for the zone (this is the value used in the input .csv) and the corresponding value is the global ID for that zone. The customer should consult their BC or CSM contact to get the IDs corresponding to the zones enabled in their enterprise.

	```powershell
	$ZonesTable = @{
		US = "100001"             #US
		GermanyIreland = "100002" #Germany/Ireland with in region uploads/downloads/previews
		Australia = "100003"      #Australia
		Japan = "100004"          #Japan with in region uploads/downloads/previews
		Canada = "100005"         #Canada
		JapanSingapore = "100007" #Japan/Singapore with in region uploads/downloads/previews
		UKGermany = "100008"      #UK/Germany
		UK = "100009"             #UK with in region uploads/downloads/previews
		France = "100012"         #France
	}
	```
## 2. Run the script
Now all you need to do is run the script. Change the directory to the folder containing the script. In this example, it is the `Mass Update User Zones` folder.
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
Logs are written to a `logs` folder within the folder that contains this script. The logs are named `Mass_Update_User_Zones_all.txt` and `Mass_Update_User_Zones_errors.txt`. The former contains all log entries and the latter contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk.

## License

The MIT License (MIT)

Copyright (c) 2022 Box

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
