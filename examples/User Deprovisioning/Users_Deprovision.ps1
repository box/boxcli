#APP SETUP
#README: This powershell script will use the Box CLI to deprovision a list of users by first transferring user content to the current admin user's root folder (Transfer content default: "Y") before deleting that user.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

########################################################################################
###   SCRIPT CONFIG - MODIFY THESE FOR YOUR ENVIRONMENT   ##############################
########################################################################################

# Set Employee List CSV Path
$EmployeeList = "./Employees_to_delete.csv"

# Transfer user content before deletion - "Y" or "N"
$TransferContent = "Y"

# Employee Archive folder name
$EmployeeArchiveFolderName = "Employee Archive"

########################################################################################
###   SCRIPT BUSINESS LOGIC  ###########################################################
########################################################################################

$EmployeeArchiveFolderID = $null

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

# Main function
Function Start-Script {
    Write-Log "Starting User Deprovisioning script..." -output false

    # Get employees json file and convert from CSV to an array of objects
    Try {
        $Employees = Import-Csv $EmployeeList
        Write-Log "Importing csv of users to deprovision." -output true
    }
    Catch {
        Write-Log "Error reading employee data from CSV file $EmployeeList" -exception $_.Exception -output true -color Red
        break
    }

    # Get current user id
    try {
        $UserResp = "$(box users:get --json 2>&1)"
        $User = $UserResp | ConvertFrom-Json
        $UserId = $User.id
        Write-Log "Successfully get current user: $($User.login), ID: $($User.id)." -output true
        Write-Log $UserResp
    } catch {
        Write-Log "Could not get the current user. See log for details." -errorMessage $UserResp -output true -color Red
        break
    }

    # Create a "Employee Archive" folder in User's Root directory if one does not already exist
    # List root folder contents
    try {
        $RootFolderResp = "$(box folders:items 0 --sort=name --direction=ASC --json 2>&1)"
        $RootFolder = $RootFolderResp | ConvertFrom-Json
    } catch {
        Write-Log "Could not get root directory for current user (ID: $UserId). See log for details. " -errorMessage $RootFolderResp -output true -color Red
        break
    }

    # Check if "Employee Archive" folder already exists
    ForEach($FolderItem in $RootFolder) {
        if($FolderItem.name -eq $EmployeeArchiveFolderName) {
            $EmployeeArchiveFolderID = $FolderItem.id
            Write-Log "'$EmployeeArchiveFolderName' folder already exists with folder ID: $($EmployeeArchiveFolderID)." -output true
            break
        }
    }

    # Create new "Employee Archive" folder if it doens't exist
    if($null -eq $EmployeeArchiveFolderID) {
        try {
            $EmployeeArchiveFolderResp = "$(box folders:create 0 "$EmployeeArchiveFolderName" --fields="id" --json 2>&1)"
            $EmployeeArchiveFolderID = $EmployeeArchiveFolderResp | ConvertFrom-Json | ForEach-Object { $_.id }
            Write-Log "Successfully created new '$EmployeeArchiveFolderName' root folder with ID: $($EmployeeArchiveFolderID)." -output true
            Write-Log $EmployeeArchiveFolderResp
        } catch {
            Write-Log "Could not create new '$EmployeeArchiveFolderName' root folder. See log for details." -errorMessage $EmployeeArchiveFolderResp -output true -color Red
            break
        }
    }

    # Search for employee ID
    ForEach($Employee in $Employees) {

        # Check if user exists and get user ID
        try {
            $FoundEmployeeResp = "$(box users:search $Employee.email --json 2>&1)"
            $FoundEmployee = $FoundEmployeeResp | ConvertFrom-Json

            if (($FoundEmployee.Length -eq 0) -or $($FoundEmployee.total_count) -eq 0) {
                Write-Log "No user found for email: $($Employee.email). Skipping this employee." -output true -color Yellow
                continue
            } elseif (($FoundEmployee.Length -gt 1) -or $($FoundEmployee.total_count) -gt 1) {
                Write-Log "Multiple matching users found for email: $($Employee.email). Skipping this employee." -output true -color Yellow
                Write-Log $FoundEmployeeResp
                continue
            } else {
                $FoundEmployeeID = $FoundEmployee.id
                Write-Log "Found employee $($FoundEmployee.name) with ID: $FoundEmployeeID for email: $($Employee.email)." -output true
                Write-Log $FoundEmployeeResp
            }
        } catch {
            Write-Log "Skipping this employee. Could not find user for email: $($Employee.email). See log for details." -errorMessage $FoundEmployeeResp -output true -color Red
            continue
        }

        if($TransferContent -eq "Y") {
            # Transfer users content to current user's root folder before deleting user
            Write-Log "Transferring $($FoundEmployee.name) content over to current user's Root folder with name ""$($FoundEmployee.login) - $($FoundEmployee.name)'s Files and Folders""..." -output true

            try {
                $NewFolderResp = "$(box users:transfer-content $FoundEmployeeID $UserId --json 2>&1)"
                $NewFolder = $NewFolderResp | ConvertFrom-Json
                Write-Log "Successfully transferred content to ""$($FoundEmployee.login) - $($FoundEmployee.name)'s Files and Folders""." -output true
                Write-Log $NewFolderResp
            } catch {
                Write-Log "Skipping this employee. Could not transfer $($FoundEmployee.name) content over to current user's Root folder. See log for details." -errorMessage $NewFolderResp -output true -color Red
                continue
            }

            # Move transferred folder to "Employee Archive" folder
            $TransferredFolder = $NewFolder.id
            try {
                $MoveFolderResp = "$(box folders:move $TransferredFolder $EmployeeArchiveFolderID --json 2>&1)"
                $MoveFolderResp | ConvertFrom-Json | Out-Null
                Write-Log "Successfully moved transferred employee content $($FoundEmployee.name) with User ID: $($FoundEmployeeID) to '$EmployeeArchiveFolderName' folder with ID: $EmployeeArchiveFolderID." -output true
                Write-Log $MoveFolderResp
            } catch {
                Write-Log "Skipping this employee. Could not move transferred folder with ID: $TransferredFolder to $EmployeeArchiveFolderName folder with ID: $EmployeeArchiveFolderID. See log for details." -errorMessage $MoveFolderResp -output true -color Red
                continue
           }
        }

        # Delete user
        try {
            # Because of the "-q" flag, the users:delete command returns an error if it occurs or null otherwise
            $DeleteUserResp = "$(box users:delete $FoundEmployeeID -q 2>&1)"
            if(!$DeleteUserResp) {
                Write-Log "Successfully deleted employee $($FoundEmployee.name) with ID: $($FoundEmployeeID)." -output true
            } else {
                Write-Log "Could not delete employee $($FoundEmployee.name) with ID: $($FoundEmployeeID). See log for details." -errorMessage $DeleteUserResp -output true -color Red
                continue
            }
        } catch {
            Write-Log "Could not delete employee $($FoundEmployee.name) with ID: $($FoundEmployeeID). See log for details." -errorMessage $DeleteUserResp -output true -color Red
            continue
        }
    }

    Write-Log "Complete User Deprovisioning script."
}

Start-Script
