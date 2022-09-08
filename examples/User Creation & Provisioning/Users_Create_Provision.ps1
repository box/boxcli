#APP SETUP
#README: This powershell script will use the Box CLI to build and create a user (admin or service account) owned "Personal" folder structure, create managed users in bulk, and provision the new users by collaborating them as viewer and uploaders into their newly created personal folder structure.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access Selected
#FOR Oauth 2.0 APPS: User configured with CLI must be admin or co-admin
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

########################################################################################

param (
    [string]$EmployeeList, # Path to Employee List CSV
    [string]$FolderStructureJSONPath, # Path to JSON file with folder structure to be created
    [string]$LocalUploadPath, # Path to the local directory you want to upload
    [string]$PersonalFolderSlug, # Name of the folder, that will be created as parent for folders from JSON structure
    [string]$PersonalFolderParentID # Destination folder ID for your changes
)

### Backup script parameters to variables
$EmployeeListParam = $EmployeeList
$FolderStructureJSONPathParam = $FolderStructureJSONPath
$LocalUploadPathParam = $LocalUploadPath
$PersonalFolderSlugParam = $PersonalFolderSlug
$PersonalFolderParentIDParam = $PersonalFolderParentID

#############################################################################

### Example of configuration

# $EmployeeList = "./Employees_5.csv"
# $FolderStructureJSONPath = "./Folder_Structure.json"
# $LocalUploadPath = "./PersonalLocalUpload"
# $PersonalFolderSlug = "Personal Folder"
# $PersonalFolderParentID = "0"


# Set Employee List CSV Path
# firstname, lastname, email, username
# NOTE 1 - EMAILS MUST BE UNIQUE ACROSS ALL OF BOX - CANNOT CREATED EMAILS USED PREVIOUSLY
# NOTE 2 - USERNAME MUST BE UNIQUE ACROSS YOUR BOX INSTANCE. - THIS IS USED FOR THE PERSONAL FOLDER NAME 
$EmployeeList = "./Employees_5.csv"

# Personal Folder Structure: Set either path build off JSON or directly upload a local folder
$FolderStructureJSONPath = "./Folder_Structure.json"
$LocalUploadPath = ""

# Ending slug of folder that will be created as parent Personal folder for folders defined in json file. Value will get concatenated with username
# If username is RSMITH, the boarding folder name would be RSMITH Personal Folder
$PersonalFolderSlug = "Personal Folder"

# ID of folder, where the above Personal folder will be created if using JSON structure,
# otherwise it's a destination folder for local uploaded folder structure.
# This folder should be created before running the script the first time.
# It is not advised to make this value 0, as this will create individual Personal folders in root of the account you set up the cli with
$PersonalFolderParentID = "125829599929"

#############################################################################

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

#############################################################################

# Prioritize script parameters over hard coded values
if ($EmployeeListParam) {
    $EmployeeList = $EmployeeListParam
}
if ($FolderStructureJSONPathParam) {
    $FolderStructureJSONPath = $FolderStructureJSONPathParam
}
if ($LocalUploadPathParam) {
    $LocalUploadPath = $LocalUploadPathParam
}
if ($PersonalFolderSlugParam) {
    $PersonalFolderSlug = $PersonalFolderSlugParam
}
if ($PersonalFolderParentIDParam) {
    $PersonalFolderParentID = $PersonalFolderParentIDParam
}
if ($LocalUploadPath -and $FolderStructureJSONPath) {
    Write-Log "Please specify either a local upload path or a folder structure JSON path, not both." -output true -color Red
    exit
}

# Prompt for params if some are missing
if (-not $EmployeeList) {
    Write-Log "Please enter the path to the employee list CSV file:" -output true -color Yellow
    $EmployeeList = Read-Host
}
if (-not $FolderStructureJSONPath -and -not $LocalUploadPath) {
    Write-Log "Please enter the path to the folder structure JSON file or the local upload path:"  -output true -color Yellow
    $UserInput = Read-Host
    if (Test-Path $UserInput) {
        if ((Get-Item $UserInput) -is [System.IO.DirectoryInfo]) {
            $LocalUploadPath = $UserInput
            Write-Log "Local upload path set to: $LocalUploadPath" -output true -color Green
        } else {
            $FolderStructureJSONPath = $UserInput
            Write-Log "Folder structure JSON path set to: $FolderStructureJSONPath" -output true -color Green
        }
    } else {
        Write-Log "Path does not exist." -errorMessage "Path $UserInput does not exist" -output true -color Red
        exit
    }
}
if (-not $PersonalFolderSlug -and $FolderStructureJSONPath) {
    Write-Log "Please enter the name of the root folder:" -output true -color Yellow
    $PersonalFolderSlug = Read-Host
}
if (-not $PersonalFolderParentID) {
    Write-Log "Please enter the ID of the parent folder for the root folder:" -output true -color Yellow
    $PersonalFolderParentID = Read-Host
}

if (-not ($EmployeeList -and ($FolderStructureJSONPath -or $LocalUploadPath) -and $PersonalFolderParentID) -or ($FolderStructureJSONPath -and -not $PersonalFolderSlug)) {
    Write-Log "Missing required parameters." -errorMessage "Missing required parameters" -output true -color Red
    exit
}

