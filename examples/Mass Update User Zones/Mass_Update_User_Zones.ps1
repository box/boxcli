#APP SETUP
#README: This powershell script will use the Box CLI to provision users to the specified data residency Zone.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Manage Enterprise Properties, Manage Users, Generate User Access Tokens

########################################################################################

param (
    [switch]$DryRun = $false # if enabled, then no delete/create/update calls will be made, only read ones
)

########################################################################################
###   SCRIPT CONFIG - MODIFY THESE FOR YOUR ENVIRONMENT   ##############################
########################################################################################

    # Set User Zones Update CSV Path
    $UserZonesUpdatePath = "./User_Zones_Update.csv"

    # Set login email address for the admin that will make user Zone assignments
    $adminEmail = ""

    # Customize zone mapping appropriate to your environment
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

########################################################################################
###   SCRIPT BUSINESS LOGIC - MODIFY ANYTHING BELOW THIS POINT   #######################
########################################################################################

$EmailColumnName = "Email"   # email column name of csv input
$RegionColumnName = "Region" # region column name of csv input

# Get current script file name
Function Get-Script-Name() {
    $filename = $MyInvocation.ScriptName | Split-Path -Leaf
    if ($filename -match ".") {
        $filename = $filename.Substring(0, $filename.LastIndexOf("."))
    }

    return $filename
}

# Function to write to logs
Function Write-Log { param ([string]$message, [string]$errorMessage = $null, [Exception]$exception = $null, [string]$output = $false, [string]$color = "Green")

    # Define log level - Can be "errors" or "all"
    $logLevel = "all"

    # Create logs directory if it doesn't exist
    if (-not (Test-Path ".\logs")) {
        New-Item -Path . -Name "logs" -ItemType 'directory' > $null
    }

    $dateTime = Get-Date

    # Set log filename to the name of the script
    $logFilename = Get-Script-Name
    $debugErrorFile = ".\logs\" + $logFilename + "_errors.txt"
    $debugAllFile = ".\logs\" + $logFilename + "_all.txt"

    if ($exception -or $errorMessage) {
        $severity = "ERROR"
    } else {
        $severity = "INFO"
    }

    if ($exception.Response) {
        $result = $exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd();
    }

    $logMessage = ($severity + "`t")
    $logMessage += ($dateTime)
    $logMessage += ("`t" + $message + "`t")

    if ($exception) {
        $logMessage += ($exception.Message + "`t")
    }

    if ($errorMessage) {
        $logMessage += ($errorMessage + "`t")
    }

    if ($responseBody) {
        $logMessage += ("Box responded with: " + $responseBody + "`t")
    }

    if ($output -eq "true") {
        Write-Host $message -ForegroundColor $color
    }

    if ($logLevel -eq "all") {
        $logMessage | Add-Content $debugAllFile

        if ($severity -eq "ERROR") {
            $logMessage | Add-Content $debugErrorFile
        }
    } else {
        if ($severity -eq "ERROR") {
            $logMessage | Add-Content $debugErrorFile
        }
    }
}

# This class is used for setting/restoring analytics client header when running this script
class AnalyticsClientManager {
    [string]$TemporaryAnalyticsClientName
    [string]$OriginalAnalyticsClientName
    [bool]$IsOriginalAnalyticsClientEnabled

    AnalyticsClientManager([string]$temporaryAnalyticsClientName) {
        $this.TemporaryAnalyticsClientName = "box_sample_scripts $($temporaryAnalyticsClientName)"
    }

    [bool] IsAnalyticsClientSupported() {
        return "$(box configure:settings --help)" -like "*--analytics-client-name*--json*"
    }

    [void] StoreOriginalSettings() {
        $SettingsContent = "$(box configure:settings --json)" | ConvertFrom-Json

        $this.OriginalAnalyticsClientName = $SettingsContent.AnalyticsClient.Name
        if (!$this.OriginalAnalyticsClientName) {
            $this.OriginalAnalyticsClientName = "cli"
        }

        if($SettingsContent.EnableanalyticsClient) {
            $this.IsOriginalAnalyticsClientEnabled = $true
        } else {
            $this.IsOriginalAnalyticsClientEnabled = $false
        }

        Write-Log "Stored original analytics client settings, name: $($this.OriginalAnalyticsClientName), enabled: $($this.IsOriginalAnalyticsClientEnabled)." -output false
    }

    [void] RestoreOriginalSettings() {
        if ($this.IsOriginalAnalyticsClientEnabled) {
            $RestoreAnalyticsClientEnablementState = "--enable-analytics-client"
        } else {
            $RestoreAnalyticsClientEnablementState = "--no-enable-analytics-client"
        }

        "$(box configure:settings $RestoreAnalyticsClientEnablementState --analytics-client-name=$($this.OriginalAnalyticsClientName))"
        Write-Log "Restored original analytics client settings, name: $($this.OriginalAnalyticsClientName), enabled: $($this.IsOriginalAnalyticsClientEnabled)." -output false
    }

