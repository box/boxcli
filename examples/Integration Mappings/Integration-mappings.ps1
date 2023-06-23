# This script can do one of the following things: 
# 1. Create a csv of all the current mappings between Box folders and Slack channels
# 2. Create a mapping between a Box folder and a Slack channel based on a list in a csv file

#APP SETUP
#Oauth 2.0: User configured with CLI must be admin or co-admin
#APPLICATION SCOPES: Read all files and folders stored in Box, & Manage Enterprise Settings

#############################################################################

param (
    [string]$action
)

#############################################################################

# Get current script file name
Function Get-Script-Name()
{
    $filename = $MyInvocation.ScriptName | Split-Path -Leaf
    if ($filename -match ".")
    {
        $filename = $filename.Substring(0,$filename.LastIndexOf("."))
    }

    return $filename
}

# Function to write to logs
Function Write-Log
{
    param ([string]$message, [string]$errorMessage = $null, [Exception]$exception = $null, [string]$output = $false, [string]$color = "Green")

    # Define log level - Can be "errors" or "all"
    $logLevel = "all"

    # Create logs directory if it doesn't exist
    if (-not(Test-Path ".\logs"))
    {
        New-Item -Path . -Name "logs" -ItemType 'directory' > $null
    }

    $dateTime = Get-Date

    # Set log filename to the name of the script
    $logFilename = Get-Script-Name
    $debugErrorFile = ".\logs\" + $logFilename + "_errors.txt"
    $debugAllFile = ".\logs\" + $logFilename + "_all.txt"

    if ($exception -or $errorMessage)
    {
        $severity = "ERROR"
    }
    else
    {
        $severity = "INFO"
    }

    if ($exception.Response)
    {
        $result = $exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd();
    }

    $logMessage = ($severity + "`t")
    $logMessage += ($dateTime)
    $logMessage += ("`t" + $message + "`t")

    if ($exception)
    {
        $logMessage += ($exception.Message + "`t")
    }

    if ($errorMessage)
    {
        $logMessage += ($errorMessage + "`t")
    }

    if ($responseBody)
    {
        $logMessage += ("Box responded with: " + $responseBody + "`t")
    }

    if ($output -eq "true")
    {
        Write-Host $message -ForegroundColor $color
    }

    if ($logLevel -eq "all")
    {
        $logMessage | Add-Content $debugAllFile

        if ($severity -eq "ERROR")
        {
            $logMessage | Add-Content $debugErrorFile
        }
    }
    else
    {
        if ($severity -eq "ERROR")
        {
            $logMessage | Add-Content $debugErrorFile
        }
    }
}

# This class is used for setting/restoring analytics client header when running this script
class AnalyticsClientManager
{
    [string]$TemporaryAnalyticsClientName
    [string]$OriginalAnalyticsClientName
    [bool]$IsOriginalAnalyticsClientEnabled

    AnalyticsClientManager([string]$temporaryAnalyticsClientName)
    {
        $this.TemporaryAnalyticsClientName = "box_sample_scripts $( $temporaryAnalyticsClientName )"
    }

    [bool]
    IsAnalyticsClientSupported()
    {
        return "$( box configure:settings --help )" -like "*--analytics-client-name*--json*"
    }

    [void]
    StoreOriginalSettings()
    {
        $SettingsContent = "$( box configure:settings --json )" | ConvertFrom-Json

        $this.OriginalAnalyticsClientName = $SettingsContent.AnalyticsClient.Name
        if (!$this.OriginalAnalyticsClientName)
        {
            $this.OriginalAnalyticsClientName = "cli"
        }

        if ($SettingsContent.EnableanalyticsClient)
        {
            $this.IsOriginalAnalyticsClientEnabled = $true
        }
        else
        {
            $this.IsOriginalAnalyticsClientEnabled = $false
        }

        Write-Log "Stored original analytics client settings, name: $( $this.OriginalAnalyticsClientName ), enabled: $( $this.IsOriginalAnalyticsClientEnabled )." -output false
    }

