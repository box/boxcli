#APP SETUP
#README: This powershell script will use the Box CLI to build and create a user (admin or service account) owned "Onboarding" folder structure, create managed users in bulk, and provision the new users by collaborating them as viewer and uploaders into the newly created folder structure.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

#############################################################################

# Set Employee List CSV Path
$EmployeeList = "./Employees_5.csv"

# Onboarding Folder Structure: Set either path build off JSON or directly upload a local folder
$FolderStructureJSONPath = "./Folder_Structure.json"
$LocalUploadPath = "./OnboardingLocalUpload"

# Name of folder that will be created as parent root folder for folders defined in json file
$RootFolderName = "Onboarding"

# ID of folder, wherein root folder will be created if using JSON structure,
# otherwise it's a destination folder for local uploaded folder structure.
$RootFolderParentID = "0"

#############################################################################

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

$script:RootFolderID = $null

# Main function
Function Start-Script {
    Write-Log "Starting User Creation & Provisioning script..." -output true

    try {
        # Get employees json file and convert from CSV to an array of objects
        $Employees = Import-Csv $EmployeeList
        Write-Log $Employees -output true
    }
    catch {
        Write-Log "Failed to load mock employee data. Exits script." -errorMessage "Invalid input data." -output true -color Red
        break
    }

    try {
        # Create Folder Structure from JSON
        New-Folder-Structure

        # OR directly upload Folder structure to current user's root folder from local directory
        # $UploadedFoldersResp = box folders:upload $LocalUploadPath --parent-folder=$RootFolderParentID --json 2>&1
        # $script:RootFolderID = $UploadedFoldersResp | ConvertFrom-Json | ForEach-Object { $_.id }
        Write-Log "Uploaded local folder structre to current user's folder with ID $($script:RootFolderID) where parent ID: $RootFolderParentID." -output true
    }
    catch {
        Write-Log "Failed to upload local folder structure to parent folder with ID $RootFolderParentID. Exits script." -errorMessage $UploadedFoldersResp -output true -color Red
        break
    }

    # Create Managed User & Provision Onboarding Folder.
    # Only if folders were created successfully.
    if ($script:RootFolderID) {
        New-Provision-Managed-User
    }
}

# Create folder sturcture form JSON file
Function New-Folder-Structure {
    # Extract folder structure from json
    Write-Log "Extracting folder structure" -output True
    try {
        $FolderStructure = Get-Content -Raw -Path $FolderStructureJSONPath | ConvertFrom-Json
    }
    catch {
        Write-Log "Error reading '$FolderStructureJSONPath'. Exits script.". -errorMessage "Invalid input data."  -output True -color Red
        break
    }

    # Create root folder
    try {
        $CreatedRootFolderResp = box folders:create "$RootFolderParentID" "$RootFolderName" --json 2>&1
        $script:RootFolderID = $CreatedRootFolderResp | ConvertFrom-Json | ForEach-Object { $_.id }
        Write-Log "Created a user owned '$RootFolderName' folder with id: $($script:RootFolderID)." -output True
    }
    catch {
        Write-Log "Failed to create '$RootFolderName' folder. See log for details. Exits script.". -errorMessage $CreatedRootFolderResp -output True -color Red
        break
    }

    # Create all folders structure from json file, where $RootFolderName is the parent
    New-Subfolders-Recursively "$script:RootFolderID" "$RootFolderName" $FolderStructure
}

# Creates folders structure
Function New-Subfolders-Recursively {
    Param
    (
         [Parameter(Mandatory=$true, Position=0)]
         [string] $ParentFolderId,
         [Parameter(Mandatory=$true, Position=1)]
         [string] $ParentFolderName,
         [Parameter(Mandatory=$true, Position=2)]
         [System.Object[]] $Children
    )

    ForEach ($child in $Children) {
        try {
            $CreatedChildFolderResp = box folders:create "$($ParentFolderId)" "$($child.name)" --fields="id,name" --json 2>&1
            $CreatedChildFolder = $CreatedChildFolderResp | ConvertFrom-Json
            Write-Log "Created subfolder '$($child.name)' with id: $($CreatedChildFolder.id) under '$ParentFolderName' (ID: $ParentFolderId) folder." -output True

            if ($child.children && $child.children.Length -gt 0) {
                New-Subfolders-Recursively "$($CreatedChildFolder.id)" "$($child.name)" $($child.children)
            }
        }
        catch {
            Write-Log "Failed to create subfolder '$($child.name)' under '$ParentFolderName' (ID: $ParentFolderId) folder. See log for details.". -errorMessage $CreatedChildFolderResp -output True -color Red
            continue
        }
    }
}

# Create new managed users and add them as collaborators to created folders
Function New-Provision-Managed-User {
    ForEach ($Employee in $Employees) {
        Write-Log "Creating employee Managed User account with first name: $($Employee.firstName), last name: $($Employee.lastName), email: $($Employee.email)" -output True

        # # Create Managed User
        try {
            $CreatedManagedUserResp = (box users:create "$($Employee.firstName) $($Employee.lastName)" $Employee.email --json 2>&1)
            $ManagedUserID = $CreatedManagedUserResp | ConvertFrom-Json | ForEach-Object { $_.id }
            Write-Log "Created Managed user for email: $($Employee.email) where ID: $($ManagedUserID)." -output True
        }
        catch {
            Write-Log "Failed to create Managed User for email: $($Employee.email). Skipping this user. See log for details." -errorMessage $CreatedManagedUserResp -output true -color Red
            continue
        }

        # Collaborate New Managed User to Folder Structure owned by current user
        try {
            $CollaboratedResp = box folders:collaborations:add $script:RootFolderID --role=viewer_uploader --user-id=$ManagedUserID --json 2>&1
            $CollaboratedResp | ConvertFrom-Json | Out-Null
            Write-Log "Collaborated Managed User $($Employee.firstName) $($Employee.lastName) to current user's indicated folder for provisioning with ID: $script:RootFolderID." -output True
        }
        catch {
            Write-Log "Failed to create collaboration for user $($Employee.firstName) $($Employee.lastName) with ID: $ManagedUserID, to folder ID: $script:RootFolderID. See log for details." -errorMessage $CollaboratedResp -output true -color Red
            continue
        }
    }
}

Start-Script
