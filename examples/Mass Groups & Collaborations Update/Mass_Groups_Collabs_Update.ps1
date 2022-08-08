#APP SETUP
#README: This powershell script will use the Box CLI to creates or updates groups with the given users and creates collaborations for groups.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Manage Enterprise Properties, Manage Users, Manage Groups

########################################################################################

param (
    [switch]$SkipGroupsUpdate = $false, # if enabled, then will skip groups update
    [switch]$SkipCollabsCreation = $false, # if enabled, then will skip collaborations creation
    [switch]$UpdateExistingCollabs = $false # if enabled, then existing collaborations will be updated with new the role
)

########################################################################################
###   SCRIPT CONFIG - MODIFY THESE FOR YOUR ENVIRONMENT   ##############################
########################################################################################

# Set user group addition CSV path
$UserGroupAdditionPath = "./User_Group_Addition.csv"

# Set collaborations creation CSV path
$CollaborationsCreationPath = "./Collaborations_Creation.csv"

# Default collaboration role, used when it's not set in CSV file
$DefaultCollaborationRole = "editor"

# Name of column names in CSV files
$GroupNameColumnName = "GroupName"   # group name column name of csv input
$UserEmailColumnName = "UserEmail" # user email column name of csv input
$FolderIdColumnName = "FolderId" # folder id column name of csv input
$CollaborationRoleColumnName = "CollaborationRole" # role column name of csv input

# List of available collaboration roles
$AvailableCollaborationRoles = @("editor", "viewer", "previewer", "uploader", "previewer_uploader", "viewer_uploader", "co-owner")

########################################################################################
###   SCRIPT BUSINESS LOGIC - MODIFY ANYTHING BELOW THIS POINT   #######################
########################################################################################

$script:GroupsHashtable = @{}
$script:UsersHashtable = @{}

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

########################################################################################
###   Part 1) Update groups   ##########################################################
########################################################################################

