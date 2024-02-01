#README: This powershell script will extract all metadata (all templates) from all files in user inputted folder ID and generate separate CSV's for each metadata template.

#APP SETUP
#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

#############################################################################

param (
# Set specific folder ID in which to get metadata values from
    [string]$FolderID = "",

# Set to a specific Box user id if you would like to pull metadata as a specific user instead of the current user
    [string]$UserId = "",

# If enabled, the "displayName" of the metadata template field will be used as the header instead of the "key"
    [switch]$UseDisplayName = $false
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
# Prompt for params if some are missing
if (-not$FolderID)
{
    Write-Log "Please enter the ID of the folder to extract metadata from:" -output true -color Yellow
    $FolderID = Read-Host
}

if (-not$UserId)
{
    Write-Log "Please specify the user ID  to pull metadata as a specific user" -output true -color Yellow
    Write-Log "Press Enter if you want to run script as the current user." -output true -color Yellow
    $UserId = Read-Host "User ID"
}

Function Start-Metadata-Extraction {

    Write-Log "Pulling data from Folder ID: $FolderID" -output true -color Green

    try {
        #Pull all Items ID values from Folder ID
        If (!$UserId) {
            #Run as default user
            Write-Log "No user ID specified. Using current user." -output true -color Yellow
            $EntriesResp = (box folders:items $FolderID --json 2>&1)
        }
        Else {
            Write-Log "Extracting metadata as user ID: $UserId" -output true -color Yellow
            #Run with as-user header with inputted User ID
            $EntriesResp = (box folders:items $FolderID --as-user=$UserId --json 2>&1)
        }

        $Entries = $EntriesResp | ConvertFrom-Json
    }
    catch {
        Write-Log "Could not get the folder items. See error log for details." -errorMessage $EntriesResp -output True -color Red
        break
    }

    Write-Log "Output $($Entries | Out-String)"
    $MetadataTemplatesHashmap = @{}
    $HeaderFieldName = If ($UseDisplayName) { 'displayName' } Else { 'key' }

    ForEach ($Item in $Entries) {
        $ItemID = $Item.id
        Write-Log "Reading Item ID: $ItemID" -output true -color Green

        #Pull Metadata values from Folder ID's
        try {
            If (!$UserId) {
                #Run as default user (service account)
                If ($Item.type -eq 'file') {
                    $MetadataResp = (box files:metadata $ItemID --json 2>&1)
                }
                elseif ($Item.type -eq 'folder') {
                    $MetadataResp = (box folders:metadata $ItemID --json 2>&1)
                }
            }
            Else {
                #Run with as-user header with inputted User ID
                If ($Item.type -eq 'file') {
                    $MetadataResp = (box files:metadata $ItemID --as-user=$UserId --json 2>&1)
                }
                elseif ($Item.type -eq 'folder') {
                    $MetadataResp = (box folders:metadata $ItemID --as-user=$UserId --json 2>&1)
                }
            }
            $Metadata = $MetadataResp | ConvertFrom-Json
        }
        catch {
            Write-Log "Could not get the metadata for item. See error log for details." -errorMessage $MetadataResp -output True -color Red
            continue
        }


        #Loop through each metadata entry to add additional folder info & separate according to metadata template
        ForEach ($MetadataValue in $Metadata) {
            $TemplateKey = $MetadataValue."`$template"

            #Pull MetadataTemplate to get access to all it's fields and put it in a hashmap.
            if (!$MetadataTemplatesHashmap.ContainsKey($TemplateKey)) {
                Write-Log "Pulling MetadataTemplate for templateKey: $TemplateKey" -output true -color Green
                Try {
                    if (!$UserId) {
                        $MetadataTemplateResp = (box metadata-templates:get $TemplateKey --json 2>&1)
                    } else {
                        $MetadataTemplateResp = (box metadata-templates:get $TemplateKey --as-user=$UserId --json 2>&1)
                    }

                    $MetadataTemplate = $MetadataTemplateResp | ConvertFrom-Json
                    $MetadataTemplatesHashmap[$TemplateKey] = $MetadataTemplate
                }  Catch {
                    Write-Log "Could not get the metadata template for item. See error log for details." -errorMessage $MetadataTemplateResp -output True -color Red
                }
            }

            #Prepare the MetadataValue object by setting its fields name based on the passed UseDisplayName flag,
            #which determines the name of the field used in the variable HeaderFieldName.
            foreach ($MetadataTemplateField in $MetadataTemplatesHashmap[$TemplateKey].fields){
                #To maintain the continuity of fields from the metadata template in the resulting CSV file, we remove and then add them at the end
                if ($MetadataValue.PSObject.Properties.Name -contains $($MetadataTemplateField.key)) {
                    $metadataFieldValue = $MetadataValue.$($MetadataTemplateField.key);
                    $MetadataValue.PSObject.Properties.Remove($($MetadataTemplateField.key));
                    $MetadataValue | Add-Member -NotePropertyName "$($MetadataTemplateField.$HeaderFieldName)" -NotePropertyValue $metadataFieldValue;
                } else {
                    #We add a field with an empty value so that it's included in the CSV file header, ensuring that subsequent items with this field will also be added
                    $MetadataValue | Add-Member -NotePropertyName "$($MetadataTemplateField.$HeaderFieldName)" -NotePropertyValue $null;
                }
            }

            #Append Object Info values: Name, Object Id, Type
            $MetadataValue | Add-Member -NotePropertyName "Name" -NotePropertyValue $Item.name;
            $MetadataValue | Add-Member -NotePropertyName "Object Id" -NotePropertyValue $Item.id;
            $MetadataValue | Add-Member -NotePropertyName "Type" -NotePropertyValue $Item.type;

            #Export metadata values to separate csv's according to metadata template keys
            $MetadataValue | Export-Csv -Path ./MetadataTemplate_$Templatekey`.csv -Append -Force -NoTypeInformation
            Write-Log "Metadata saved to: MetadataTemplate_$Templatekey.csv" -output true -color Green
        }
    }
}

# Start function
Function Start-Script {
    try {
        $AnalyticsClientManager = [AnalyticsClientManager]::new($( Get-Script-Name ).ToLower())
        $AnalyticsClientManager.SetScriptAnalyticsClient()

        Start-Metadata-Extraction
    }
    finally {
        $AnalyticsClientManager.UnsetScriptAnalyticsClients()
    }
}

Start-Script