#############################################################################

$script:PersonalFolderID = $null

#  User Creation & Perfonal Folder Provisioning
Function Start-Users-Provisoning-Creation-Script {
    Write-Log "Starting User Creation & Personal Folder Provisioning script..." -output true

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
        #Create Managed Users and Provision Personal Folder
        New-Provision-Managed-User
        Write-Log "Users and Folders Created Successfully" -output true
    }
    catch {
        Write-Log "Failed to create managed users. Exists Script." -errorMessage "Something went wrong" -output true -color Red
    }

}

# Create new managed users and add them as collaborators to created folders
Function New-Provision-Managed-User {
    ForEach ($Employee in $Employees) {
        Write-Log "Creating employee Managed User account with first name: $($Employee.firstName), last name: $($Employee.lastName), email: $($Employee.email)" -output True

        # Create Managed User
        try {
            $CreatedManagedUserResp = (box users:create "$($Employee.firstName) $($Employee.lastName)" $Employee.email --json 2>&1)
            $ManagedUserID = $CreatedManagedUserResp | ConvertFrom-Json | ForEach-Object { $_.id }
            Write-Log "Created Managed user for email: $($Employee.email) where ID: $($ManagedUserID)." -output True
        }
        catch {
            Write-Log "Failed to create Managed User for email: $($Employee.email). Skipping this user. See log for details." -errorMessage $CreatedManagedUserResp -output true -color Red
            continue
        }
        
        #Create Folders
        try {
            $script:PersonalFolderName = $($Employee.username) + "'s " + $PersonalFolderSlug
            Write-Log "Personal Folder Name: $PersonalFolderName " -output True
            if ($FolderStructureJSONPath) {
                # Create Folder Structure from JSON
                New-Folder-Structure
            }
            elseif ($LocalUploadPath) {
                # OR directly upload Folder structure to current user's root folder from local directory
                $UploadedFoldersResp = box folders:upload $LocalUploadPath --parent-folder=$PersonalFolderParentID --folder-name=$script:PersonalFolderName --json 2>&1
                $script:PersonalFolderID = $UploadedFoldersResp | ConvertFrom-Json | ForEach-Object { $_.id }
            }
            Write-Log "Uploaded local folder structure to current user's folder with ID $($script:PersonalFolderID) where parent ID: $PersonalFolderParentID." -output true
        }
        catch {
            Write-Log "Failed to upload local folder structure to parent folder with ID $PersonalFolderParentID. Exits script." -errorMessage $UploadedFoldersResp -output true -color Red
            break
        }

        # Collaborate New Managed User to Folder Structure owned by current user
        try {
            $CollaboratedResp = box folders:collaborations:add $script:PersonalFolderID --role=viewer_uploader --user-id=$ManagedUserID --json 2>&1
            $CollaboratedResp | ConvertFrom-Json | Out-Null
            Write-Log "Collaborated Managed User $($Employee.firstName) $($Employee.lastName) to current user's indicated folder for provisioning with ID: $script:PersonalFolderID." -output True
        }
        catch {
            Write-Log "Failed to create collaboration for user $($Employee.firstName) $($Employee.lastName) with ID: $ManagedUserID, to folder ID: $script:PersonalFolderID. See log for details." -errorMessage $CollaboratedResp -output true -color Red
            continue
        }
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

    # Create Personal Root folder
    try {
        $CreatedPersonalFolderResp = box folders:create "$PersonalFolderParentID" "$script:PersonalFolderName" --json 2>&1
        $script:PersonalFolderID = $CreatedPersonalFolderResp | ConvertFrom-Json | ForEach-Object { $_.id }
        Write-Log "Created a user owned '$PersonalFolderSlug' folder with id: $($script:PersonalFolderID)." -output True
    }
    catch {
        Write-Log "Failed to create '$script:PersonalFolderName' folder. See log for details. Exits script.". -errorMessage $CreatedPersonalFolderResp -output True -color Red
        break
    }

    # Create all folders structure from json file, where $PersonalFolderSlug is the parent
    New-Subfolders-Recursively "$script:PersonalFolderID" "$script:PersonalFolderName" $FolderStructure
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

            if ($child.children -and $child.children.Length -gt 0) {
                New-Subfolders-Recursively "$($CreatedChildFolder.id)" "$($child.name)" $($child.children)
            }
        }
        catch {
            Write-Log "Failed to create subfolder '$($child.name)' under '$ParentFolderName' (ID: $ParentFolderId) folder. See log for details.". -errorMessage $CreatedChildFolderResp -output True -color Red
            continue
        }
    }
}

# Start function
Function Start-Script {
    try {
        $AnalyticsClientManager = [AnalyticsClientManager]::new($(Get-Script-Name).ToLower())
        $AnalyticsClientManager.SetScriptAnalyticsClient()

        Start-Users-Provisoning-Creation-Script
    } finally {
        $AnalyticsClientManager.UnsetScriptAnalyticsClients()
    }
}

Start-Script
