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

$script:OnboardingFolderId = $null
$script:UserId = $null 

# Main function
Function Start{
    Write-Output "Starting User Creation & Provisioning script..."

    Try {
        # Get employees json file and convert from CSV to an array of objects
        $Employees = Import-Csv $EmployeeList
        Write-Output $Employees

    }
    Catch {
        Write-Error "Failed to load mock employee data"
        break
    }

    #Create Folder Structure from JSON
    Create-Folder-Structure

    #OR directly upload Folder structure to current user's root folder from local directory
    #$script:OnboardingFolderId = box folders:upload $LocalUploadPath --id-only
    #Write-Output "Uploaded local folder structre to current user's root folder with $($script:OnboardingFolderId)"

    #Create Managed User & Provision Onboarding Folder
    Create-Provision-Managed-User
}

Function Create-Folder-Structure{

    #Extract folder structure from json
    Write-Output "Extracting folder structure"
    $FolderStructure = Get-Content -Raw -Path $FolderStructureJSONPath | ConvertFrom-Json

    #Get current user id
    $User = box users:get --json | ConvertFrom-Json
    $script:UserId = $User.id
    Write-Output "Found current User ID: $($UserId)"
    
    #First create Onboarding folder owned by current user
    $script:OnboardingFolderId = box folders:create 0 "Onboarding" --id-only 
    Write-Output "Created a user owned Onboarding folder with id: $($OnboardingFolderId)"

    #Create folder structure owned by current user
    ForEach($subfolder in $FolderStructure){
        $SubFolderId = box folders:create $OnboardingFolderId $subfolder.name --id-only 
        Write-Output "Created subfolder $($subfolder.name) under Onboarding folder with id: $($SubFolderId)"

        #Continue creating subfolders if object has children
        While ($subfolder.children){
            $child = $subfolder.children
            #Write-Output "Child folder: $($child)"
            $SubFolderID = box folders:create $SubFolderId $child.name --id-only 
            Write-Output "Created subfolder under $($child.name) folder with id: $($SubFolderId)"
            $subfolder = $child.children
        }
    }
}

Function Create-Provision-Managed-User{
    ForEach($Employee in $Employees){
        Write-Output "Creating employee Managed User account with first name: $($Employee.firstName), last name: $($Employee.lastName), email: $($Employee.email), and $($Employee.employeeNumber)"
        
        Try{
            #Create Managed User
            $ManagedUserID = box users:create "$($Employee.firstName) $($Employee.lastName)" $Employee.email --id-only
            Write-Output $ManagedUserID.StatusCode
            Write-Output "Created Managed user with id: $($ManagedUserID)"

            #Collaborate New Managed User to Folder Structure owned by current user
            box folders:collaborations:add $script:OnboardingFolderId --role=viewer_uploader --user-id=$ManagedUserID
            Write-Output "Collaborated Managed User $($Employee.firstName) $($Employee.lastName) to current user's Onboarding folder for provisioning"
        }
        Catch {
            Write-Error "Failed to create Managed User"
            break
        }
    }
}

Start