# Function to create/update groups based on CSV file
function Update-Groups {
    Write-Log "Start update groups..." -output true

    # Ensure that file exist
    if (-not(Test-Path -Path $UserGroupAdditionPath -PathType Leaf)) {
        Write-Log "File '$UserGroupAdditionPath' doesn't exist. Skipping groups update." -errorMessage "File not found."-output true -color Red
        return
    }

    # Read the input CSV
    try {
        $AllGroupsInput = Import-Csv $UserGroupAdditionPath
    } catch {
        Write-Log "Error reading '$UserGroupAdditionPath' CSV file. Skipping groups update." -exception $_.Exception -output true -color Red
        return
    }

    # Check if there is any entry in the input file
    if (!$($($AllGroupsInput | Measure-Object).Count -gt 0)) {
        Write-Log "No groups to act upon. Skipping groups update." -output true -color Yellow
        return
    }

    # Check if the input file has the correct format
    $csvColumns = $AllGroupsInput | Get-Member -memberType 'NoteProperty' | Select-Object -ExpandProperty 'Name'
    if (-not (($csvColumns -contains $GroupNameColumnName) -and ($csvColumns -contains $UserEmailColumnName))) {
        Write-Log "Input file '$UserGroupAdditionPath' requires '$GroupNameColumnName' and '$UserEmailColumnName' columns. Skipping groups update." -errorMessage "Invalid input data." -output true -color Red
        return;
    }

    # Hashtable where group's id is the key and array of user's ids is a value
    # e.g.:
    # $GroupsMembershipHashtable['group_id_1'] = @('user_id_1', 'user_id_2', 'user_id_3')
    # $GroupsMembershipHashtable['group_id_2'] = @('user_id_2', 'user_id_4')
    $GroupsMembershipHashtable = @{}

    $currentRowIndex = 0
    # Iterate through all groups from CSV input file
    foreach($GroupInputEntry in $AllGroupsInput) {
        # Rows of input data starts with 1
        $currentRowIndex++

        # Get the name of the group being processed in the current row
        $CurrentGroupName = $GroupInputEntry.$GroupNameColumnName

        # Ensure that it's not empty
        if (!$CurrentGroupName) {
            Write-Log "'$GroupNameColumnName' column in row $currentRowIndex) contains invalid empty value. Skipping processing current row."  -errorMessage "Invalid input data." -output true -color Red
            continue
        }

        if (!$GroupsHashtable.ContainsKey($CurrentGroupName)) {
            # If the group with given name doesn't exist, create it
            try {
                $CreatedGroupResp = "$(box groups:create $CurrentGroupName --json 2>&1)"
                $CreatedGroup = $CreatedGroupResp | ConvertFrom-Json

                # Add created group to the set of existing groups -> GroupsHashtable
                $GroupsHashtable[$CreatedGroup.name] = $CreatedGroup.id

                 # Create entry for created group with empty array set as value
                $GroupsMembershipHashtable[$CreatedGroup.id] = @()

                Write-Log "Successfully created group '$CurrentGroupName' with ID $($CreatedGroup.id)" -output true
                Write-Log "$CreatedGroupResp"
            } catch {
                Write-Log "Could not create a '$CurrentGroupName' group. See log for details. Skipping processing current row." -errorMessage $CreatedGroupResp -output true -color Red
                continue
            }
        } else {
            Write-Log "Group '$CurrentGroupName' already exists." -output false
        }

        # Now we can fetch id of group from hashtable
        $CurrentGroupID = $GroupsHashtable[$CurrentGroupName]

        # If current processing ID of the group is not in GroupsMembershipHashtable, then fetch members of this group
        if (!$GroupsMembershipHashtable.ContainsKey($CurrentGroupID)) {
            try {
                # Get members of the group
                $GroupMembershipResp = "$(box groups:memberships $CurrentGroupID --fields='user' --json 2>&1)"
                $GroupMembership = $GroupMembershipResp | ConvertFrom-Json

                # Update hashtable GroupsMembershipHashtable by adding list of user's ids to particular group id
                $GroupsMembershipHashtable.$CurrentGroupID = @()
                $GroupMembership | ForEach-Object { $GroupsMembershipHashtable.$CurrentGroupID += $_.user.id }

                Write-Log "Successfully fetched the members of the group '$CurrentGroupName' (ID:$CurrentGroupID)." -output true
                Write-Log $GroupMembership
            } catch {
                Write-Log "Could not fetch the members of the group '$CurrentGroupName' (ID:$CurrentGroupID). See log for details. Skipping processing current row." -errorMessage $GroupMembershipResp -output true -color Red
                continue
            }
        }

        # Get the user's email being processed in the current row
        $CurrentUserEmail = $GroupInputEntry.$UserEmailColumnName

        # Ensure that it's not empty
        if (!$CurrentUserEmail) {
            Write-Log "'$UserEmailColumnName' column in row $currentRowIndex) contains invalid empty value. Skipping processing current row." -errorMessage "Invalid input data." -output true -color Red
            continue
        }

        # Ensure tha users exists in your enterprise
        if (!$UsersHashtable.ContainsKey($CurrentUserEmail)) {
            Write-Log "Could not find user with email: '$CurrentUserEmail'. Skipping processing current row." -errorMessage "User not found." -output true -color Red
            continue
        }

        # Get user's Id from hashtable
        $CurrentUserID = $UsersHashtable[$CurrentUserEmail]

        # Add user to group only if it's not there already
        if($GroupsMembershipHashtable[$CurrentGroupID].Contains($CurrentUserID)) {
            Write-Log "User '$CurrentUserEmail' (ID: $CurrentUserID) is already in group $CurrentGroupName' (ID:$CurrentGroupID)'. Skipping processing current row." -output true
            continue
        }
        else {
            try {
                # Add user to group
                $AddedGroupMembershipResp = "$(box groups:memberships:add $CurrentUserID $CurrentGroupID --json 2>&1)"
                $AddedGroupMembership = $AddedGroupMembershipResp | ConvertFrom-Json

                # Update membership hashtable by adding user id to the list of ids assigned to particular group
                $GroupsMembershipHashtable.$CurrentGroupID += $AddedGroupMembership.user.id

                Write-Log "Successfully added user '$CurrentUserEmail' (ID: $CurrentUserID) to group '$CurrentGroupName' (ID:$CurrentGroupID)." -output true
                Write-Log $AddedGroupMembershipResp
            } catch {
                Write-Log "Could not add user '$CurrentUserEmail' (ID: $CurrentUserID) to group '$CurrentGroupName' (ID:$CurrentGroupID). See log for details." -errorMessage $AddedGroupMembershipResp -output true -color Red
                continue
            }
        }
    }

    Write-Log "Finish update groups." -output true
}

