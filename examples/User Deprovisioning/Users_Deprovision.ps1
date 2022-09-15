#APP SETUP
#README: This powershell script will use the Box CLI to deprovision a list of users by first transferring user content to the current admin user's root folder (Transfer content default: "Y") before deleting that user.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header
########################################################################################

param (
    [switch]$DryRun = $false, # if enabled, then no delete/create/update calls will be made, only read ones
    [string]$NewFilesOwnerID = "" # The ID of the user to transfer files to before deleting the user
)
Set-Alias box /Users/mcong/boxcli/bin/run;
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
        return "$(box  configure:settings --help)" -like "*--analytics-client-name*--json*"
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

# Function to check if current script is running under non-interactive mode
function Assert-IsNonInteractiveShell {
    # Test each Arg for match of abbreviated '-NonInteractive' command.
    $NonInteractive = [Environment]::GetCommandLineArgs() | Where-Object{ $_ -like '-NonI*' }

    if ([Environment]::UserInteractive -and -not $NonInteractive) {
        # We are in an interactive shell.
        return $false
    }

    return $true
}

# Deprovision users
Function Start-Deprovisioning-Script {
    if ($DryRun) {
        Write-Log "Starting User Deprovisioning script in DryRun mode" -output false
    } else {
        Write-Log "Starting User Deprovisioning script" -output false
    }

    # Get employees json file and convert from CSV to an array of objects
    Try {
        $Employees = Import-Csv $EmployeeList
        Write-Log "Importing csv of users to deprovision." -output true
    }
    Catch {
        Write-Log "Error reading employee data from CSV file $EmployeeList" -exception $_.Exception -output true -color Red
        break
    }

    # Create folder if need to transfer content
    if ($TransferContent -eq "Y") {
        # Check if new file owner ID already specified
        if ($NewFilesOwnerID) {
            $UserId = $NewFilesOwnerID
        } elseif (!(Assert-IsNonInteractiveShell)) {
            Write-Log "Please specify the user ID of the user who will own the files of the users being deprovisioned." -output true -color Yellow
            Write-Log "Press Enter if you want to use the current user as the new owner." -output true -color Yellow
            $UserId = Read-Host "User ID"
        }
        
        # No user ID specified or in non-interactive mode
        if (!$UserId) {
            Write-Log "No user ID specified. Using current user as the new files owner." -output true -color Yellow
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
        }
        
        # Check if user ID is valid
        if ($UserId) {
            try {
                $UserResp = "$(box users:get --as-user=$UserId --json 2>&1)"
                $User = $UserResp | ConvertFrom-Json
            } catch {
                Write-Log "Could not get the user with ID $UserId. See log for details." -errorMessage $UserResp -output true -color Red
                break
            }
        } else {
            Write-Log "Missing required user ID." -errorMessage "Missing required user ID." -output true -color Red
            break
        }

        # Create a "Employee Archive" folder in User's Root directory if one does not already exist
        # List root folder contents
        try {
            $RootFolderResp = "$(box folders:items 0 --sort=name --direction=ASC --as-user=$UserId --json 2>&1)"
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

        # Create new "Employee Archive" folder if it doesn't exist
        if($null -eq $EmployeeArchiveFolderID) {
            if(!$DryRun) {
                try {
                    $EmployeeArchiveFolderResp = "$(box folders:create 0 "$EmployeeArchiveFolderName" --as-user=$UserId --fields="id" --json 2>&1)"
                    $EmployeeArchiveFolderID = $EmployeeArchiveFolderResp | ConvertFrom-Json | ForEach-Object { $_.id }
                    Write-Log "Successfully created new '$EmployeeArchiveFolderName' root folder with ID: $($EmployeeArchiveFolderID)." -output true
                    Write-Log $EmployeeArchiveFolderResp
                } catch {
                    Write-Log "Could not create new '$EmployeeArchiveFolderName' root folder. See log for details." -errorMessage $EmployeeArchiveFolderResp -output true -color Red
                    break
                }
            } else {
                Write-Log "`"DryRun`" mode is enabled. Script would have created new '$EmployeeArchiveFolderName' root folder." -output true
            }
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
            if(!$DryRun) {
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
                    $MoveFolderResp = "$(box folders:move $TransferredFolder $EmployeeArchiveFolderID --as-user=$UserId --json 2>&1)"
                    $MoveFolderResp | ConvertFrom-Json | Out-Null
                    Write-Log "Successfully moved transferred employee content $($FoundEmployee.name) with User ID: $($FoundEmployeeID) to '$EmployeeArchiveFolderName' folder with ID: $EmployeeArchiveFolderID." -output true
                    Write-Log $MoveFolderResp
                } catch {
                    Write-Log "Skipping this employee. Could not move transferred folder with ID: $TransferredFolder to $EmployeeArchiveFolderName folder with ID: $EmployeeArchiveFolderID. See log for details." -errorMessage $MoveFolderResp -output true -color Red
                    continue
                }
            } else {
                Write-Log ("`"DryRun`" mode is enabled. Script would have transferred employee's content" +`
                " to `"$($FoundEmployee.login) - $($FoundEmployee.name)'s Files and Folders`"" +`
                " and then moved it to `"$EmployeeArchiveFolderName`" folder.") `
                -output true
            }
        }

        # Delete user
        if(!$DryRun) {
            try {
                $DeleteUserResp = "$(box users:delete $FoundEmployeeID 2>&1)"
                if($LASTEXITCODE -eq 0) {
                    Write-Log "Successfully deleted employee $($FoundEmployee.name) with ID: $($FoundEmployeeID)." -output true
                } else {
                    Write-Log "Could not delete employee $($FoundEmployee.name) with ID: $($FoundEmployeeID). See log for details." -errorMessage $DeleteUserResp -output true -color Red
                    continue
                }
            } catch {
                Write-Log "Could not delete employee $($FoundEmployee.name) with ID: $($FoundEmployeeID). See log for details." -errorMessage $DeleteUserResp -output true -color Red
                continue
            }
        } else {
            Write-Log "`"DryRun`" mode is enabled. Script would have deleted employee $($FoundEmployee.name) with ID: $($FoundEmployeeID)." -output true
        }
    }

    Write-Log "Complete User Deprovisioning script."
}

# Start function
Function Start-Script {
    try {
        $AnalyticsClientManager = [AnalyticsClientManager]::new($(Get-Script-Name).ToLower())
        $AnalyticsClientManager.SetScriptAnalyticsClient()

        Start-Deprovisioning-Script
    } finally {
        $AnalyticsClientManager.UnsetScriptAnalyticsClients()
    }
}

Start-Script
