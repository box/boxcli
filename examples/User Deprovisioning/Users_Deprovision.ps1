#APP SETUP
#README: This powershell script will use the Box CLI to deprovision a list of users by first transfering user content to the current admin user's root folder (Transfer content default: "Y") before deleting that user. 

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

#############################################################################

#Set Employee List CSV Path
$EmployeeList = "./Employees_to_delete.csv"

#Transfer user content before deletion - "Y" or "N"
$TransferContent = "Y"

#############################################################################

$EmployeeArchiveFolderID =$null

#TODO: Dynamic Employee Archive folder


# Main function
Function Start{
    Write-Output "Starting User Deprovisioning script..."

    Try {
        # Get employees json file and convert from CSV to an array of objects
        $Employees = Import-Csv $EmployeeList
        Write-Output "Importing csv of users to deprovision"
        Write-Output $Employees

    }
    Catch {
        Write-Error "Failed to load mock employee data"
        break
    }

    #Get current user id
    $User = box users:get --json | ConvertFrom-Json
    $UserId = $User.id

    #Create a "Employee Archive" folder in User's Root directory if one does not already exist
    #List root folder contents
    $RootFolder = box folders:items 0 --sort=name --direction=ASC --json | ConvertFrom-Json
    ForEach($Result in $RootFolder){
        #Check if "Employee Archive" folder already exists
        if( $Result.name -eq "Employee Archive"){
            $EmployeeArchiveFolderID = $Result.id
            Write-Output "Employee Archive folder already exists with folder ID: $($EmployeeArchiveFolderID)"
        }
    }
    if($EmployeeArchiveFolderID -eq $null){
        #Create new "Employee Archive" folder if it doens't exist
        $EmployeeArchiveFolderID = box folders:create 0 "Employee Archive" --id-only
        Write-Output "Created new Employee Archive root folder with ID: $($EmployeeArchiveFolderID)"
    }

    ForEach($Employee in $Employees){
        #search for employee ID
        $EmployeeName = box users:search $Employee.name --json | ConvertFrom-Json
        $EmployeeID = $EmployeeName.id
        Write-Output "Found Employee $($EmployeeName.name) with User ID: $($EmployeeID)"

        if($TransferContent -eq "Y"){
            #Transfer users content to current user's root folder before deleting user
            Write-Output "Transfering $($EmployeeName.name) content over to current user's Root folder with name ""$($EmployeeName.email) - $($EmployeeName.name)'s Files and Folders"""
            $NewFolder = box users:transfer-content $EmployeeID $UserId --json | ConvertFrom-Json

            #Move transferred folder to "Employee Archive" folder
            $TransferredFolder = $NewFolder.id
            box folders:move $TransferredFolder $EmployeeArchiveFolderID
            Write-Output "Transfered employee content $($EmployeeName.name) with User ID: $($EmployeeID) to Employee Archive Folder"
        }
        #Delete user
        box users:delete $EmployeeID 
        Write-Output "Deleted employee $($EmployeeName.name)"
    }
}

Start
