#APP SETUP
#README: This powershell script will use the Box CLI to build and create a user (admin or service account) owned "Onboarding" folder structure, create managed users in bulk, and provision the new users by collaborating them as viewer and uploaders into the newly created folder structure.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

#############################################################################

#Set Employee List CSV Path
$EmployeeList = "./Employees_5.csv"

#Onboarding Folder Structure: Set either path build off JSON or directly upload a local folder
$FolderStructureJSONPath = "./Folder_Structure.json"
$LocalUploadPath = "./OnboardingLocalUpload"

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

$script:OnboardingFolderId = $null
$script:UserId = $null 

# Main function
Function Start-Script {
    Write-Log "Starting User Creation & Provisioning script..." -output true

    Try {
        # Get employees json file and convert from CSV to an array of objects
        $Employees = Import-Csv $EmployeeList
        Write-Log $Employees -output true
    }
    Catch {
        Write-Log "Failed to load mock employee data" -output true -color Red
        break
    }

    try {
        #Create Folder Structure from JSON
        New-Folder-Structure

        #OR directly upload Folder structure to current user's root folder from local directory
        #$script:OnboardingFolderId = box folders:upload $LocalUploadPath --id-only 2>&1
        #[int64]$script:OnboardingFolderId = $script:OnboardingFolderId
        #Write-Log "Uploaded local folder structre to current user's root folder with $($script:OnboardingFolderId)" -output true
    }
    Catch {
        Write-Log "Failed to setup onboarding folder" -errorMessage $script:OnboardingFolderId -output true -color Red
        break
    }

    #Create Managed User & Provision Onboarding Folder
    New-Provision-Managed-User
}

Function New-Folder-Structure {

    #Extract folder structure from json
    Write-Log "Extracting folder structure" -output True
    $FolderStructure = Get-Content -Raw -Path $FolderStructureJSONPath | ConvertFrom-Json

    try {
        #Get current user id
        $User = box users:get --json | ConvertFrom-Json
        [int64]$script:UserId = $User.id
        Write-Log "Found current User ID: $($UserId)" -output True
    }
    Catch {
        Write-Log "Failed to get current user id" -errorMessage $User -output True -color Red
        break
    }
    
    try {
        #First create Onboarding folder owned by current user
        $script:OnboardingFolderId = box folders:create 0 "Onboarding" --id-only 2>&1
        [int64]$script:OnboardingFolderId = $script:OnboardingFolderId
        Write-Log "Created a user owned Onboarding folder with id: $($OnboardingFolderId)" -output True

        #Create folder structure owned by current user
        ForEach ($subfolder in $FolderStructure) {
            $SubFolderId = box folders:create $OnboardingFolderId $subfolder.name --id-only 2>&1
            [int64]$SubFolderId = $SubFolderID
            Write-Log "Created subfolder $($subfolder.name) under Onboarding folder with id: $($SubFolderId)" -output True

            #Continue creating subfolders if object has children
            While ($subfolder.children) {
                $child = $subfolder.children
                #Write-Output "Child folder: $($child)"
                $SubFolderID = box folders:create $SubFolderId $child.name --id-only 2>&1
                [int64]$SubFolderId = $SubFolderID
                Write-Log "Created subfolder under $($child.name) folder with id: $($SubFolderId)" -output True
                $subfolder = $child.children
            }
        }
    } catch {
        Write-Log "Failed to create folder structure" -errorMessage $ -output true -color Red
        break
    }
}

Function New-Provision-Managed-User {
    ForEach ($Employee in $Employees) {
        Write-Log "Creating employee Managed User account with first name: $($Employee.firstName), last name: $($Employee.lastName), email: $($Employee.email)" -output True
        
        Try {
            #Create Managed User
            [int64]$ManagedUserID = (box users:create "$($Employee.firstName) $($Employee.lastName)" $Employee.email --id-only 2>&1)
            Write-Log "Created Managed user with id: $($ManagedUserID)" -output True

            #Collaborate New Managed User to Folder Structure owned by current user
            $CollaboratedResp = box folders:collaborations:add $script:OnboardingFolderId --role=viewer_uploader --user-id=$ManagedUserID
            Write-Log "Collaborated Managed User $($Employee.firstName) $($Employee.lastName) to current user's Onboarding folder for provisioning" -output True
        }
        Catch {
            Write-Log "Failed to create Managed User" -errorMessage $ManagedUserId -output true -color Red
            break
        }
    }
}

Start-Script