    [void] SetScriptAnalyticsClient() {
        if ($this.IsAnalyticsClientSupported()) {
            $this.StoreOriginalSettings()

            "$(box configure:settings --enable-analytics-client --analytics-client-name=$($this.TemporaryAnalyticsClientName))"
            Write-Log "Set temporarily analytics client settings, name: $($this.TemporaryAnalyticsClientName), enabled: true." -output false
        }
    }

    [void] UnsetScriptAnalyticsClients() {
        if ($this.IsAnalyticsClientSupported()) {
            $this.RestoreOriginalSettings()
        }
    }
}

# Update User Zones
Function Start-User-Zones-Update-Script {
    if ($DryRun) {
        Write-Log "Start Mass_Update_User_Zones script in DryRun mode" -output false
    } else {
        Write-Log "Start Mass_Update_User_Zones script" -output false
    }

    # Get the admin user based on email login
    if ($adminEmail -eq "") {
        $adminEmail = Read-Host -Prompt "Please enter the admin or a co-admin login email address"
    }
    # Check if user exists and get user ID
    try {
        $adminUserObjResp = "$(box users --filter=$adminEmail --fields='enterprise,role' --json 2>&1)"
        $adminUserObj = $adminUserObjResp | ConvertFrom-Json

        if (($adminUserObj.Length -eq 0) -or $($adminUserObj.total_count) -eq 0){
            Write-Log "No user found for $adminEmail." -output true -color Yellow
            break
        } elseif ($($adminUserObj.total_count) -gt 1) {
            Write-Log "Multiple matching users found for $adminEmail. Skipping.." -output true -color Yellow
            break
        } else {
            Write-Log "Found profile for $($adminUserObj.login) ($($adminUserObj.id))" -output true
        }
    } catch {
        Write-Log ("Could not find matching user for $adminEmail. See log for details.") -errorMessage $adminUserObjResp -output true -color Red
        break
    }

    # Ensure use is admin or coadmin
    if (($adminUserObj.role -ne "admin") -and ($adminUserObj.role -ne "coadmin")) {
        Write-Log "The specified user does not have admin or co-admin role" -output true -color Yellow
        break
    }

    # Get the admin id and enterprise id
    $adminID = $adminUserObj.ID
    $enterpriseId = $adminUserObj.enterprise.id
    Write-Log "Processing enterprise $enterpriseId" -output false

    # Read the input CSV
    try {
        $UsersToUpdate = Import-Csv $UserZonesUpdatePath
        $NumUsersToUpdate = ($UsersToUpdate | Measure-Object).Count
    } catch {
        Write-Log "Error reading user zone update CSV file" -exception $_.Exception -output true -color Red
        break
    }

    # Check if there are any users in the input
    if (!$($NumUsersToUpdate -gt 0)) {
        Write-Log "No users to act upon" -output true -color Yellow
        break
    }

    # Check if input file has the correct format
    $csvColumns = $UsersToUpdate | Get-Member -memberType 'NoteProperty' | Select-Object -ExpandProperty 'Name'
    if (-not (($csvColumns -contains $EmailColumnName) -and ($csvColumns -contains $RegionColumnName))) {
        Write-Log "Input file requires 'Email' and 'Region' columns" -output true -color Yellow
        break;
    }

    Write-Host "Number of Users to Process: $NumUsersToUpdate" -ForegroundColor Green

    # Get an access token scoped to the admin, to make Zone assignments
    $adminToken = "$(box tokens:get --user-id=$adminID)"

    # Get the default storage policy
    try {
        $EnterprisePolicyResp = "$(box storage-policies:assignments:lookup $enterpriseId --type=enterprise --token=$adminToken --json 2>&1)"
        $EnterprisePolicy = $EnterprisePolicyResp | ConvertFrom-Json
        $EnterprisePolicy = $EnterprisePolicy.storage_policy.id
    } catch {
        Write-Log "Could not get the default Storage Policy for the enterprise. See log for details." -errorMessage $EnterprisePolicyResp -output true -color Red

        break
    }

    ForEach($UserToUpdate in $UsersToUpdate) {

        $UserEmail = $userObj = $null
        $UserZone = $null

        $UserEmail = $($UserToUpdate.$EmailColumnName)
        $UserZone = $($UserToUpdate.$RegionColumnName)

        Write-Log "Starting script for $UserEmail..." -output true -color White

        # Check if user exists and get user ID
        try {
            $userObjResp = "$(box users --filter=$UserEmail --json 2>&1)"
            $userObj = $userObjResp | ConvertFrom-Json

            if (($userObj.Length -eq 0) -or $($userObj.total_count) -eq 0){
                Write-Log "No user found for $UserEmail. Skipping.." -output true -color Yellow
                Continue
            } elseif ($($userObj.total_count) -gt 1){
                Write-Log "Multiple matching users found for $UserEmail. Skipping.." -output true -color Yellow

                Continue
            } else {
                Write-Log "Found profile for $($userObj.login) ($($userObj.id))" -output true
            }
        } catch {
            Write-Log "Could not find matching user for $UserEmail. The user may no longer exist. See log for details." -errorMessage $userObjResp -output true -color Red

            continue
        }

        # Get user's storage policy assignment
        try {
            $userStoragePolicyResp = "$(box storage-policies:assignments:lookup $userObj.id --token=$adminToken --json 2>&1)"
            $userStoragePolicy = $userStoragePolicyResp | ConvertFrom-Json

            Write-Log ("Found Storage Policy Assignment for $($userObj.login) ($($userObj.id))." +`
            " User assigned to Storage Policy with this id: $($userStoragePolicy.storage_policy.id)") `
        } catch {
            Write-Log "Could not find Storage Policy Assignment for $UserEmail. See log for details. " -errorMessage $userStoragePolicyResp -output true -color Red

            continue
        }

        # If the user is in the correct zone, move onto the next user
        if ($($userStoragePolicy.storage_policy.id -eq $ZonesTable[$UserZone])){
            Write-Log ("User $($userObj.login) ($($userObj.id)) is already assigned" +`
            " to the specified zone: $UserZone ($($ZonesTable[$UserZone]))." +`
            " No action required.") `
            -output true

            continue
        } else {
            # If the user's current storage policy is inherited from the enterprise, create a new assignment
            if ($($userStoragePolicy.assigned_to.type -eq "enterprise")) {
                try {
                    if (!$DryRun) {
                        $assignmentObjResp = "$(box storage-policies:assign $ZonesTable[$UserZone] $userObj.id --token=$adminToken --json 2>&1)"
                        $assignmentObj = $assignmentObjResp | ConvertFrom-Json

                        Write-Log ("Successfully assigned $($userObj.login) ($($userObj.id))" +`
                        " to the specified zone: $UserZone ($($ZonesTable[$UserZone]))." +`
                        " Assignment id: $($assignmentObj.id)") `
                        -output true
                    } else {
                        Write-Log ("`"DryRun`" mode is enabled. Script would have assigned $($userObj.login) ($($userObj.id))" +`
                        " to the specified zone: $UserZone ($($ZonesTable[$UserZone])).") `
                        -output true
                    }
                } catch {
                    Write-Log ("Could not assign $($userObj.login) ($($userObj.id))" +`
                    " to the specified zone: $UserZone ($($ZonesTable[$UserZone])). See log for details.") -errorMessage $assignmentObjResp -output true -color Red

                    continue
                }
            } else {
                # If the target zone is the same as the enterprise default zone, delete the current policy assignment
                if ($($ZonesTable[$UserZone] -eq $EnterprisePolicy)){
                    try {
                        if (!$DryRun) {
                            "$(box storage-policies:assignments:remove $userStoragePolicy.id --token=$adminToken)"

                            Write-Log ("Successfully reassigned $($userObj.login) ($($userObj.id))" +`
                            " to the specified zone: $UserZone ($($ZonesTable[$UserZone])).") `
                            -output true
                        } else {
                            Write-Log ("`"DryRun`" mode is enabled. Script would have reassigned $($userObj.login) ($($userObj.id))" +`
                            " to the specified zone: $UserZone ($($ZonesTable[$UserZone])).") `
                            -output true
                        }
                    } catch {
                        Write-Log ("Could not reassign $($userObj.login) ($($userObj.id))" +`
                        " to the specified zone: $UserZone ($($ZonesTable[$UserZone])). See log for details.") -exception $_.Exception -output true -color Red

                        continue
                    }
                # Else reassign the user to the specified zone
                } else {
                    try {
                        if (!$DryRun) {
                            $assignmentObjResp = "$(box storage-policies:assign $ZonesTable[$UserZone] $userObj.id --token=$adminToken --json 2>&1)"
                            $assignmentObj = $assignmentObjResp | ConvertFrom-Json

                            Write-Log ("Successfully reassigned $($userObj.login) ($($userObj.id))" +`
                            " to the specified zone: $UserZone ($($ZonesTable[$UserZone]))." +`
                            " Assignment id: $($assignmentObj.id)") `
                            -output true
                        } else {
                            Write-Log ("`"DryRun`" mode is enabled. Script would have reassigned $($userObj.login) ($($userObj.id))" +`
                            " to the specified zone: $UserZone ($($ZonesTable[$UserZone])).") `
                            -output true
                        }
                    } catch {
                        Write-Log ("Could not reassign $($userObj.login) ($($userObj.id))" +`
                        " to the specified zone: $UserZone ($($ZonesTable[$UserZone])). See log for details.") -errorMessage $assignmentObjResp -output true -color Red

                        continue
                    }
                }
            }
        }
    } #End foreach

    Write-Log "Finish Mass_Update_User_Zones script."
}

# Start function
Function Start-Script {
    try {
        $AnalyticsClientManager = [AnalyticsClientManager]::new($(Get-Script-Name).ToLower())
        $AnalyticsClientManager.SetScriptAnalyticsClient()

        Start-User-Zones-Update-Script
    } finally {
        $AnalyticsClientManager.UnsetScriptAnalyticsClients()
    }
}

Start-Script