    [void]
    RestoreOriginalSettings()
    {
        if ($this.IsOriginalAnalyticsClientEnabled)
        {
            $RestoreAnalyticsClientEnablementState = "--enable-analytics-client"
        }
        else
        {
            $RestoreAnalyticsClientEnablementState = "--no-enable-analytics-client"
        }

        "$( box configure:settings $RestoreAnalyticsClientEnablementState --analytics-client-name=$($this.OriginalAnalyticsClientName) )"
        Write-Log "Restored original analytics client settings, name: $( $this.OriginalAnalyticsClientName ), enabled: $( $this.IsOriginalAnalyticsClientEnabled )." -output false
    }

    [void]
    SetScriptAnalyticsClient()
    {
        if ( $this.IsAnalyticsClientSupported())
        {
            $this.StoreOriginalSettings()

            "$( box configure:settings --enable-analytics-client --analytics-client-name=$($this.TemporaryAnalyticsClientName) )"
            Write-Log "Set temporarily analytics client settings, name: $( $this.TemporaryAnalyticsClientName ), enabled: true." -output false
        }
    }

    [void]
    UnsetScriptAnalyticsClients()
    {
        if ( $this.IsAnalyticsClientSupported())
        {
            $this.RestoreOriginalSettings()
        }
    }
}

#############################################################################

# Check if any of the command-line arguments are missing
# If so, prompt the user to enter them
if (-not $action) {
     Write-Log "Enter EXTRACT to grabbing current mappings or APPLY to apply new mappings:" -output true -color Yellow
     $action = Read-Host
}

Function Start-Integrations-Mapping {

    Write-Log "Starting Process" -output true -color Green

    try {
        #If a user inputs EXTRACT it will grab the current mappings and save them to a csv file
        If ($action -eq "EXTRACT") {
            Write-Log "Extracting current mappings" -output true -color Green
            if (Test-Path mappings.csv) {
                Write-Log "Removing old mappings2.csv" -output true -color Green
                Remove-Item -Path mappings.csv -Force
                Write-Log "File mappings2.csv removed" -output true -color Green
            }
            Write-Log "Pulling current mappings" -output true -color Green
            $ExtractionResp = (box integration-mappings:slack:list --csv --save-to-file-path=mappings.csv 2>&1)
            Write-Log "Importing csv" -output true -color Green
            # Import the CSV file
            $data = Import-Csv -Path ./mappings.csv
            Write-Log "Selecting correct data with new columbns" -output true -color Green
            # Select the desired columns and rename them
            $data = $data | Select-Object -Property "id", "box_item.id" |
                    Select-Object -Property @{Name = "Id"; Expression = {$_. "id"}},
                                            @{Name = "BoxItemId"; Expression = {$_. "box_item.id"}}
            Write-Log "Saving new csv file to edit" -output true -color Green
            # Overwrite the original CSV file
            $data | Export-Csv -Path ./mappings.csv -NoTypeInformation

            Write-Log "Extraction $($ExtractionResp | Out-String)" -output true -color Green
        
        }
        # If a user inputs APPLY it will apply the new mappings from the csv file
        elseif ($action -eq "APPLY") {
            Write-Log "Applying new mappings" -output true -color Green
            $EntriesResp = (box integration-mappings:slack:update --bulk-file-path=mappings.csv --json 2>&1)
            # If the response contains the word failed, it probably means the service account needs to be collabed into the folder(s)
            if($EntriesResp | Select-String -Pattern 'failed!' -CaseSensitive -SimpleMatch) {
                Write-Log "Could not apply mappings. See log for details." -errorMessage $EntriesResp -output true -color Red 
            } else {
                Write-Log "Output $($EntriesResp | Out-String)" -output true -color Green
                continue
            }
        }
        else {
            Write-Log "Invalid option selected" -output true -color Red
            break
        }
    }
    catch {
        Write-Log "Could not apply or extract mappings. See error log for details." -errorMessage $EntriesResp -output True -color Red
        break
    }
}


# Start function
Function Start-Script {
    try {
        $AnalyticsClientManager = [AnalyticsClientManager]::new($( Get-Script-Name ).ToLower())
        $AnalyticsClientManager.SetScriptAnalyticsClient()

        Start-Integrations-Mapping  # Start the script
    }
    finally {
        $AnalyticsClientManager.UnsetScriptAnalyticsClients()
    }
}

Start-Script
