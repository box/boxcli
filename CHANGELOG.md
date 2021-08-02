# Changelog

## Next Release

**New Features and Enhancements**

- Add support for copyInstanceOnItemCopy field for metadata templates  ([#239](https://github.com/box/boxcli/pull/239))

## 2.9.0 (2021-02-22)

**New Features and Enhancements**

- Add ability to add an option to a metadata template multi select field ([#230](https://github.com/box/boxcli/pull/230))
- Add folder lock functionality ([#232](https://github.com/box/boxcli/pull/232))
- Add support for search param to get shared link items ([#233](https://github.com/box/boxcli/pull/233))

**Bug Fixes:**

- Fix events command bug when there is no stream position flag ([#234](https://github.com/box/boxcli/pull/234))

## 2.8.0 (2020-12-03)

**Warning:**

- Due to the changes in ([#217](https://github.com/box/boxcli/pull/217)), additional details about Box Items may now be returned for some commands.

**New Features and Enhancements:**

- Output contents of array for bulk commands ([#217](https://github.com/box/boxcli/pull/217))

**Bug Fixes:**

- Fix bug with setting proxy settings ([#218](https://github.com/box/boxcli/pull/218))

## 2.7.0 (2020-11-02)

**New Features and Enhancements:**

- Make commands `collaborations:add`, `shared-links:update`, `shared-links:delete`, `users:search` that were previously hidden, now available ([#211](https://github.com/box/boxcli/pull/211))
- Add `filter_term` parameter to `groups:list` ([#210](https://github.com/box/boxcli/pull/210))

**Bug Fixes:**

- Fix bug with setting proxy settings ([#213](https://github.com/box/boxcli/pull/213))

## 2.6.0 [2020-08-20]

- Fix filename issue when saving reports on Windows
- Add proxy support for `http`, `https`, `socks` and `pac` protocols. Proxy settings can be found under `box configure:settings`
- Add zip functionality

## 2.5.1 [2020-04-14]

- Added `--quiet` flag to suppress any non-error output to stderr
- Fixed a bug for the `--restrict-collaboration` flag for `box folders:update` where previously the flag would not restrict the collaborations when passed as true and would restrict collaborations when passed as false
- Added `box trash:restore` to restore a trashed item and `box trash:get` to get information on a trashed item
- Fixed a bug where flags that can be specified multiple times in a single command could not be passed through the command line for bulk commands
- **Note**: Skipped version 2.5.0 due to development of new release process

## 2.4.0 [2019-08-29]

- Fixed an issue where the CSV formatting of commands that return multiple different object types (e.g
  `box files:metadata:list` and `box search`) would only include the columns from the first object in the result set.
  These commands now output the full set of columns across all objects in the result set.
- Added a success message to `box collaborations:update` when setting `--role=owner`; previously the command would
  output `undefined`.
- Added support for setting external App User IDs in the `box users:create` and `box users:update` commands with
  the `--external-id` flag

## 2.3.0 [2019-05-23]

- Added `--confirm` flag to the `box users:email-aliases:add` command to automatically confirm the email alias
- Added `--restrict-to-enterprise` flag to the `box folders:update` command to restrict collaboration on the folder
  to the owner's enterprise
- Fixed a bug in the `box folders:update` command where the `--upload-email-access` flag would not correctly set
  the folder upload email access level

## 2.2.0 [2019-04-30]

- Added `--sort` and `--direction` flags to `box search` to control the sort order of the search results
- Fixed `box collections:add` to work correctly with `web_link` items
- Fixed an issue where some commands including `box folders:collaborations:add` could incorrectly interpret bulk
  input entries and produce unintended API requests
- Added `box folders:metadata:set` and `box files:metadata:set` commands to apply metadata keys and values, overwriting
  existing metadata under those keys
- Errors encountered during bulk input are now caught within the CLI, skipping that entry and continuing bulk input.
  The CLI should now run all bulk input entries to completion and report entries that produced errors after all entries
  have been processed.

## 2.1.0 [2019-03-28]

- Fixed an issue where the `--fields` flag was not always requesting additional fields from the API
- Fixed the `--event-types` flag for the `box events` and `box events:poll` commands
- Updated to`lodash@4.17.11` to address a potential prototype pollution vulnerability
- Fixed paging in both the `box events` and `box events:poll` commands:
    - The `box events` command now requires either a closed date range (defaults to last five days), or a stream
      position.  If given a date range, all events in that range will be returned.  If given a stream position,
      up to `limit` events will be returned along with the next stream position
    - `box events:poll` now correctly polls for new events

## 2.0.0 [2018-12-13]

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
