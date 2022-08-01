#APP SETUP
#README: This powershell script will use the Box CLI to provision users to the specified data residency Zone.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Manage Enterprise Properties, Manage Users, Generate User Access Tokens

########################################################################################
###   SCRIPT CONFIG - MODIFY THESE FOR YOUR ENVIRONMENT   ##############################
########################################################################################

# Set User Zones Update CSV Path
$MassGroupCreationPath = "./Mass_Group_Creation.csv"
$DefaultCollaborationRole = "editor"

########################################################################################
###   SCRIPT BUSINESS LOGIC - MODIFY ANYTHING BELOW THIS POINT   #######################
########################################################################################

$GroupNameColumnName = "GroupName"   # gropu name column name of csv input
$UserEmailsColumnName = "UserEmails" # user emails column name of csv input
$FolderIdsColumnName = "FolderIds" # folder ids column name of csv input
$CollaborationRoleColumnName = "Role" # role column name of csv input

$AvailableCollaborationRoles = @("editor", "viewer", "previewer", "uploader", "previewer_uploader", "viewer_uploader", "co-owner")

# Function to write to logs
function Write-Log { param ([string]$message, [string]$errorMessage = $null, [Exception]$exception = $null, [string]$output = $false, [string]$color = "Green")

    # Define log level - Can be "errors" or "all"
    $logLevel = "all"

    # Create logs directory if it doesn't exist
    if (-not (Test-Path ".\logs")) {
        New-Item -Path . -Name "logs" -ItemType 'directory' > $null
    }

    $dateTime = Get-Date

    # Set log filename to the name of the script
    $logFilename = $MyInvocation.ScriptName
    $logFilename = $logFilename.substring($logFilename.lastIndexOf([IO.Path]::DirectorySeparatorChar))
    if ($logFilename -match ".") {
        $logFilename = $logFilename.Substring(0, $logFilename.LastIndexOf("."))
    }

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

# Read the input CSV
try {
    $AllGroupsToUpdate = Import-Csv $MassGroupCreationPath
} catch {
    Write-Log "Error reading CSV file" -exception $_.Exception -output true -color Red
    break
}

########################################################################################
# Validate input data
########################################################################################

# Check if there are any group in the input
if (!$($($allGroupsToUpdate | Measure-Object).Count -gt 0)) {
    Write-Log "No groups to act upon" -output true -color Yellow
    break
}

# Check if input file has the correct format
$csvColumns = $allGroupsToUpdate | Get-Member -memberType 'NoteProperty' | Select-Object -ExpandProperty 'Name'
if (-not
    (
        ($csvColumns -contains $GroupNameColumnName) -and
        ($csvColumns -contains $UserEmailsColumnName) -and
        ($csvColumns -contains $FolderIdsColumnName)
    )
    ) {
    Write-Log "Input file requires '$GroupNameColumnName', '$UserEmailsColumnName' and '$FolderIdsColumnName' columns" -output true -color Yellow
    break;
}


########################################################################################
# Get data
########################################################################################

# # Get existing groups
try {
    $GroupsResp = "$(box groups --json 2>&1)"

    $GroupsHashtable = @{}
    $GroupsResp | ConvertFrom-Json | ForEach-Object { $GroupsHashtable[$_.name] = $_.id }
} catch {
    Write-Log "Could not get groups. See log for details." -errorMessage $GroupsResp -output true -color Red
    break
}

# # Get list of users
try {
    $UsersResp = "$(box users --fields='id,login,name,role' --json 2>&1)"
    $Users = $usersResp | ConvertFrom-Json

    if (($users.Length -eq 0) -or ($users.total_count -eq 0)) {
        Write-Log "No users found!" -output true -color Red
        break
    }

    $UsersHashtable = @{}
    $Users | ForEach-Object { $UsersHashtable[$_.login] = $_.id }
} catch {
    Write-Log "Could not get user list. See log for details." -errorMessage $usersResp -output true -color Red
    break
}

# Iterate through all groups from CSV input file
foreach($GroupToUpdate in $AllGroupsToUpdate) {

    # Get collaboration role for processing line from .CSV file and
    # ensure that it is set to valid value.
    $CurrentCollaborationRole = $GroupToUpdate.$CollaborationRoleColumnName
    if (!$CurrentCollaborationRole) {
        # Use default collaboration role if not set any
        $CurrentCollaborationRole = $DefaultCollaborationRole
    }
    if (!$AvailableCollaborationRoles.Contains($CurrentCollaborationRole)) {
        Write-Log "Invalid role '$CurrentCollaborationRole'. Please use one of these: '$($AvailableCollaborationRoles -join ", ")'. Skipping current row processing." -output true -color Red
        continue
    }

    # Get group name from .CSV file
    $CurrentGroup = $GroupToUpdate.$GroupNameColumnName
    if (!$GroupsHashtable.ContainsKey($CurrentGroup)) {

        # If the give group name doesn't exsist, then create it
        try {
            $CreatedGroupResp = "$(box groups:create $CurrentGroup --json 2>&1)"
            $CreatedGroup = $CreatedGroupResp | ConvertFrom-Json
            $GroupsHashtable[$CreatedGroup.name] = $CreatedGroup.id

            # Add created group to the set of exsising groups
            $GroupsResp | ConvertFrom-Json | ForEach-Object { $GroupsHashtable[$_.name] = $_.id }

            Write-Log "Successfully created group '$CurrentGroup' with ID $($CreatedGroup.id)" -output true
            Write-Log "$CreatedGroupResp"
        } catch {
            Write-Log "Could not create a '$CurrentGroup' groups. See log for details." -errorMessage $CreatedGroupResp -output true -color Red
        }
     } else {
        Write-Log "Group '$CurrentGroup' already exsists." -output true
    }

    $CurrentGroupID = $GroupsHashtable[$CurrentGroup]

    # Get list of users assigned to particular group from .CSV file and
    # ensure it's not empty.
    $CurrentUserList = $GroupToUpdate.$UserEmailsColumnName.split()| Where-Object {$_}
    if ($CurrentUserList.Length -eq 0) {
        Write-Log "No users defined for role '$CurrentGroup'. Skipping this row..." -output true -color Red
        continue
    }

    foreach($CurrentUser in $CurrentUserList) {
        # Ensure tha users exists in your enterprise [MIKE]
        if (!$UsersHashtable.ContainsKey($CurrentUser)) {
            Write-Log "Could not find user with email: '$CurrentUser'. Skipping this user..." -output true
            continue
        }

        $CurrentUserID = $UsersHashtable[$CurrentUser]

        try {
            $AddedGroupMembershipResp = "$(box groups:memberships:add $CurrentUserID $CurrentGroupID --json 2>&1)"

            Write-Log "Successfully added user '$CurrentUser' (ID: $CurrentUserID) to group '$CurrentGroup' (ID:$CurrentGroupID)." -output true
            Write-Log $AddedGroupMembershipResp
        } catch {
            Write-Log "Could not add user '$CurrentUser' (ID: $CurrentUserID) to group '$CurrentGroup' (ID:$CurrentGroupID). See log for details." -errorMessage $AddedGroupMembershipResp -output true -color Red
			continue
        }
    }

    # Get list of folder ID assigned to particular group from .CSV file and
    # ensure it's not empty.
    $CurrentFolderIDList = $GroupToUpdate.$FolderIdsColumnName.split()| Where-Object {$_}
    if ($CurrentFolderIDList.Length -eq 0) {
        Write-Log "No folder IDs defined for role '$CurrentGroup'. Skipping this row..." -output true -color Red
        continue
    }

    foreach($CurrentFolderID in $CurrentFolderIDList) {
        try {
            $CreatedCollaborationsResp = "$(box collaborations:create $CurrentFolderID folder --group-id=$CurrentGroupID --role=$CurrentCollaborationRole --json 2>&1)"

            Write-Log "Successfully created collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroup' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole' ." -output true
            Write-Log $CreatedCollaborationsResp
        } catch {
            Write-Log "Could not create collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroup' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole'. See log for details." -errorMessage $CreatedCollaborationsResp -output true -color Red
			continue
        }
    }
}


# Write-Log "complete"

# ########################################################################################
# ###   END SCRIPT   #####################################################################
# ########################################################################################
