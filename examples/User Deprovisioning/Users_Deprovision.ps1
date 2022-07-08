#APP SETUP
#README: This powershell script will use the Box CLI to deprovision a list of users by first checking if the user has content, transfering user content to another user (default: no), then deleting that user. 

#APPLICATION ACCESS LEVEL (FOR JWT APPS): App + Enterprise Access
#APPLICATION SCOPES: Read & Write all folders stored in Box, Manage users, & Make API calls using the as-user header

#############################################################################

#Set Employee List CSV Path
$EmployeeList = "./Employees_5.csv"

#Transfer user content - default "no"
$TransferContent = "Y"

#############################################################################

$EmployeeArchiveFolderID =$null


# Main function
Function Start{
    Write-Output "Starting User Deprovisioning script..."

    #Get current user id
    $User = box users:get --json | ConvertFrom-Json
    $UserId = $User.id

    #Create a Employee Archive folder in User's Root directory if one does not already exist
    $RootFolder = box folders:items 0 --sort=name --direction=ASC --json | ConvertFrom-Json
    ForEach($Result in $RootFolder){
        if( $Result.name -eq "Employee Archive"){
            $EmployeeArchiveFolderID = $Result.id
            Write-Output "Employee Archive folder already exists with folder ID: $($EmployeeArchiveFolderID)"
        }
    }
    if($EmployeeArchiveFolderID -eq $null){
        $EmployeeArchiveFolderID = box folders:create 0 "Employee Archive" --id-only
        Write-Output "Created new Employee Archive root folder with ID: $($EmployeeArchiveFolderID)"
    }
    
    Try {
        # Get employees json file and convert from CSV to an array of objects
        $Employees = Import-Csv $EmployeeList
        Write-Output $Employees

    }
    Catch {
        Write-Error "Failed to load mock employee data"
        break
    }


    ForEach($Employee in $Employees){
        #search for employee ID
        $EmployeeName = box users:search $Employee.name --json | ConvertFrom-Json
        $EmployeeID = $EmployeeName.id
        Write-Output "Found Employee $($EmployeeName.name) with User ID: $($EmployeeID)"

        if($TransferContent -eq "Y"){
            #transfer user content to current user's root folder
            Write-Output "Transfering $($EmployeeName.name) content over to current user's Root folder with name ""$($EmployeeName.email) - $($EmployeeName.name)'s Files and Folders"""
            $NewFolder = box users:transfer-content $EmployeeID $UserId --json | ConvertFrom-Json

            #Move folder to Employee Archive folder
            $TransferredFolder = $NewFolder.id
            box folders:move $TransferredFolder $EmployeeArchiveFolderID
            Write-Output "Transfered employee content $($EmployeeName.name) with User ID: $($EmployeeID) to Employee Archive Folder"
        }
        #Delete user
        box users:delete $EmployeeID 
        Write-Output "Deleted employee $($EmployeeName.name)"
    }


    #Transfer user's content. Check if user has content or not


    #Delete User

    #Check if Archieve folder exists under Admin account, if not - create. Move user's content to archieve

    #Root (Archive) -> child (user_name_id)


}

Start