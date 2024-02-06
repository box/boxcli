# Extract metadata

Extracts metadata details for all the files and folders in any Box folder and save that report as a CSV spreadsheet for each metadata template.

## Setup Pre-Requisites
1. Clone this github repo or download files from the `/examples` directory
   ```bash
   git clone https://github.com/box/boxcli.git
   ```
2. Install PowerShell or .Net core.
   > If you encounter issues make sure you install both dotnet core and PowerShell
	1. For MacOS & Linux, Install the latest version of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2).
	2. For Windows, Install the latest version of [dotnet core](https://dotnet.microsoft.com/download).

3. Test PowerShell by running the `pwsh` command in your terminal.
    ```bash
    pwsh
    ```

    ```
    mikechen@mbp create-users-automation % pwsh
    PowerShell 7.2.1
    Copyright (c) Microsoft Corporation.
	
    https://aka.ms/powershell
    Type 'help' to get help.
	
    PS /Users/mikechen>
    ```
4. Create an OAuth Application following the [CLI Setup Quick Start][oauth-guide].

## 1. Script Parameters
1. Set the [folderID][folderID-param] you want the script to scan for metadata details.
2. Optional: To run the script as another user, set [userId][UserId-param] parameter.
3. Optional: Use the [-UseDisplayName][UseDisplayName-param] switch when running the script to ensure that the headers of the resulting file correspond to the `displayName` field instead of the `key` in the metadata template.


## 2. Run the script

Change the directory to the folder containing the script. In this example, it is the `Metadata Extraction` folder.
```pwsh
rvb@lab:~/box-cli/examples/Metadata Extraction$ pwsh
PowerShell 7.2.4
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS /home/rvb/box-cli/examples/Metadata Extraction>
```

Run the script:
```pwsh
./Metadata-extraction.ps1 -folderId 173961139760 -userId 20718545815
```
If you don't specify parameters, the script will prompt you to enter it.

When the script run is completed, you will see the following
output or a similar one.

```
Pulling data from Folder ID: 173961139760
Extracting metadata as user ID: 20718545815
Reading Item ID: 1016853559790
Metadata saved to: MetadataTemplate_properties.csv
```

## Logging
Logs are stored in a `logs` folder located in the main folder. You have access to these log files:

* `Metadata-extraction_all.txt` that contains all log entries.
* `Metadata-extraction_errors.txt` that contains only errors.

## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk and as a source of example how to use Box CLI.

[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
[FolderID-param]: /examples/Metadata%20Extraction/Metadata-extraction.ps1#L11
[UserID-param]: /examples/Metadata%20Extraction/Metadata-extraction.ps1#L14
[UseDisplayName-param]: /examples/Metadata%20Extraction/Metadata-extraction.ps1#L17