########################################################################################
###   Part 2) Update collaborations   ##################################################
########################################################################################

# Collaboration group class used to tracking collaborations locally
class CollaborationGroup {
    [string]$CollaborationId
    [string]$GroupId
    [string]$Role

    CollaborationGroup([System.Object]$collaborationItem) {
        $this.CollaborationId = $collaborationItem.id
        $this.GroupId = $collaborationItem.accessible_by.id
        $this.Role = $collaborationItem.role.Replace(" ","_")
    }

    CollaborationGroup([string]$cId, [string]$gId, [string]$r) {
        $this.CollaborationId = $cId
        $this.GroupId = $gId
        $this.Role = $r.Replace(" ","_")
    }
}

# This class is used for convenient accessing/tracking collaborations assigned to folders
class FolderCollaborationStorage {
    # Hashtable where folder's id is the key and array of CollaborationGroup is a value
    $hashtable = @{}

    [void] AddCollaborationGroupForFolder([CollaborationGroup]$entry, [string]$folderId) {
        $this.hashtable.$folderId += $entry
    }

    [bool] ContainsFolderId([string]$folderId) {
        return $this.hashtable.ContainsKey($folderId)
    }

    [void] AddFolderId([string]$folderId) {
        if(!$this.hashtable.ContainsKey($folderId)) {
            $this.hashtable.$folderId = @()
        }
    }

    [CollaborationGroup] GetCollaborationGroup([string]$groupId, [string]$folderId) {
         return $this.hashtable[$folderId] | Where-Object { $_.GroupId -eq $groupId } | Select-Object -First 1
    }

    [bool] ContainsCollaborationGroup([string]$groupId, [string]$folderId) {
        return $null -ne $this.GetCollaborationGroup($groupId, $folderId)
   }
}

