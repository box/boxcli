# Mass Update User Zones #

## Overview ##
The MassUpdateUserZones CLI script utilizies the Box CLI to provision users to the specified data residency Zone within a Multizone Box tenant.

### Prerequisites ###
* **Powershell Environment:** All scripts must be Run as Administrator as some variables are stored in the HKCU registry hive
	* The script can be run in any Windows environment you'd like, as long as it has access to the internet to reach the Box APIs
* **Box Admin or Co-Admin Account:** The Admin user must have 'Manage Users' privileges, at a minimum
* **Box CLI:** The Box CLI must be installed and configured.  Setting up the CLI requires creating a Box application that uses server authentication with JWT.  See the [Box CLI](https://developer.box.com/docs/box-cli) and the CLI [getting started](https://github.com/box/boxcli#getting-started) page for instructions.
    * **The Box application must have the following application access enabled** in the configuration page: Enterprise
	* **The Box application must have the following scopes enabled** in the configuration page: Manage Enterprise Properties, Manage Users, Generate User Access Tokens

### Initialization ###

1. Enter the admin or co-admin login email address as requested.  
2. Optionally set the `simulate` boolean flag to run the script in simulate mode.

The script takes a .csv containing users and zone mappings as input and makes the zone assignment as specified. It also uses the admin or co-admin login email address to look up the associated enterprise and the zone policy assigned to the enterprise (which is inherited by all users unless otherwise specified; sometimes referred to as the "default zone"). Zone assignments are interpretted using the `ZonesTable`.  This script is designed to be run once to do the initial provisioning of user zones, however, it can also be used for subsequent runs to make zone updates ad hoc.

#### Variables ####

* `adminEmail`: This is the administrator or co-administrator login email address of the account that will be used to make zone assignments.  If it is not specified in the script, you will be prompted for it.
* `ZonesTable`: This is the logic that defines the zones. In this hashtable, the keys are the "friendly name" for the zone (this is the value used in the input .csv) and the corresponding value is the global ID for that zone. The customer should consult their BC or CSM contact to get the IDs corresponding to the zones enabled in their enterprise.

#### Input ####
The input .csv should have two columns with the following headers: Email, Region. The Email column should contain the primary email address for the user in Box. The Region column should contain the friendly name (as defined in the `ZonesTable`) for the zone to which the corresponding user should be assigned. 

This is an example input .csv and a `ZonesTable` that might interpret it:
|Email             |Region|
|------------------|------|
|betty@company.com | APAC |
|roger@company.com | EMEA |
|sally@company.com | NA   |

```powershell
$ZonesTable = @{
                    NA = "162"      #US
                    EMEA = "70"     #IBM London / IBM Frankfurt
                    APAC = "134"    #AWS Japan / AWS Singapore with in region Uploads/Downloads/Previews
                    CAN = "42"      #Canada  Montreal / Dublin
    }
```

#### Logging ####
Logs are written to a `logs` folder within the folder that contains this script.  The logs are named `MassUpdateUserZonesCLI_all.txt` and `MassUpdateUserZonesCLI_errors.txt`.  The former contains all log entries and the latter contains only errors.

## Disclaimer ##
**By using the Powershell ToolBox, Customer acknowledges and agrees to the following:**
The scripts are a demonstration of certain processes available and should be treated as such. The scripts are made available "as is" and are not subject to the warranties and representations set forth in the Box Service Agreement, or other applicable services agreement, between Box and Customer.
EACH SCRIPT, INCLUDING ANY SOFTWARE OR PROGRAM THAT IS PART OF THE SCRIPT, IS MADE AVAILABLE "AS IS." BOX MAKES NO WARRANTIES, REPRESENTATIONS OR GUARANTEES (EXPRESS OR IMPLIED, WHETHER BY STATUTE, COMMON LAW, CUSTOM, USAGE OR OTHERWISE) AS TO ANY MATTER INCLUDING PERFORMANCE, RESULTS, SECURITY, NON-INFRINGEMENT, MERCHANTABILITY, INTEGRATION, QUIET ENJOYMENT, SATISFACTORY QUALITY AND FITNESS FOR ANY PARTICULAR PURPOSE OR USE OR THAT THE SCRIPT, INCLUDING ANY SOFTWARE OR PROGRAM THAT IS A PART OF THE SCRIPT, WILL BE UNINTERRUPTED OR ERROR-FREE. BOX PROVIDES NO SUPPORT SERVICES FOR THE SCRIPT, INCLUDING ANY SOFTWARE OR PROGRAM THAT IS A PART OF THE SCRIPT, EXCEPT AS DETERMINED BY BOX IN ITS SOLE DISCRETION AND IN SUCH EVENT SUCH SUPPORT SERVICES ARE ALSO PROVIDED “AS-IS” WITH NO WARRANTIES.
Changes made to Customer’s instance of the Box Service, including the deletion of any Box Service user accounts, as well as the deletion of any electronic files, materials, data, text, audio, video, images or other content transmitted, stored, retrieved or processed by the users of the Box Service accounts (the “Content”), resulting from Customer’s running of the script may not be reversible or recoverable. We encourage you to message your Box Service account users in advance of any material changes to their accounts or the deletion of their accounts and Content. Box also encourages you to test any scripts in a sandbox environment prior to running it in a production environment.  
