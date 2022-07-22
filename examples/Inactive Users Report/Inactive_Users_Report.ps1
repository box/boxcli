#APP SETUP
#README: This powershell script will create list of users which inactive for more than a specified number of days.

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Manage Enterprise Properties, Manage Users, Generate User Access Tokens

########################################################################################
param (
	# No parameter is required.
)
Set-Alias -Name box -Value './bin/run' # DEBUG
########################################################################################
###   SCRIPT CONFIG - MODIFY THESE FOR YOUR ENVIRONMENT   ##############################
########################################################################################

	
	$ReportName = "InactiveUsers"
	$ReportOutputFile = $ReportName + ".csv"

	# The number of days to look back for inactive users.
	$daysInactive = -1

	# Filter events by type.
	$eventType = "LOGIN,UPLOAD,COPY,MOVE,PREVIEW,DOWNLOAD,EDIT,DELETE,UNDELETE,LOCK,UNLOCK,NEW_USER"

########################################################################################
###   SCRIPT BUSINESS LOGIC - MODIFY ANYTHING BELOW THIS POINT   #######################
########################################################################################

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

# Read the number of days to look back from the user
while ($daysInactive -lt 0) {
	$daysInactive = Read-Host "Enter the number of days to look back for inactive users"
	if ($daysInactive -lt 0) {
		Write-Log "Invalid number of days. Please enter a number greater than 0." -output true -color Red
	}
}
Write-Log "Looking for users inactive for more than $daysInactive day$(If($daysInactive -gt 1) {"s"})." -output true

# Get the current list of users
try {
	$usersObjResp = "$(box users --fields='id,login,name,role,space_used,is_platform_access_only,status' --json 2>&1)"
	$usersObj = $usersObjResp | ConvertFrom-Json
	if (($usersObj.Length -eq 0) -or ($usersObj.total_count -eq 0)) {
		Write-Log "No users found" -output true -color Red
	} else {
		Write-Log "Found $($usersObj.Length) user$(If($usersObj.Length -gt 1) {"s"})" -output true
	}
}
catch {
	Write-Log "Could not get user list" -errorMessage $usersObjResp -output true -color Red
	break
}

# Get the current list of events
try {
	$userEventObjResp = "$(box events --enterprise --limit=500 --created-after=-$($daysInactive)d --event-types=$eventType --fields=source,created_by,event_type --json 2>&1)"
	$userEventObj = $userEventObjResp | ConvertFrom-Json
	if (($userEventObj.Length -eq 0) -or ($userEventObj -eq 0)) {
		Write-Log "No event was found for last $daysInactive days" -output Yellow
	} else {
		Write-Log "Found $($userEventObj.Length) event$(If($userEventObj.Length -gt 1) {"s"}) in last $daysInactive day$(If($daysInactive -gt 1) {"s"})" -output true
	}
}
catch {
	Write-Log "Could not get event list" -errorMessage $userEventObjResp -output true -color Red
	break
}

$totalUsers = $usersObj.Length
$totalAppUser = 0
$totalUserRole = 0
$totalAdminRole = 0
$totalUnknownRole = 0
$activeUsers = @{}

# Create a dictionary of user IDs and count for each role
ForEach($User in $usersObj) {
	if ($User.is_platform_access_only -eq $true) {
		$totalAppUser++
	}
	if (($User.role -eq "admin") -or ($User.role -eq "coadmin")) {
		$totalAdminRole += 1
	} elseif ($User.role -eq "user") {
		$totalUserRole += 1
		if ($User.is_platform_access_only -eq $false) {
			$activeUsers.Add($User.id, $false)
		}
	} else {
		$totalUnknownRole += 1
	}
}
$totalRegularUser = $totalUsers - $totalAppUser
$totalUserToCheck = $activeUsers.Count
Write-Log "Enterprise has $($totalAppUser) App user$(If($totalAppUser -gt 1) {"s"}), $($totalRegularUser) regular user$(If($totalRegularUser -gt 1) {"s"}). With $($totalAdminRole) admin role$(If($totalAdminRole -gt 1) {"s"}), $($totalUserRole) user role$(If($totalUserRole -gt 1) {"s"})." -output true
Write-Log "Need to check $($totalUserToCheck) user$(If($totalUserToCheck -gt 1) {"s"}) (regular user, with user role) for inactive." -output true

# Perform the check
ForEach($Event in $userEventObj) {
	# Check if user have just created
	if ($Event.event_type -eq "NEW_USER") {
		if ($activeUsers.ContainsKey($Event.source.id)) {
			$activeUsers[$Event.source.id] = $true
		}
	}
	
	# Mark user as active if they have event recently
	if ($activeUsers.ContainsKey($Event.created_by.id)) {
		$activeUsers[$Event.created_by.id] = $true
	}
}

$totalInactiveUser = 0
# Write the output to a file
New-Item $ReportOutputFile -Value "`"name`",`"email`",`"id`",`"role`",`"status`",`"space_used`"`r`n" -ItemType File -Force > $null
ForEach($User in $usersObj) {
	if ($activeUsers.ContainsKey($User.id) -and $activeUsers[$User.id] -eq $false) {
		$totalInactiveUser += 1
		Add-Content -Path $ReportOutputFile -Value "`"$($User.name)`",`"$($User.login)`",`"$($User.id)`",`"$($User.role)`",`"$($User.status)`",`"$($User.space_used)`""
	}
}
Write-Log "Found $($totalInactiveUser) user$(If($totalInactiveUser -gt 1) {"s"}) inactive for more than $($daysInactive) day$(If($daysInactive -gt 1) {"s"})." -output true
Write-Log "Report is available at $ReportOutputFile" -output true



########################################################################################
###   END SCRIPT   #####################################################################
########################################################################################
