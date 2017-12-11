# Changelog

## 1.1.1
- Fixed bug preventing removal of a user from an Enterprise and conversion to a free user account.
- Fixed bug that returned incorrect total count when using `box list users -m` to only list managed users.
- Added CreatedAt field to CSV output for events.

## 1.1.0
- Added new feature on all commands for using an individual token. Add the `--token` option to perform an individual command with the Box CLI using a specific token you provide. The feature is most useful when paired with the Developer Token you can generate through the Box Developer Console. When working with an application you create in the Box Developer Console, you will not need to authorize the application into a Box Enterprise before working with the Developer Token. For example usage: `box users get me --token <token_string>`. Certain commands may fail based on the permissions of the user to which the token you use belongs.
- Fixed a bug preventing `previewer` being used when adding or updating a collaboration.
- Added the following commands: `box collaborations delete`, `box folders collaborations delete`, `box files collaborations delete`.
- Improved error messaging for failure on registering a configuration file and private key file with the Box CLI when creating a new CLI `environment`. 
- Added `--disable-file-path-translation` to the following commands: `box configure environments add`, `box configure environments update-config-file-path`, `box configure environments update-private-key-path`. This option ignores any additional processing on trying to resolve the file paths you provide when creating and updating Box CLI `environments`.
- Fixed visual bug with upload progress tracker.
- Updated Box .Net SDK to v3.3.0.
- Changed Box CLI output to JSON by default with no existing `.box` directory.

## 1.0.2
- Added shared link commands for Create, Get, Update, and Delete. Located as standalone commands under `box shared-links` as well as under `box folders shared-links` and `box files shared-links`.
- Fixed UTF-8 issue obscuring characters when saving CSV reports.
- Added autopaging for events and fixed faulty event Get command.
- Added date options `w` for weeks and `now` when using date options with commands.

## 1.0.1

- Fixed minor bug preventing --name, --description, and --etag options from working on the `box folders update` command
- Added a `box folders rename` command.

## 1.0.0

- Welcome to the Box CLI!