# Function to create collaborations based on CSV file
function Update-Collaborations {
    Write-Log "Start create collaborations..." -output true

    # Ensure that file exist
    if (-not(Test-Path -Path $CollaborationsCreationPath -PathType Leaf)) {
        Write-Log "File '$CollaborationsCreationPath' doesn't exist. Skipping groups update." -errorMessage "File not found."-output true -color Red
        return
    }

    # Read the input CSV
    try {
        $AllCollaborationsInput = Import-Csv $CollaborationsCreationPath
    } catch {
        Write-Log "Error reading '$CollaborationsCreationPath' CSV file. Skipping collaborations creation." -exception $_.Exception -output true -color Red
        return
    }

    # Check if there are any group in the input
    if (!$($($AllCollaborationsInput | Measure-Object).Count -gt 0)) {
        Write-Log "No collaborations to act upon. Skipping collaborations creation." -output true -color Yellow
        return
    }

    # Check if input file has the correct format
    $csvColumns = $AllCollaborationsInput | Get-Member -memberType 'NoteProperty' | Select-Object -ExpandProperty 'Name'
    if (-not
        (
            ($csvColumns -contains $GroupNameColumnName) -and
            ($csvColumns -contains $FolderIdColumnName) -and
            ($csvColumns -contains $CollaborationRoleColumnName)
        )
    ) {
        Write-Log "Input file '$CollaborationsCreationPath' requires '$GroupNameColumnName', '$FolderIdColumnName' and '$CollaborationRoleColumnName' columns. Skipping collaborations creation." -errorMessage "Invalid input data." -output true -color Red
        return;
    }

    # Create a storage for collaborations for easier accessing necessary data
    $FolderCollaborationStorage = [FolderCollaborationStorage]::new()

    $currentRowIndex = 0
    # Iterate through all entries from CSV input file
    foreach($CollaborationInputEntry in $AllCollaborationsInput) {
        # Rows of input data starts with 1
        $currentRowIndex++

        # Get the name of the group being processed in the current row
        $CurrentGroupName = $CollaborationInputEntry.$GroupNameColumnName

        # Ensure that it's not empty
        if (!$CurrentGroupName) {
            Write-Log "'$GroupNameColumnName' column in row $currentRowIndex) contains invalid empty value. Skipping processing current row."  -errorMessage "Invalid input data." -output true -color Red
            continue
        }

        # Ensure that a group with that name exists, if not skip processing current row
        if (!$GroupsHashtable.ContainsKey($CurrentGroupName)) {
            Write-Log "Group with name '$CurrentGroupName' doesn't exist. Skipping processing current row." -errorMessage "Invalid group name." -output true -color Red
            continue
        }

        # Get id of group from hashtable
        $CurrentGroupID = $GroupsHashtable[$CurrentGroupName]

        # Get the folderId being processed in the current row
        $CurrentFolderID = $CollaborationInputEntry.$FolderIdColumnName

        # Ensure that it's not empty
        if (!$CurrentFolderID) {
            Write-Log "'$FolderIdColumnName' column in row $currentRowIndex) contains invalid empty value. Skipping processing current row." -errorMessage "Invalid input data." -output true -color Red
            continue
        }

        # Get the name of the collaboration role being processed in the current row
        $CurrentCollaborationRole = $CollaborationInputEntry.$CollaborationRoleColumnName

        if (!$CurrentCollaborationRole) {
            # Use default collaboration role if it's empty
            $CurrentCollaborationRole = $DefaultCollaborationRole
        }

        # Ensure that collaboration role is set to valid value
        if (!$AvailableCollaborationRoles.Contains($CurrentCollaborationRole)) {
            Write-Log "'$CollaborationRoleColumnName' column in row $currentRowIndex) contains invalid value: '$CurrentCollaborationRole'. Please use one of these: '$($AvailableCollaborationRoles -join ", ")'. Skipping processing current row." -errorMessage "Invalid input data." -output true -color Red
            continue
        }

        # If current processing folderId is not in FolderCollaborationStorage, then fetch collaborations of this folder
        if(!$FolderCollaborationStorage.ContainsFolderId($CurrentFolderID)) {
            try {
                # Get members of the group
                $FolderCollaborationsResp = "$(box folders:collaborations $CurrentFolderID --fields='accessible_by,role,id' --json 2>&1)"
                $FolderCollaborations = $FolderCollaborationsResp | ConvertFrom-Json

                # Update FolderCollaborationStorage by adding list CollaborationGroup to particular folder id
                $FolderCollaborationStorage.AddFolderId($CurrentFolderID)
                $FolderCollaborations | Where-Object { $_.accessible_by.type -eq 'group' } | ForEach-Object { $FolderCollaborationStorage.AddCollaborationGroupForFolder([CollaborationGroup]::new($_), $CurrentFolderID)}

                Write-Log "Successfully fetched the collaborations of the folder with ID: $CurrentFolderID." -output true
                Write-Log $FolderCollaborations
            } catch {
                Write-Log "Could not fetch the collaborations of the folder with ID: $CurrentFolderID. See log for details. Skipping processing current row." -errorMessage $FolderCollaborationsResp -output true -color Red
                continue
            }
        }


        # Check if the group is already a collaborator to the folder
        if($FolderCollaborationStorage.ContainsCollaborationGroup($CurrentGroupID, $CurrentFolderID))
        {
            $CollaborationGroup = $FolderCollaborationStorage.GetCollaborationGroup($CurrentGroupID, $CurrentFolderID)

            # If the group is already a collaborator to the folder, check if it has the same role as in the CSV entry.
            # If they are the same, skip processing the current line.
            if($CollaborationGroup.Role -eq $CurrentCollaborationRole) {
                Write-Log "Group '$CurrentGroupName' (ID:$CurrentGroupID) is already a collaborator of folder ID: $CurrentFolderID with the same role '$CurrentCollaborationRole'. Skipping processing current row." -output true
                continue
            }
            else {
                # If the collaborator role is different from the CSV entry, check if -UpdateExistingCollabs switch is enabled to update existing collaboration. If it is, then update the collaboration with the role from CSV entry.
                if ($UpdateExistingCollabs) {
                    try {
                        # Update collaboration with the new role defined in CSV
                        $UpdatedCollaborationResp = "$(box collaborations:update $CollaborationGroup.CollaborationId --role=$CurrentCollaborationRole --json 2>&1)"
                        $UpdatedCollaborationResp | ConvertFrom-Json | Out-Null

                        # Update the role for this entry locally in FolderCollaborationStorage, to be up to date.
                        # It is possible with this simple assignment, because $CollaborationGroup is a reference type.
                        $CollaborationGroup.Role = $CurrentCollaborationRole

                        Write-Log "Successfully updated collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroupName' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole'." -output true
                        Write-Log $UpdatedCollaborationResp
                    } catch {
                        Write-Log "Could not update collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroupName' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole'. See log for details." -errorMessage $UpdatedCollaborationResp -output true -color Red
                        continue
                    }
                }
                else {
                    # If the collaborator role is different from the CSV entry, but the -UpdateExistingCollabs switch is disabled,
                    # skip processing current CSV row.
                    Write-Log ("Group '$CurrentGroupName' (ID:$CurrentGroupID) is already a collaborator of folder ID: $CurrentFolderID but with role '$($CollaborationGroup.Role)' instead of '$CurrentCollaborationRole'." +`
                    " If you want to update existing collaborations, run the script with the '-UpdateExistingCollabs' swith enabled. Skipping processing current row.")` -output true
                    continue
                }
            }
        }
        else {
            # If the group is not a collaborator to the folder yet, then create this collaboration
            try {
                # Create collaboration
                $CreatedCollaborationResp = "$(box collaborations:create $CurrentFolderID folder --group-id=$CurrentGroupID --role=$CurrentCollaborationRole --json 2>&1)"
                $CreatedCollaboration = $CreatedCollaborationResp | ConvertFrom-Json

                # Update collaboration storage by adding new CollaborationGroup item for particular folder
                $CollaborationGroupItem = [CollaborationGroup]::new($CreatedCollaboration.id, $CreatedCollaboration.accessible_by.id, $CreatedCollaboration.role)
                $FolderCollaborationStorage.AddCollaborationGroupForFolder($CollaborationGroupItem,$CurrentFolderID)

                Write-Log "Successfully created collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroupName' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole' ." -output true
                Write-Log $CreatedCollaborationResp
            } catch {
                Write-Log "Could not create collaboration to folder with ID: $CurrentFolderID, with group: '$CurrentGroupName' (ID:$CurrentGroupID) and role: '$CurrentCollaborationRole'. See log for details." -errorMessage $CreatedCollaborationResp -output true -color Red
                continue
            }
        }
    }

    Write-Log "Finish create collaborations." -output true
}

# Main function
function Start-Script {
    Write-Log "Start Mass_Group_Creation script." -output true

    # Get existing groups
    try {
        $GroupsResp = "$(box groups --json 2>&1)"
        $Groups = $GroupsResp | ConvertFrom-Json

        # Add groups to hashtable GroupsHashtable for later convenient access, where "name" is the key and "id" is a value.
        $Groups | ForEach-Object { $GroupsHashtable[$_.name] = $_.id }
    } catch {
        Write-Log "Could not get groups. See log for details." -errorMessage $GroupsResp -output true -color Red
        break
    }

    # Get list of users
    try {
        $UsersResp = "$(box users --fields='id,login,name,role' --json 2>&1)"
        $Users = $usersResp | ConvertFrom-Json

        if (($users.Length -eq 0) -or ($users.total_count -eq 0)) {
            Write-Log "No users found!" -output true -color Red
            break
        }

        # Add users to hashtable UsersHashtable for later convenient access, where "login" is the key and "id" is a value.
        $Users | ForEach-Object { $UsersHashtable[$_.login] = $_.id }
    } catch {
        Write-Log "Could not get user list. See log for details." -errorMessage $usersResp -output true -color Red
        break
    }

    if ($SkipGroupsUpdate) {
        Write-Log "Switch '-SkipGroupsUpdate' is enabled. Skipping groups update." -output true
    } else {
        # Update groups based on $UserGroupAdditionPath csv file
        Update-Groups
    }

    if ($SkipCollabsCreation) {
        Write-Log "Switch '-SkipCollabsCreation' is enabled. Skipping collaboration creation." -output true
    } else {
        # Create collaborations based on $CollaborationsCreationPath csv file
        Update-Collaborations
    }

    Write-Log "Finish Mass_Group_Creation script." -output true
}

Start-Script
