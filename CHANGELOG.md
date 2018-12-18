# Changelog

## 2.0.1 (Upcoming)

- Fixed an issue where the `--fields` flag was not always requesting additional fields from the API

## 2.0.0

### Features and Enhancements
- __Full API parity:__ The new version of the CLI supports all available API endpoints and parameters
- __Recursive folder upload and download:__ Uploading or downloading a folder now preserves the entire deep folder
  structure
- __Expanded human-readable output:__ All object fields returned by the API are now displayed by default, and can be
  controlled with `--fields`.  All commands that output collections of objects no longer require interactive key presses
  to view all objects.
- __More output options for bulk commands:__ Bulk commands no longer require output to be written to disk, and can
  output JSON, CSV, or human-readable output directly to stdout or to any file.
- __More flexible date/time input:__ Date-times can now be specified in UNIX epoch format (e.g. `1535336043`), with a
  year offset shorthand (e.g. `-1y` for "one year ago"), and as a combination of offset shorthands (e.g. `-5h30m` for
  "5 minutes and 30 seconds ago")
- __All commands now accept bulk input:__ Every command can now accept its arguments and flags from a file input in
  either CSV or JSON format!  There is also no more need for CSV templates, since the column names are the same as the
  CLI's own args and flags (case-insensitive).  Looking at the help for a command should tell you everything you need
  to know to run the command in bulk
- __All commands can now save output to disk:__ Every command now allows passing the `--save` and `--save-to-file-path`
  flags to save the output to disk.  The output written will respect the `--json` and `--csv` flags for specifying
  output format, otherwise it will use the file format in the CLI settings.
- __Custom API calls:__ The new `box request` command allows making any API call against the Box API, and can be used
  to pass arbitrary URLs and parameters
- __Per-environment token caching enabled by default:__ To improve performance when running multiple commands, each
  environment now caches the primary Service Account tokens by default.  This can be disabled by running
  `box configure:environments:update --no-cache-tokens`
- __Command correction and autocomplete:__ If you mis-type a command, you will now be prompted if there is an available
  correction; selecting "yes" at the prompt will run the corrected command for you.  There is also now a
  `box autocomplete` command, which will help you set up autocompletion (currently available only in bash and zsh
  shells)
- __User-friendly prompts:__ Some commands (e.g. `box configure:environments:select`) can now be called without
  providing the necessary arguments; in this case, the command will display a helpful prompt to allow selecting the
  argument value.
- __Re-organized command hierarchy:__ We've renamed and reorganized many of the commands in the CLI to clarify the
  inputs they take and reduce unnecessary subcommand nesting.  In some cases, this drastically reduces the length of
  the command.  For example, `box files:shared-links:create` is now `box files:share` — 14 characters shorter!  Most
  commands that were previously available as `xyzs:list` are now just `xyzs`; for example,
  `box folders collaborations list` is now `box folders:collaborations`
- __Download commands can download to a specified location on disk:__ Pass the `--destination` flag to have the files or
  folders download to any location

### Breaking Changes

- The `box files:metadata:*`, `box folders:metadata:*`, and `box metadata-templates:*` command interfaces have changed;
  please run the commands with `--help` for more details
- All `box sessions` commands have been removed; use `box configure:environments:switch-user [USER_ID]` to switch
  between users.
- All `box configure settings` subcommands have been removed; these settings can be set by passing the appropriate
  flag(s) to `box configure:settings`
- `box files shared-links get [fileID]` is replaced by `box files:get [fileID] --fields=shared_link`
  (output format differs)
- `box folders shared-links get [folderID]` is replaced by `box folders:get [folderID] --fields=shared_link`
  (output format differs)
- `box folders change-upload-email [folderID] [access]` is replaced by
  `box folders:update [folderID] --upload-email-access=[access]` (output format differs)
- `box storage-policies assignments add [userID] [policyID]` is replaced by
  `box storage-policies:assign [policyID] [userID]` (same functionality, may make more API calls)
- `box storage-policies assignments update [assignmentID] [policyID]` is deprecated in favor of
  `box storage-policies:assign [policyID] [userID]`
- `box users change-primary-email [userID] [email]` is replaced by `box users:update [userID] --login=[email]`
  (output format differs)
- The `--list-members flag` has been removed from the `box groups:membership:list` command; this is now the default
  behavior of the command and does not need to be specified via flag.
- The `--list-groups` flag on `box groups:membership:list` has been removed; this functionality is now found in
  the `box users:groups` command.
- The `--list-collaborations` flag on `box groups:membership:list` has been removed; this functionality is now found
  in the `box groups:collaborations` command.
- Multi-word collaboration roles specified via the `-r|--role` flag in `box collaborations:add` and similar commands
  are now separated by an underscore (e.g `viewer_uploader`) instead of a space.  This should make it easier to work
  with these commands without needing to quote the flag value.
 - The `-y|--yes` flag has been removed from some commands; deletions of users, folders, files, etc will no longer
   prompt to confirm that the item should be deleted.
- The `-m|--multi` flag has been removed from `box files:download` and `box folders:download` since these commands
  now accept bulk input via CSV.
- The `--id-only` flag has been removed from `box folders:move`, since a folder move within a user's account should
  not change the folder ID.
- The `--parent-folder-id` flag has been removed from the `box folders:update` command; users should use
  `box folders:move` instead.
- The `--shared-link-*` flags have been removed from the `box folders:update` command; users should use
  `box folders:share` instead.
- The `--sync-disable` flag on `box users:create` and `box users:update` is now called `--no-sync-enable`
- The `--is-exempt-from-device-limits` flag on `box users:create` and `box users:update` is now called
  `--exempt-from-device-limits`
- The `--not-exempt-from-device-limits` flag on `box users:create` and `box users:update` is now called
  `--no-exempt-from-device-limits`
- The `--is-exempt-login-verification` flag on `box users:create` and `box users:update` is now called
  `--exempt-from-2fa`
- The `--not-exempt-login-verification` flag on `box users:create` and `box users:update` is now called
  `--no-exempt-from-2fa`
- The `--parent-folder` flag on `box files:upload` is now called `--parent-id` for consistency with other commands
- The `box storage-policies:assign` command no longer takes two arguments (a type and ID), and instead now takes
  one argument (the ID) and has a `--type` flag with default value "user" to make the command easier to run for common
  use cases
- The `box webhooks:create` command no longer takes four arguments (target type, target ID, triggers, and URL), but
  instead now takes two arguments (the target type and ID) and has two new flags: `--triggers` and `--address` to make
  it easier to specify without needing to remember the argument order
- The `--limit` flag on `box users:list` and `box collaborations:list-for-group` has been removed; all results will
  be returned by default
- The short code for the `box users:create --status` flag was changed from `-s` to `-S` to disambiguate from the
  global `--save` flag
- The short code for the `box webhooks:update --triggers` flag was changed from `-t` to `-T` to disambiguate from
  the global `--token` flag
- The bulk input file format for `box collaborations:add` has changed; see `--help` for more details

### Bug Fixes
- The `--json` flag in the search command works correctly now
- Windows absolute paths without the drive letter (e.g. `\MyFolder\file.pdf`) now work correctly
- Uploading files over 4 GB in size now works correctly
- Listing the items in a folder with more than 300,000 items should no longer fail with an invalid offset error

## 1.1.1

- Fixed bug preventing removal of a user from an Enterprise and conversion to a free user account.
- Fixed bug that returned incorrect total count when using `box list users -m` to only list managed users.
- Added CreatedAt field to CSV output for events.
- Removed SyncState from CSV for creating folders.
- Enabled setting a description for a folder when creating the folder.

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