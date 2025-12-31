# This script can do one of the following things: 
# 1. Create a csv of all the current mappings between Box folders and Slack channels
# 2. Create a mapping between a Box folder and a Slack channel based on a list in a csv file
# 3. Update a mapping between a Box folder and a Slack channel based on a list in a csv file

#APP SETUP
#Oauth 2.0: User configured with CLI must be admin or co-admin
#APPLICATION SCOPES: Read all files and folders stored in Box, & Manage Enterprise Settings

#############################################################################

param (
    # The action to perform. Can be "EXTRACT", "CREATE", or "UPDATE"
    [string]$Action, 

    # The path to the csv file containing the mappings
    [string]$MappingPath = "./mapping.csv"
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
if (-not $Action) {
     Write-Log "Enter EXTRACT to grabbing current mappings, CREATE to create new mappings, or UPDATE to update existing mappings:" -output true -color Yellow
     $Action = Read-Host
}

Function Start-Integrations-Mapping {

    Write-Log "Starting Process" -output true -color Green

    try {
        #If a user inputs EXTRACT it will grab the current mappings and save them to a csv file
        #The csv is called mapping.csv by default and is saved in the same directory as the script
        If ($Action -eq "EXTRACT") {
            Write-Log "Extracting current mappings" -output true -color Green
            if (Test-Path $MappingPath) {
                Write-Log "Removing old $($MappingPath) file" -output true -color Green
                Remove-Item -Path $MappingPath -Force
                Write-Log "File $($MappingPath) removed" -output true -color Green
            }
            Write-Log "Pulling current mappings" -output true -color Green
            $ExtractionResp = (box integration-mappings:slack:list --fields='id,box_item.id,partner_item.id' --csv --save-to-file-path=$MappingPath 2>&1)
            Write-Log "Importing csv" -output true -color Green
            # Import the CSV file
            $data = Import-Csv -Path $MappingPath
            Write-Log "Renaming columns" -output true -color Green
            # Select the desired columns and rename them
            $data = $data | Select-Object -Property "id", "box_item.id", "partner_item.id" |
                    Select-Object -Property @{Name = "Id"; Expression = {$_. "id"}},
                                            @{Name = "BoxItemId"; Expression = {$_. "box_item.id"}}, 
                                            @{Name = "PartnerItemId"; Expression = {$_. "partner_item.id"}}
            Write-Log "Saving new csv file to edit" -output true -color Green
            # Overwrite the original CSV file
            $data | Export-Csv -Path $MappingPath -NoTypeInformation

            Write-Log "Extraction $($ExtractionResp | Out-String)" -output true -color Green
        
        }
        # If a user inputs CREATE it will create new mappings based on the csv file located by default at ./mapping.csv
        # You can use the mapping_create_example.csv file as a template
        # You cannot create new mappings for channels that already have mappings, instead you must update them using the UPDATE option
        # When creating mappings for new channels, you must input a box folder id, slack channel id and slack org id for each row.
        elseif ($Action -eq "CREATE") {
            Write-Log "Creating new mappings" -output true -color Green
            $EntriesResp = (box integration-mappings:slack:create --bulk-file-path=$MappingPath --json 2>&1)
            # If the response contains the word failed, it probably means the channel already has a mapping or you are missing persmissons
            if($EntriesResp | Select-String -Pattern 'failed!' -CaseSensitive -SimpleMatch) {
                Write-Log "Could not create mappings. See log for details." -errorMessage $EntriesResp -output true -color Red 
            } else {
                Write-Log "Output $($EntriesResp | Out-String)" -output true -color Green
                continue
            }
        }
        # If a user inputs UPDATE it will update the new mappings from the csv file
        # You can use the mapping_update_example.csv file as a template
        elseif ($Action -eq "UPDATE") {
            Write-Log "Updating mappings" -output true -color Green
            $EntriesResp = (box integration-mappings:slack:update --bulk-file-path=$MappingPath --json 2>&1)
            # If the response contains the word failed, it probably means the service account needs to be collabed into the folder(s)
            if($EntriesResp | Select-String -Pattern 'failed!' -CaseSensitive -SimpleMatch) {
                Write-Log "Could not update mappings. See log for details." -errorMessage $EntriesResp -output true -color Red 
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

# Ensure console output is UTF-8 so non-ASCII characters from Box CLI render correctly
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Start-Script
