Box CLI
=======

[![Project Status](http://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)

A command line interface to the [Box Content API](https://developers.box.com/docs/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
- [Usage](#usage)
- [Command Topics](#command-topics)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Getting Started
---------------

To get started with the Box CLI, first set up a Box application using Server Authentication with JWT and
download the JSON configuration file from the Configuration page of your app in the
[Box Developer Console][dev-console].  Then, set up the CLI by pointing it to your configuration file:

```sh-session
$ box configure:environments:add PATH_TO_CONFIG_FILE
Successfully added CLI environment "default"
```

If you manually generated your own private key to use with JWT authentication, you will need to point the CLI to the
location of your private key file:

```sh-session
$ box configure:environments:add PATH_TO_CONFIG_FILE --private-key-path PATH_TO_PRIVATE_KEY --name ManualKey
Successfully added CLI environment "ManualKey"
```

[dev-console]: https://app.box.com/developers/console

Usage
-----

```sh-session
$ box --version
box-cli/0.0.0 darwin-x64 node-v10.10.0
$ box users:get --help
Get information about a Box user

USAGE
  $ box users:get [ID]

ARGUMENTS
  ID  [default: me] ID of the user to get; defaults to the current user

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
$ box users:get
Type: user
ID: '77777'
Name: Example User
Login: user@example.com
Created At: '2016-12-07T17:30:40-08:00'
Modified At: '2018-11-15T17:33:06-08:00'
Language: en
Timezone: America/Los_Angeles
Space Amount: 10737418240
Space Used: 53569393
Max Upload Size: 5368709120
Status: active
Job Title: ''
Phone: ''
Address: ''
Avatar URL: 'https://app.box.com/api/avatar/large/77777'
```

Command Topics
--------------

<!-- commands -->
* [`box autocomplete [SHELL]`](#box-autocomplete-shell)
* [`box collaboration-whitelist`](#box-collaboration-whitelist)
* [`box collaboration-whitelist:add DOMAIN`](#box-collaboration-whitelistadd-domain)
* [`box collaboration-whitelist:delete ID`](#box-collaboration-whitelistdelete-id)
* [`box collaboration-whitelist:exemptions`](#box-collaboration-whitelistexemptions)
* [`box collaboration-whitelist:exemptions:create USERID`](#box-collaboration-whitelistexemptionscreate-userid)
* [`box collaboration-whitelist:exemptions:delete ID`](#box-collaboration-whitelistexemptionsdelete-id)
* [`box collaboration-whitelist:exemptions:get ID`](#box-collaboration-whitelistexemptionsget-id)
* [`box collaboration-whitelist:get ID`](#box-collaboration-whitelistget-id)
* [`box collaborations:delete ID`](#box-collaborationsdelete-id)
* [`box collaborations:get ID`](#box-collaborationsget-id)
* [`box collaborations:pending`](#box-collaborationspending)
* [`box collaborations:update ID`](#box-collaborationsupdate-id)
* [`box collections`](#box-collections)
* [`box collections:add ITEMTYPE ITEMID COLLECTIONID`](#box-collectionsadd-itemtype-itemid-collectionid)
* [`box collections:items ID`](#box-collectionsitems-id)
* [`box collections:remove ITEMTYPE ITEMID COLLECTIONID`](#box-collectionsremove-itemtype-itemid-collectionid)
* [`box comments:create FILEID`](#box-commentscreate-fileid)
* [`box comments:delete ID`](#box-commentsdelete-id)
* [`box comments:get ID`](#box-commentsget-id)
* [`box comments:reply ID`](#box-commentsreply-id)
* [`box comments:update ID`](#box-commentsupdate-id)
* [`box configure:environments:add PATH`](#box-configureenvironmentsadd-path)
* [`box configure:environments:delete [NAME]`](#box-configureenvironmentsdelete-name)
* [`box configure:environments:get`](#box-configureenvironmentsget)
* [`box configure:environments:set-current [NAME]`](#box-configureenvironmentsset-current-name)
* [`box configure:environments:switch-user [USERID]`](#box-configureenvironmentsswitch-user-userid)
* [`box configure:environments:update [NAME]`](#box-configureenvironmentsupdate-name)
* [`box configure:settings`](#box-configuresettings)
* [`box device-pins`](#box-device-pins)
* [`box device-pins:delete ID`](#box-device-pinsdelete-id)
* [`box device-pins:get ID`](#box-device-pinsget-id)
* [`box events`](#box-events)
* [`box events:poll`](#box-eventspoll)
* [`box files:collaborations ID`](#box-filescollaborations-id)
* [`box files:collaborations:add ID`](#box-filescollaborationsadd-id)
* [`box files:comments ID`](#box-filescomments-id)
* [`box files:copy ID PARENTID`](#box-filescopy-id-parentid)
* [`box files:delete ID`](#box-filesdelete-id)
* [`box files:download ID`](#box-filesdownload-id)
* [`box files:get ID`](#box-filesget-id)
* [`box files:lock ID`](#box-fileslock-id)
* [`box files:metadata ID`](#box-filesmetadata-id)
* [`box files:metadata:add ID`](#box-filesmetadataadd-id)
* [`box files:metadata:get ID`](#box-filesmetadataget-id)
* [`box files:metadata:remove ID`](#box-filesmetadataremove-id)
* [`box files:metadata:update ID`](#box-filesmetadataupdate-id)
* [`box files:move ID PARENTID`](#box-filesmove-id-parentid)
* [`box files:rename ID NAME`](#box-filesrename-id-name)
* [`box files:share ID`](#box-filesshare-id)
* [`box files:tasks ID`](#box-filestasks-id)
* [`box files:unlock ID`](#box-filesunlock-id)
* [`box files:unshare ID`](#box-filesunshare-id)
* [`box files:update ID`](#box-filesupdate-id)
* [`box files:upload PATH`](#box-filesupload-path)
* [`box files:versions FILEID`](#box-filesversions-fileid)
* [`box files:versions:delete FILEID FILEVERSIONID`](#box-filesversionsdelete-fileid-fileversionid)
* [`box files:versions:download FILEID FILEVERSIONID`](#box-filesversionsdownload-fileid-fileversionid)
* [`box files:versions:promote FILEID FILEVERSIONID`](#box-filesversionspromote-fileid-fileversionid)
* [`box files:versions:upload FILEID PATH`](#box-filesversionsupload-fileid-path)
* [`box folders:collaborations ID`](#box-folderscollaborations-id)
* [`box folders:collaborations:add ID`](#box-folderscollaborationsadd-id)
* [`box folders:copy ID PARENTID`](#box-folderscopy-id-parentid)
* [`box folders:create PARENTID NAME`](#box-folderscreate-parentid-name)
* [`box folders:delete ID`](#box-foldersdelete-id)
* [`box folders:download ID`](#box-foldersdownload-id)
* [`box folders:get ID`](#box-foldersget-id)
* [`box folders:items ID`](#box-foldersitems-id)
* [`box folders:metadata ID`](#box-foldersmetadata-id)
* [`box folders:metadata:add ID`](#box-foldersmetadataadd-id)
* [`box folders:metadata:get ID`](#box-foldersmetadataget-id)
* [`box folders:metadata:remove ID`](#box-foldersmetadataremove-id)
* [`box folders:metadata:update ID`](#box-foldersmetadataupdate-id)
* [`box folders:move ID PARENTID`](#box-foldersmove-id-parentid)
* [`box folders:rename ID NAME`](#box-foldersrename-id-name)
* [`box folders:share ID`](#box-foldersshare-id)
* [`box folders:unshare ID`](#box-foldersunshare-id)
* [`box folders:update ID`](#box-foldersupdate-id)
* [`box folders:upload PATH`](#box-foldersupload-path)
* [`box groups`](#box-groups)
* [`box groups:collaborations ID`](#box-groupscollaborations-id)
* [`box groups:create NAME`](#box-groupscreate-name)
* [`box groups:delete ID`](#box-groupsdelete-id)
* [`box groups:get ID`](#box-groupsget-id)
* [`box groups:memberships ID`](#box-groupsmemberships-id)
* [`box groups:memberships:add USERID GROUPID`](#box-groupsmembershipsadd-userid-groupid)
* [`box groups:memberships:get ID`](#box-groupsmembershipsget-id)
* [`box groups:memberships:remove ID`](#box-groupsmembershipsremove-id)
* [`box groups:memberships:update ID`](#box-groupsmembershipsupdate-id)
* [`box groups:update ID`](#box-groupsupdate-id)
* [`box help [COMMAND]`](#box-help-command)
* [`box legal-hold-policies`](#box-legal-hold-policies)
* [`box legal-hold-policies:assign POLICYID`](#box-legal-hold-policiesassign-policyid)
* [`box legal-hold-policies:assignments ID`](#box-legal-hold-policiesassignments-id)
* [`box legal-hold-policies:assignments:delete ID`](#box-legal-hold-policiesassignmentsdelete-id)
* [`box legal-hold-policies:assignments:get ID`](#box-legal-hold-policiesassignmentsget-id)
* [`box legal-hold-policies:create POLICYNAME`](#box-legal-hold-policiescreate-policyname)
* [`box legal-hold-policies:delete ID`](#box-legal-hold-policiesdelete-id)
* [`box legal-hold-policies:file-version-holds ID`](#box-legal-hold-policiesfile-version-holds-id)
* [`box legal-hold-policies:file-version-holds:get ID`](#box-legal-hold-policiesfile-version-holdsget-id)
* [`box legal-hold-policies:get ID`](#box-legal-hold-policiesget-id)
* [`box legal-hold-policies:update ID`](#box-legal-hold-policiesupdate-id)
* [`box metadata-cascade-policies FOLDERID`](#box-metadata-cascade-policies-folderid)
* [`box metadata-cascade-policies:delete ID`](#box-metadata-cascade-policiesdelete-id)
* [`box metadata-cascade-policies:force-apply ID`](#box-metadata-cascade-policiesforce-apply-id)
* [`box metadata-cascade-policies:get ID`](#box-metadata-cascade-policiesget-id)
* [`box metadata-templates`](#box-metadata-templates)
* [`box metadata-templates:cascade TEMPLATEKEY`](#box-metadata-templatescascade-templatekey)
* [`box metadata-templates:create`](#box-metadata-templatescreate)
* [`box metadata-templates:delete TEMPLATEKEY`](#box-metadata-templatesdelete-templatekey)
* [`box metadata-templates:get TEMPLATEKEY`](#box-metadata-templatesget-templatekey)
* [`box metadata-templates:update TEMPLATEKEY`](#box-metadata-templatesupdate-templatekey)
* [`box recent-items`](#box-recent-items)
* [`box request RESOURCE`](#box-request-resource)
* [`box retention-policies`](#box-retention-policies)
* [`box retention-policies:assign POLICYID`](#box-retention-policiesassign-policyid)
* [`box retention-policies:assignments ID`](#box-retention-policiesassignments-id)
* [`box retention-policies:assignments:get ID`](#box-retention-policiesassignmentsget-id)
* [`box retention-policies:create POLICYNAME`](#box-retention-policiescreate-policyname)
* [`box retention-policies:file-version-retentions`](#box-retention-policiesfile-version-retentions)
* [`box retention-policies:file-version-retentions:get ID`](#box-retention-policiesfile-version-retentionsget-id)
* [`box retention-policies:get ID`](#box-retention-policiesget-id)
* [`box retention-policies:update ID`](#box-retention-policiesupdate-id)
* [`box search [QUERY]`](#box-search-query)
* [`box shared-links:get URL`](#box-shared-linksget-url)
* [`box storage-policies`](#box-storage-policies)
* [`box storage-policies:assign STORAGEPOLICYID USERID`](#box-storage-policiesassign-storagepolicyid-userid)
* [`box storage-policies:assignments:get ID`](#box-storage-policiesassignmentsget-id)
* [`box storage-policies:assignments:lookup ID`](#box-storage-policiesassignmentslookup-id)
* [`box storage-policies:assignments:remove ID`](#box-storage-policiesassignmentsremove-id)
* [`box storage-policies:get ID`](#box-storage-policiesget-id)
* [`box tasks:assign TASKID`](#box-tasksassign-taskid)
* [`box tasks:assignments ID`](#box-tasksassignments-id)
* [`box tasks:assignments:delete ID`](#box-tasksassignmentsdelete-id)
* [`box tasks:assignments:get ID`](#box-tasksassignmentsget-id)
* [`box tasks:assignments:update ID`](#box-tasksassignmentsupdate-id)
* [`box tasks:create FILEID`](#box-taskscreate-fileid)
* [`box tasks:delete ID`](#box-tasksdelete-id)
* [`box tasks:get ID`](#box-tasksget-id)
* [`box tasks:update ID`](#box-tasksupdate-id)
* [`box terms-of-service`](#box-terms-of-service)
* [`box terms-of-service:create`](#box-terms-of-servicecreate)
* [`box terms-of-service:get ID`](#box-terms-of-serviceget-id)
* [`box terms-of-service:get-user-status TOSID`](#box-terms-of-serviceget-user-status-tosid)
* [`box terms-of-service:set-user-status ID`](#box-terms-of-serviceset-user-status-id)
* [`box terms-of-service:update ID`](#box-terms-of-serviceupdate-id)
* [`box tokens:exchange SCOPE`](#box-tokensexchange-scope)
* [`box tokens:get`](#box-tokensget)
* [`box tokens:revoke TOKEN`](#box-tokensrevoke-token)
* [`box trash`](#box-trash)
* [`box trash:delete TYPE ID`](#box-trashdelete-type-id)
* [`box users`](#box-users)
* [`box users:create NAME [LOGIN]`](#box-userscreate-name-login)
* [`box users:delete ID`](#box-usersdelete-id)
* [`box users:email-aliases USERID`](#box-usersemail-aliases-userid)
* [`box users:email-aliases:add USERID EMAIL`](#box-usersemail-aliasesadd-userid-email)
* [`box users:email-aliases:remove USERID ALIASID`](#box-usersemail-aliasesremove-userid-aliasid)
* [`box users:get [ID]`](#box-usersget-id)
* [`box users:groups ID`](#box-usersgroups-id)
* [`box users:invite EMAIL ENTERPRISEID`](#box-usersinvite-email-enterpriseid)
* [`box users:transfer-content USERID NEWUSERID`](#box-userstransfer-content-userid-newuserid)
* [`box users:update ID`](#box-usersupdate-id)
* [`box watermarking:apply ITEMTYPE ITEMID`](#box-watermarkingapply-itemtype-itemid)
* [`box watermarking:get ITEMTYPE ITEMID`](#box-watermarkingget-itemtype-itemid)
* [`box watermarking:remove ITEMTYPE ITEMID`](#box-watermarkingremove-itemtype-itemid)
* [`box web-links:create URL`](#box-web-linkscreate-url)
* [`box web-links:delete ID`](#box-web-linksdelete-id)
* [`box web-links:get ID`](#box-web-linksget-id)
* [`box web-links:move ID PARENTID`](#box-web-linksmove-id-parentid)
* [`box web-links:update ID`](#box-web-linksupdate-id)
* [`box webhooks`](#box-webhooks)
* [`box webhooks:create TARGETTYPE TARGETID`](#box-webhookscreate-targettype-targetid)
* [`box webhooks:delete ID`](#box-webhooksdelete-id)
* [`box webhooks:get ID`](#box-webhooksget-id)
* [`box webhooks:update ID`](#box-webhooksupdate-id)

## `box autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ box autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ box autocomplete
  $ box autocomplete bash
  $ box autocomplete zsh
  $ box autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.0/src/commands/autocomplete/index.ts)_

## `box collaboration-whitelist`

List collaboration whitelist entries

```
USAGE
  $ box collaboration-whitelist

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/index.js)_

## `box collaboration-whitelist:add DOMAIN`

Add a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:add DOMAIN

ARGUMENTS
  DOMAIN  Domain to add to whitelist (e.g. box.com)

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --direction=inbound|outbound|both      (required) Direction to whitelist collaboration in
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/add.js)_

## `box collaboration-whitelist:delete ID`

Delete a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:delete ID

ARGUMENTS
  ID  ID of the collaboration whitelist entry record to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/delete.js)_

## `box collaboration-whitelist:exemptions`

List collaboration whitelist exemptions

```
USAGE
  $ box collaboration-whitelist:exemptions

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/exemptions/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/exemptions/index.js)_

## `box collaboration-whitelist:exemptions:create USERID`

Exempt a user from the collaboration whitelist

```
USAGE
  $ box collaboration-whitelist:exemptions:create USERID

ARGUMENTS
  USERID  ID of the user to exempt from the collaboration whitelist

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/exemptions/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/exemptions/create.js)_

## `box collaboration-whitelist:exemptions:delete ID`

Delete a collaboration whitelist exemption

```
USAGE
  $ box collaboration-whitelist:exemptions:delete ID

ARGUMENTS
  ID  ID of the whitelist exemption record to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/exemptions/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/exemptions/delete.js)_

## `box collaboration-whitelist:exemptions:get ID`

Get a collaboration whitelist exemption

```
USAGE
  $ box collaboration-whitelist:exemptions:get ID

ARGUMENTS
  ID  ID of the whitelist exemption record to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/exemptions/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/exemptions/get.js)_

## `box collaboration-whitelist:get ID`

Get a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:get ID

ARGUMENTS
  ID  ID of the collaboration whitelist entry record to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaboration-whitelist/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaboration-whitelist/get.js)_

## `box collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box collaborations:delete ID

ARGUMENTS
  ID  The ID of the collaboration to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:collaborations:delete
  $ box folders:collaborations:delete
```

_See code: [src/commands/collaborations/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaborations/delete.js)_

## `box collaborations:get ID`

Get an individual collaboration

```
USAGE
  $ box collaborations:get ID

ARGUMENTS
  ID  ID of the collaboration to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collaborations/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaborations/get.js)_

## `box collaborations:pending`

List all pending collaborations for a user

```
USAGE
  $ box collaborations:pending

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box collaborations:get-pending
```

_See code: [src/commands/collaborations/pending.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaborations/pending.js)_

## `box collaborations:update ID`

Update a collaboration

```
USAGE
  $ box collaborations:update ID

ARGUMENTS
  ID  The ID of the collaboration to update

OPTIONS
  -h, --help                                                                                     Show CLI help

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner|owner  An option to manually
                                                                                                 enter the role

  -s, --save                                                                                     Save report to default
                                                                                                 reports folder on disk

  -t, --token=token                                                                              Provide a token to
                                                                                                 perform this call

  -v, --verbose                                                                                  Show verbose output,
                                                                                                 which can be helpful
                                                                                                 for debugging

  -y, --yes                                                                                      Automatically respond
                                                                                                 yes to all confirmation
                                                                                                 prompts

  --as-user=as-user                                                                              Provide an ID for a
                                                                                                 user

  --bulk-file-path=bulk-file-path                                                                File path to bulk .csv
                                                                                                 or .json objects

  --[no-]can-view-path                                                                           Whether view path
                                                                                                 collaboration feature
                                                                                                 is enabled or not

  --csv                                                                                          Output formatted CSV

  --expires-at=expires-at                                                                        When the collaboration
                                                                                                 should expire

  --fields=fields                                                                                Comma separated list of
                                                                                                 fields to show

  --json                                                                                         Output formatted JSON

  --no-color                                                                                     Turn off colors for
                                                                                                 logging

  --save-to-file-path=save-to-file-path                                                          Override default file
                                                                                                 path to save report

  --status=accepted|pending|rejected                                                             Update the
                                                                                                 collaboration status

ALIASES
  $ box files:collaborations:update
  $ box folders:collaborations:update
```

_See code: [src/commands/collaborations/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collaborations/update.js)_

## `box collections`

List your collections

```
USAGE
  $ box collections

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box collections:list
```

_See code: [src/commands/collections/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collections/index.js)_

## `box collections:add ITEMTYPE ITEMID COLLECTIONID`

Add an item to a collection

```
USAGE
  $ box collections:add ITEMTYPE ITEMID COLLECTIONID

ARGUMENTS
  ITEMTYPE      (folder|file|web_link) Type of item
  ITEMID        ID of the of item
  COLLECTIONID  ID of collection

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collections/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collections/add.js)_

## `box collections:items ID`

Get items in a collection

```
USAGE
  $ box collections:items ID

ARGUMENTS
  ID  ID of the collection to retrieve the items of

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collections/items.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collections/items.js)_

## `box collections:remove ITEMTYPE ITEMID COLLECTIONID`

Remove an item from a collection

```
USAGE
  $ box collections:remove ITEMTYPE ITEMID COLLECTIONID

ARGUMENTS
  ITEMTYPE      (folder|file) Type of item
  ITEMID        ID of item
  COLLECTIONID  ID of collection

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/collections/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/collections/remove.js)_

## `box comments:create FILEID`

Create a comment on a file

```
USAGE
  $ box comments:create FILEID

ARGUMENTS
  FILEID  ID of file on which to comment

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --message=message                      Message of comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --tagged-message=tagged-message        The text of the comment, including @[userid:Username] somewhere in the message
                                         to mention the user
```

_See code: [src/commands/comments/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/comments/create.js)_

## `box comments:delete ID`

Delete a comment

```
USAGE
  $ box comments:delete ID

ARGUMENTS
  ID  ID of the comment to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/comments/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/comments/delete.js)_

## `box comments:get ID`

Get information about a comment

```
USAGE
  $ box comments:get ID

ARGUMENTS
  ID  ID of the comment to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/comments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/comments/get.js)_

## `box comments:reply ID`

Reply to a comment

```
USAGE
  $ box comments:reply ID

ARGUMENTS
  ID  ID of the comment to reply to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --message=message                      Message of comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --tagged-message=tagged-message        The text of the comment, including @[userid:Username] somewhere in the message
                                         to mention the user
```

_See code: [src/commands/comments/reply.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/comments/reply.js)_

## `box comments:update ID`

Update a comment

```
USAGE
  $ box comments:update ID

ARGUMENTS
  ID  ID of the comment to update

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --message=message                      The text of the comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --tagged-message=tagged-message        The tagged text of the comment
```

_See code: [src/commands/comments/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/comments/update.js)_

## `box configure:environments:add PATH`

Add a new Box environment

```
USAGE
  $ box configure:environments:add PATH

ARGUMENTS
  PATH  Provide a file path to configuration file

OPTIONS
  -h, --help                           Show CLI help
  -n, --name=name                      [default: default] Set a name for the environment
  -v, --verbose                        Show verbose output, which can be helpful for debugging
  --no-color                           Turn off colors for logging
  --private-key-path=private-key-path  Provide a path to application private key
  --set-as-current                     Set this new environment as your current environment
```

_See code: [src/commands/configure/environments/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/add.js)_

## `box configure:environments:delete [NAME]`

Delete a Box environment

```
USAGE
  $ box configure:environments:delete [NAME]

ARGUMENTS
  NAME  Name of the environment

OPTIONS
  -h, --help     Show CLI help
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging
```

_See code: [src/commands/configure/environments/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/delete.js)_

## `box configure:environments:get`

Get a Box environment

```
USAGE
  $ box configure:environments:get

OPTIONS
  -c, --current    Get the current default Box environment
  -h, --help       Show CLI help
  -n, --name=name  Get a Box environment with this name
  -v, --verbose    Show verbose output, which can be helpful for debugging
  --no-color       Turn off colors for logging
```

_See code: [src/commands/configure/environments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/get.js)_

## `box configure:environments:set-current [NAME]`

Set your current Box environment to use

```
USAGE
  $ box configure:environments:set-current [NAME]

ARGUMENTS
  NAME  Name of the environment

OPTIONS
  -h, --help     Show CLI help
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging

ALIASES
  $ box configure:environments:select
```

_See code: [src/commands/configure/environments/set-current.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/set-current.js)_

## `box configure:environments:switch-user [USERID]`

Switch the default Box user to run commands as

```
USAGE
  $ box configure:environments:switch-user [USERID]

ARGUMENTS
  USERID  The user ID to switch to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --default                              Switch to the default user, i.e. the Service Account
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/configure/environments/switch-user.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/switch-user.js)_

## `box configure:environments:update [NAME]`

Update a Box environment

```
USAGE
  $ box configure:environments:update [NAME]

ARGUMENTS
  NAME  The name of the environment

OPTIONS
  -h, --help                           Show CLI help
  -v, --verbose                        Show verbose output, which can be helpful for debugging
  --[no-]cache-tokens                  Enable token caching, which significantly improves performance
  --config-file-path=config-file-path  Provide a file path to configuration file
  --name=name                          New name of the environment
  --no-color                           Turn off colors for logging
  --private-key-path=private-key-path  Provide a file path to application private key

  --user-id=user-id                    Store a default user ID to use with the session commands. A default user ID can
                                       be stored for each Box environment
```

_See code: [src/commands/configure/environments/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/environments/update.js)_

## `box configure:settings`

View and update CLI configuration settings

```
USAGE
  $ box configure:settings

OPTIONS
  -h, --help                                     Show CLI help
  -v, --verbose                                  Show verbose output, which can be helpful for debugging
  --downloads-folder-path=downloads-folder-path  Set folder path for the downloads folder
  --file-format=csv|json|txt                     Set the file format for generated reports
  --no-color                                     Turn off colors for logging
  --[no-]output-json                             Default to JSON output for all commands
  --reports-folder-path=reports-folder-path      Set folder path for the reports folder
```

_See code: [src/commands/configure/settings.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/configure/settings.js)_

## `box device-pins`

List all the device pins for your enterprise

```
USAGE
  $ box device-pins

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --direction=ASC|DESC                   Set sorting (by id) direction. Default is ASC
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/device-pins/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/device-pins/index.js)_

## `box device-pins:delete ID`

Delete individual device pin

```
USAGE
  $ box device-pins:delete ID

ARGUMENTS
  ID  ID of the device pin to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/device-pins/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/device-pins/delete.js)_

## `box device-pins:get ID`

Get information about an individual device pin

```
USAGE
  $ box device-pins:get ID

ARGUMENTS
  ID  ID of the device pin to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/device-pins/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/device-pins/get.js)_

## `box events`

Get events

```
USAGE
  $ box events

OPTIONS
  -e, --enterprise                       Get enterprise events
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --created-after=created-after          Return enterprise events that occured after a time. Use a timestamp or
                                         shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to 5 days
                                         before the end date

  --created-before=created-before        Return enterprise events that occured before a time. Use a timestamp or
                                         shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to now

  --csv                                  Output formatted CSV

  --event-types=event-types              Return enterprise events filtered by event types. Format using a comma
                                         delimited list: NEW_USER,DELETE_USER,EDIT_USER

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --limit=limit                          The maximum number of items to return

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --stream-position=stream-position      The location in the event stream from which you want to start receiving events

ALIASES
  $ box events:get
```

_See code: [src/commands/events/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/events/index.js)_

## `box events:poll`

Poll the event stream

```
USAGE
  $ box events:poll

OPTIONS
  -e, --enterprise                       Get enterprise events
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --end-date=end-date                    Return enterprise events that occured before this time. Use a timestamp or
                                         shorthand syntax 00t, like 05w for 5 weeks.

  --event-types=event-types              Return enterprise events filtered by event types. Format using a comma
                                         delimited list: NEW_USER,DELETE_USER,EDIT_USER

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --polling-interval=polling-interval    Number of seconds to wait before polling for new events. Default is 60 seconds.

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --start-date=start-date                Return enterprise events that occured after this time. Use a timestamp or
                                         shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to now
```

_See code: [src/commands/events/poll.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/events/poll.js)_

## `box files:collaborations ID`

List all collaborations on a file

```
USAGE
  $ box files:collaborations ID

ARGUMENTS
  ID  ID of the file to get collaborations for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:collaborations:list
```

_See code: [src/commands/files/collaborations/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/collaborations/index.js)_

## `box files:collaborations:add ID`

Create a collaboration for a file

```
USAGE
  $ box files:collaborations:add ID

ARGUMENTS
  ID  ID of the file to add a collaboration to

OPTIONS
  -h, --help                                                                               Show CLI help

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner  An option to manually enter
                                                                                           the role

  -s, --save                                                                               Save report to default
                                                                                           reports folder on disk

  -t, --token=token                                                                        Provide a token to perform
                                                                                           this call

  -v, --verbose                                                                            Show verbose output, which
                                                                                           can be helpful for debugging

  -y, --yes                                                                                Automatically respond yes to
                                                                                           all confirmation prompts

  --as-user=as-user                                                                        Provide an ID for a user

  --bulk-file-path=bulk-file-path                                                          File path to bulk .csv or
                                                                                           .json objects

  --[no-]can-view-path                                                                     Whether view path
                                                                                           collaboration feature is
                                                                                           enabled or not

  --csv                                                                                    Output formatted CSV

  --fields=fields                                                                          Comma separated list of
                                                                                           fields to show

  --group-id=group-id                                                                      Id for group to collaborate

  --id-only                                                                                Return only an ID to output
                                                                                           from this command

  --json                                                                                   Output formatted JSON

  --login=login                                                                            Login for user to collaborate

  --no-color                                                                               Turn off colors for logging

  --[no-]notify                                                                            All users will receive email
                                                                                           notification of the
                                                                                           collaboration

  --save-to-file-path=save-to-file-path                                                    Override default file path to
                                                                                           save report

  --user-id=user-id                                                                        Id for user to collaborate
```

_See code: [src/commands/files/collaborations/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/collaborations/add.js)_

## `box files:comments ID`

List all comments on a file

```
USAGE
  $ box files:comments ID

ARGUMENTS
  ID  ID of the file to get comments for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box comments:list
```

_See code: [src/commands/files/comments.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/comments.js)_

## `box files:copy ID PARENTID`

Copy a file to a different folder

```
USAGE
  $ box files:copy ID PARENTID

ARGUMENTS
  ID        ID of the file to copy
  PARENTID  ID of the new parent folder to copy the file into

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --id-only                              Output only the ID of the file copy
  --json                                 Output formatted JSON
  --name=name                            New name for the file
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --version=version                      File version ID if you want to copy a specific file version
```

_See code: [src/commands/files/copy.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/copy.js)_

## `box files:delete ID`

Delete a file

```
USAGE
  $ box files:delete ID

ARGUMENTS
  ID  ID of the file to delete

OPTIONS
  -f, --force                            Permanently delete the item, bypassing the trash
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only delete if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/delete.js)_

## `box files:download ID`

Download a file

```
USAGE
  $ box files:download ID

ARGUMENTS
  ID  ID of the file to download

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --destination=destination              The destination folder to write the file to
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --version=version                      File version ID of the specific file version to download
```

_See code: [src/commands/files/download.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/download.js)_

## `box files:get ID`

Get information about a file

```
USAGE
  $ box files:get ID

ARGUMENTS
  ID  ID of the file to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/get.js)_

## `box files:lock ID`

Lock a file

```
USAGE
  $ box files:lock ID

ARGUMENTS
  ID  ID of file to lock

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --expires=expires                      Make the lock expire from a timespan set from now. Use s for seconds, m for
                                         minutes, h for hours, d for days, w for weeks, M for months. For example, 30
                                         seconds is 30s

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --[no-]prevent-download                Prevent download of locked file

  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:update-lock
```

_See code: [src/commands/files/lock.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/lock.js)_

## `box files:metadata ID`

Get all metadata on a file

```
USAGE
  $ box files:metadata ID

ARGUMENTS
  ID  Id of the file

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:metadata:get-all
```

_See code: [src/commands/files/metadata/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/metadata/index.js)_

## `box files:metadata:add ID`

Add metadata to a file

```
USAGE
  $ box files:metadata:add ID

ARGUMENTS
  ID  ID of the file to add metadata to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "f" on end of digits: key2=1234.50f

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use

ALIASES
  $ box files:metadata:create
```

_See code: [src/commands/files/metadata/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/metadata/add.js)_

## `box files:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box files:metadata:get ID

ARGUMENTS
  ID  ID of the file to get metadata on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to retrieve
  --template-key=template-key            (required) The key of the metadata template to retrieve
```

_See code: [src/commands/files/metadata/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/metadata/get.js)_

## `box files:metadata:remove ID`

Delete metadata from a file

```
USAGE
  $ box files:metadata:remove ID

ARGUMENTS
  ID  ID of the file to remove metadata from

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to remove
  --template-key=template-key            (required) The key of the metadata template to remove

ALIASES
  $ box files:metadata:delete
```

_See code: [src/commands/files/metadata/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/metadata/remove.js)_

## `box files:metadata:update ID`

Update the metadata attached to a file

```
USAGE
  $ box files:metadata:update ID

ARGUMENTS
  ID  ID of the file to update metadata on

OPTIONS
  -a, --add=add                          Add a key to the metadata document; must be in the form key=value

  -c, --copy=copy                        Copy a metadata value to another key; must be in the form
                                         sourceKey>destinationKey

  -h, --help                             Show CLI help

  -m, --move=move                        Move a metadata value from one key to another; must be in the form
                                         sourceKey>destinationKey

  -s, --save                             Save report to default reports folder on disk

  -t, --test=test                        Test that a metadata key contains a specific value; must be in the form
                                         key=value

  -t, --token=token                      Provide a token to perform this call

  -v, --verbose                          Show verbose output, which can be helpful for debugging

  -y, --yes                              Automatically respond yes to all confirmation prompts

  --as-user=as-user                      Provide an ID for a user

  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --csv                                  Output formatted CSV

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --remove=remove                        Remove a key from the metadata document

  --replace=replace                      Replace the value of an existing metadata key; must be in the form key=value

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to update against

  --template-key=template-key            (required) The key of the metadata template to update against
```

_See code: [src/commands/files/metadata/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/metadata/update.js)_

## `box files:move ID PARENTID`

Move a file to a different folder

```
USAGE
  $ box files:move ID PARENTID

ARGUMENTS
  ID        ID of the file to move
  PARENTID  ID of the new parent folder to move the file into

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only move if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/move.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/move.js)_

## `box files:rename ID NAME`

Rename a file

```
USAGE
  $ box files:rename ID NAME

ARGUMENTS
  ID    ID of file to rename
  NAME  New name of file

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              Change the file description
  --etag=etag                            Only rename if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/rename.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/rename.js)_

## `box files:share ID`

Create a shared link for a file

```
USAGE
  $ box files:share ID

ARGUMENTS
  ID  ID of the file to share

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --access=access                        Shared link access level
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-download                    Whether the shared link allows downloads
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --password=password                    Shared link password
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --unshared-at=unshared-at              Time that this link will become disabled. Use s for seconds, m for minutes, h
                                         for hours, d for days, w for weeks, M for months. For example, 30 seconds is
                                         30s from now.

ALIASES
  $ box files:shared-links:create
  $ box files:shared-links:update
```

_See code: [src/commands/files/share.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/share.js)_

## `box files:tasks ID`

List all tasks on this file

```
USAGE
  $ box files:tasks ID

ARGUMENTS
  ID  ID of file on which to retrieve tasks

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:tasks:list
```

_See code: [src/commands/files/tasks/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/tasks/index.js)_

## `box files:unlock ID`

Unlock a file

```
USAGE
  $ box files:unlock ID

ARGUMENTS
  ID  Id of file to unlock

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/unlock.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/unlock.js)_

## `box files:unshare ID`

Delete a shared link for a file

```
USAGE
  $ box files:unshare ID

ARGUMENTS
  ID  ID of the file to unshare

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:shared-links:delete
```

_See code: [src/commands/files/unshare.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/unshare.js)_

## `box files:update ID`

Update a file record

```
USAGE
  $ box files:update ID

ARGUMENTS
  ID  ID of the file to update

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              New description for the file
  --etag=etag                            Only apply updates if the ETag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --name=name                            New name for the file
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --tags=tags                            Set tags on the file, specified as comma-separated tags
```

_See code: [src/commands/files/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/update.js)_

## `box files:upload PATH`

Upload a file

```
USAGE
  $ box files:upload PATH

ARGUMENTS
  PATH  Path to the file to be uploaded

OPTIONS
  -h, --help                                 Show CLI help
  -n, --name=name                            Provide different name for uploaded file

  -p, --parent-id=parent-id                  [default: 0] ID of the parent folder to upload the file to; defaults to the
                                             root folder

  -s, --save                                 Save report to default reports folder on disk

  -t, --token=token                          Provide a token to perform this call

  -v, --verbose                              Show verbose output, which can be helpful for debugging

  -y, --yes                                  Automatically respond yes to all confirmation prompts

  --as-user=as-user                          Provide an ID for a user

  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects

  --content-created-at=content-created-at    The creation date of the file content. Use a timestamp or shorthand syntax
                                             0t, like 5w for 5 weeks

  --content-modified-at=content-modified-at  The modification date of the file content. Use a timestamp or shorthand
                                             syntax 0t, like 5w for 5 weeks

  --csv                                      Output formatted CSV

  --fields=fields                            Comma separated list of fields to show

  --id-only                                  Return only an ID to output from this command

  --json                                     Output formatted JSON

  --no-color                                 Turn off colors for logging

  --save-to-file-path=save-to-file-path      Override default file path to save report
```

_See code: [src/commands/files/upload.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/upload.js)_

## `box files:versions FILEID`

Get a list of file versions

```
USAGE
  $ box files:versions FILEID

ARGUMENTS
  FILEID  ID of file to get versions for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:versions:list
```

_See code: [src/commands/files/versions/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/versions/index.js)_

## `box files:versions:delete FILEID FILEVERSIONID`

Delete a file version

```
USAGE
  $ box files:versions:delete FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only delete if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/versions/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/versions/delete.js)_

## `box files:versions:download FILEID FILEVERSIONID`

Download a specific version of a file

```
USAGE
  $ box files:versions:download FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to download
  FILEVERSIONID  ID of file version to download

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --destination=destination              The destination folder to write the file to
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/versions/download.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/versions/download.js)_

## `box files:versions:promote FILEID FILEVERSIONID`

Promote a file version

```
USAGE
  $ box files:versions:promote FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/files/versions/promote.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/versions/promote.js)_

## `box files:versions:upload FILEID PATH`

Upload a new version of a file

```
USAGE
  $ box files:versions:upload FILEID PATH

ARGUMENTS
  FILEID  ID of the file to upload a new version of
  PATH    Local path to the file to upload

OPTIONS
  -h, --help                                 Show CLI help
  -n, --name=name                            Provide different name for uploaded file
  -s, --save                                 Save report to default reports folder on disk
  -t, --token=token                          Provide a token to perform this call
  -v, --verbose                              Show verbose output, which can be helpful for debugging
  -y, --yes                                  Automatically respond yes to all confirmation prompts
  --as-user=as-user                          Provide an ID for a user
  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects

  --content-modified-at=content-modified-at  The last modification date of the file version. Use a timestamp or
                                             shorthand syntax 0t, like 5w for 5 weeks

  --csv                                      Output formatted CSV

  --fields=fields                            Comma separated list of fields to show

  --json                                     Output formatted JSON

  --no-color                                 Turn off colors for logging

  --save-to-file-path=save-to-file-path      Override default file path to save report
```

_See code: [src/commands/files/versions/upload.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/files/versions/upload.js)_

## `box folders:collaborations ID`

List all collaborations on a folder

```
USAGE
  $ box folders:collaborations ID

ARGUMENTS
  ID  ID of the folder to get the collaborations on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box folders:collaborations:list
```

_See code: [src/commands/folders/collaborations/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/collaborations/index.js)_

## `box folders:collaborations:add ID`

Create a collaboration for a folder

```
USAGE
  $ box folders:collaborations:add ID

ARGUMENTS
  ID  ID of the folder to add a collaboration to

OPTIONS
  -h, --help                                                                               Show CLI help

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner  An option to manually enter
                                                                                           the role

  -s, --save                                                                               Save report to default
                                                                                           reports folder on disk

  -t, --token=token                                                                        Provide a token to perform
                                                                                           this call

  -v, --verbose                                                                            Show verbose output, which
                                                                                           can be helpful for debugging

  -y, --yes                                                                                Automatically respond yes to
                                                                                           all confirmation prompts

  --as-user=as-user                                                                        Provide an ID for a user

  --bulk-file-path=bulk-file-path                                                          File path to bulk .csv or
                                                                                           .json objects

  --[no-]can-view-path                                                                     Whether view path
                                                                                           collaboration feature is
                                                                                           enabled or not

  --csv                                                                                    Output formatted CSV

  --fields=fields                                                                          Comma separated list of
                                                                                           fields to show

  --group-id=group-id                                                                      Id for group to collaborate

  --id-only                                                                                Return only an ID to output
                                                                                           from this command

  --json                                                                                   Output formatted JSON

  --login=login                                                                            Login for user to collaborate

  --no-color                                                                               Turn off colors for logging

  --[no-]notify                                                                            All users will receive email
                                                                                           notification of the
                                                                                           collaboration

  --save-to-file-path=save-to-file-path                                                    Override default file path to
                                                                                           save report

  --user-id=user-id                                                                        Id for user to collaborate
```

_See code: [src/commands/folders/collaborations/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/collaborations/add.js)_

## `box folders:copy ID PARENTID`

Copy a folder to a different folder

```
USAGE
  $ box folders:copy ID PARENTID

ARGUMENTS
  ID        ID of the folder to copy
  PARENTID  ID of the new parent folder to copy the folder into

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --name=name                            An optional new name for the folder
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/copy.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/copy.js)_

## `box folders:create PARENTID NAME`

Create a new folder

```
USAGE
  $ box folders:create PARENTID NAME

ARGUMENTS
  PARENTID  ID of parent folder to add new folder to, use '0' for the root folder
  NAME      Name of new folder

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              A description for folder <DESCRIPTION>
  --fields=fields                        Comma separated list of fields to show
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/create.js)_

## `box folders:delete ID`

Delete a folder

```
USAGE
  $ box folders:delete ID

ARGUMENTS
  ID  ID of the folder to delete

OPTIONS
  -f, --force                            Permanently delete the folder, bypassing the trash
  -h, --help                             Show CLI help
  -r, --recursive                        Delete the folder, even if it still has items in it
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only delete if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/delete.js)_

## `box folders:download ID`

Download a folder

```
USAGE
  $ box folders:download ID

ARGUMENTS
  ID  ID of the folder to download

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --depth=depth                          Number of levels deep to recurse when downloading the folder tree
  --destination=destination              The destination folder to download the Box folder into
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --zip                                  Download the folder into a single .zip archive
```

_See code: [src/commands/folders/download.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/download.js)_

## `box folders:get ID`

Get information about a folder

```
USAGE
  $ box folders:get ID

ARGUMENTS
  ID  ID of folder to get; use 0 for the root folder

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/get.js)_

## `box folders:items ID`

List items in a folder

```
USAGE
  $ box folders:items ID

ARGUMENTS
  ID  ID of the folder to get the items in, use 0 for the root folder

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --direction=ASC|DESC                   The direction to order returned items
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --sort=id|name|date                    The parameter to sort returned items

ALIASES
  $ box folders:list-items
```

_See code: [src/commands/folders/items.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/items.js)_

## `box folders:metadata ID`

Get all metadata on a folder

```
USAGE
  $ box folders:metadata ID

ARGUMENTS
  ID  ID of the folder to get all metadata on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box folders:metadata:get-all
```

_See code: [src/commands/folders/metadata/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/metadata/index.js)_

## `box folders:metadata:add ID`

Add metadata to a folder

```
USAGE
  $ box folders:metadata:add ID

ARGUMENTS
  ID  ID of the folder to add metadata to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "f" on end of digits: key2=1234.50f

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use

ALIASES
  $ box folders:metadata:create
```

_See code: [src/commands/folders/metadata/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/metadata/add.js)_

## `box folders:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box folders:metadata:get ID

ARGUMENTS
  ID  ID of the folder to get metadata on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to retrieve
  --template-key=template-key            (required) The key of the metadata template to retrieve
```

_See code: [src/commands/folders/metadata/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/metadata/get.js)_

## `box folders:metadata:remove ID`

Delete metadata from a folder

```
USAGE
  $ box folders:metadata:remove ID

ARGUMENTS
  ID  ID of the folder to remove metadata from

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to remove
  --template-key=template-key            (required) The key of the metadata template to remove

ALIASES
  $ box folders:metadata:delete
```

_See code: [src/commands/folders/metadata/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/metadata/remove.js)_

## `box folders:metadata:update ID`

Update the metadata attached to a folder

```
USAGE
  $ box folders:metadata:update ID

ARGUMENTS
  ID  ID of the folder to update metadata on

OPTIONS
  -a, --add=add                          Add a key to the metadata document; must be in the form key=value

  -c, --copy=copy                        Copy a metadata value to another key; must be in the form
                                         sourceKey>destinationKey

  -h, --help                             Show CLI help

  -m, --move=move                        Move a metadata value from one key to another; must be in the form
                                         sourceKey>destinationKey

  -s, --save                             Save report to default reports folder on disk

  -t, --test=test                        Test that a metadata key contains a specific value; must be in the form
                                         key=value

  -t, --token=token                      Provide a token to perform this call

  -v, --verbose                          Show verbose output, which can be helpful for debugging

  -y, --yes                              Automatically respond yes to all confirmation prompts

  --as-user=as-user                      Provide an ID for a user

  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --csv                                  Output formatted CSV

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --remove=remove                        Remove a key from the metadata document

  --replace=replace                      Replace the value of an existing metadata key; must be in the form key=value

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to update against

  --template-key=template-key            (required) The key of the metadata template to update against
```

_See code: [src/commands/folders/metadata/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/metadata/update.js)_

## `box folders:move ID PARENTID`

Move a folder to a different folder

```
USAGE
  $ box folders:move ID PARENTID

ARGUMENTS
  ID        ID of folder to copy
  PARENTID  ID of the new parent folder to move the folder into

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only move if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/move.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/move.js)_

## `box folders:rename ID NAME`

Rename a folder

```
USAGE
  $ box folders:rename ID NAME

ARGUMENTS
  ID    ID of the folder to rename
  NAME  New name for the folder

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              Change the folder description
  --etag=etag                            Only rename if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/rename.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/rename.js)_

## `box folders:share ID`

Create a shared link for a folder

```
USAGE
  $ box folders:share ID

ARGUMENTS
  ID  ID of the folder to share

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --access=access                        Shared link access level
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-download                    Whether the shared link allows downloads
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --password=password                    Shared link password
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --unshared-at=unshared-at              Time that this link will become disabled. Use s for seconds, m for minutes, h
                                         for hours, d for days, w for weeks, M for months. For example, 30 seconds is
                                         30s from now.

ALIASES
  $ box folders:shared-links:create
  $ box folders:shared-links:update
```

_See code: [src/commands/folders/share.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/share.js)_

## `box folders:unshare ID`

Delete a shared link for a folder

```
USAGE
  $ box folders:unshare ID

ARGUMENTS
  ID  ID of the folder to unshare

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box folders:shared-links:delete
```

_See code: [src/commands/folders/unshare.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/unshare.js)_

## `box folders:update ID`

Update a folder

```
USAGE
  $ box folders:update ID

ARGUMENTS
  ID  ID of the folder to update

OPTIONS
  -h, --help                                Show CLI help
  -s, --save                                Save report to default reports folder on disk
  -t, --token=token                         Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                         Provide an ID for a user
  --bulk-file-path=bulk-file-path           File path to bulk .csv or .json objects
  --csv                                     Output formatted CSV
  --description=description                 New description for folder
  --etag=etag                               Only apply updates if the etag value matches
  --fields=fields                           Comma separated list of fields to show
  --json                                    Output formatted JSON
  --name=name                               New name for folder
  --no-color                                Turn off colors for logging
  --[no-]restrict-collaboration             Restrict collaboration so only owners can invite new collaborators
  --save-to-file-path=save-to-file-path     Override default file path to save report
  --[no-]sync                               Whether the folder is synced to desktop
  --tags=tags                               Comma seperated tags
  --upload-email-access=open|collaborators  Upload email access level
```

_See code: [src/commands/folders/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/update.js)_

## `box folders:upload PATH`

Upload a folder

```
USAGE
  $ box folders:upload PATH

ARGUMENTS
  PATH  Local path to the folder to upload

OPTIONS
  -h, --help                             Show CLI help
  -p, --parent-folder=parent-folder      [default: 0] Folder to upload this folder into; defaults to the root folder
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --folder-name=folder-name              Name to use for folder if not using local folder name
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/upload.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/folders/upload.js)_

## `box groups`

List all groups

```
USAGE
  $ box groups

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:list
```

_See code: [src/commands/groups/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/index.js)_

## `box groups:collaborations ID`

List collaborations for a group

```
USAGE
  $ box groups:collaborations ID

ARGUMENTS
  ID  ID of the group to get collaborations for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:list-collaborations
  $ box collaborations:list-for-group
```

_See code: [src/commands/groups/collaborations.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/collaborations.js)_

## `box groups:create NAME`

Create a group

```
USAGE
  $ box groups:create NAME

ARGUMENTS
  NAME  Group name

OPTIONS
  -h, --help                                                           Show CLI help
  -i, --invite=admins_only|admins_and_members|all_managed_users        Specifies who can invite the group to collaborate
  -m, --view-members=admins_only|admins_and_members|all_managed_users  Specifies who can view the members of the group
  -s, --save                                                           Save report to default reports folder on disk
  -t, --token=token                                                    Provide a token to perform this call

  -v, --verbose                                                        Show verbose output, which can be helpful for
                                                                       debugging

  -y, --yes                                                            Automatically respond yes to all confirmation
                                                                       prompts

  --as-user=as-user                                                    Provide an ID for a user

  --bulk-file-path=bulk-file-path                                      File path to bulk .csv or .json objects

  --csv                                                                Output formatted CSV

  --description=description                                            Description of the group

  --external-sync-identifier=external-sync-identifier                  Group identifier for groups coming from an
                                                                       external source

  --fields=fields                                                      Comma separated list of fields to show

  --id-only                                                            Return only an ID to output from this command

  --json                                                               Output formatted JSON

  --no-color                                                           Turn off colors for logging

  --provenance=provenance                                              Track the external source where the group is
                                                                       coming from

  --save-to-file-path=save-to-file-path                                Override default file path to save report
```

_See code: [src/commands/groups/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/create.js)_

## `box groups:delete ID`

Delete a group

```
USAGE
  $ box groups:delete ID

ARGUMENTS
  ID  ID of the group to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/groups/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/delete.js)_

## `box groups:get ID`

Get information about a group

```
USAGE
  $ box groups:get ID

ARGUMENTS
  ID  ID of the group to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/groups/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/get.js)_

## `box groups:memberships ID`

List members of a group

```
USAGE
  $ box groups:memberships ID

ARGUMENTS
  ID  ID of the group to get memberships for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:list
```

_See code: [src/commands/groups/memberships/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/memberships/index.js)_

## `box groups:memberships:add USERID GROUPID`

Add a user to a group

```
USAGE
  $ box groups:memberships:add USERID GROUPID

ARGUMENTS
  USERID   ID of the user to add to the group
  GROUPID  ID of the group to add the user to

OPTIONS
  -h, --help                             Show CLI help
  -r, --role=member|admin                [default: member] Set the user's role in the group
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-create-accounts             If the user is a group admin, allow them to create new users
  --[no-]can-edit-accounts               If the user is a group admin, allow them to edit user accounts
  --[no-]can-instant-login               If the user is a group admin, allow them to instant login
  --[no-]can-run-reports                 If the user is a group admin, allow them to run reports
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:add
```

_See code: [src/commands/groups/memberships/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/memberships/add.js)_

## `box groups:memberships:get ID`

Get information about a group membership

```
USAGE
  $ box groups:memberships:get ID

ARGUMENTS
  ID  ID of the group membership to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:get
```

_See code: [src/commands/groups/memberships/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/memberships/get.js)_

## `box groups:memberships:remove ID`

Remove a user from a group

```
USAGE
  $ box groups:memberships:remove ID

ARGUMENTS
  ID  ID of the group membership record to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:remove
```

_See code: [src/commands/groups/memberships/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/memberships/remove.js)_

## `box groups:memberships:update ID`

Update a user's membership to a group

```
USAGE
  $ box groups:memberships:update ID

ARGUMENTS
  ID  ID of the group membership to update

OPTIONS
  -h, --help                             Show CLI help
  -r, --role=member|admin                Set the user's role in the group
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-create-accounts             If the user is a group admin, allow them to create new users
  --[no-]can-edit-accounts               If the user is a group admin, allow them to edit user accounts
  --[no-]can-instant-login               If the user is a group admin, allow them to instant login
  --[no-]can-run-reports                 If the user is a group admin, allow them to run reports
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:update
```

_See code: [src/commands/groups/memberships/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/memberships/update.js)_

## `box groups:update ID`

Update a group

```
USAGE
  $ box groups:update ID

ARGUMENTS
  ID  ID of the group to update

OPTIONS
  -h, --help                                                           Show CLI help
  -i, --invite=admins_only|admins_and_members|all_managed_users        Specifies who can invite the group to collaborate
  -m, --view-members=admins_only|admins_and_members|all_managed_users  Specifies who can view the members of the group
  -n, --name=name                                                      The name of the group
  -s, --save                                                           Save report to default reports folder on disk
  -t, --token=token                                                    Provide a token to perform this call

  -v, --verbose                                                        Show verbose output, which can be helpful for
                                                                       debugging

  -y, --yes                                                            Automatically respond yes to all confirmation
                                                                       prompts

  --as-user=as-user                                                    Provide an ID for a user

  --bulk-file-path=bulk-file-path                                      File path to bulk .csv or .json objects

  --csv                                                                Output formatted CSV

  --description=description                                            Description of the group

  --external-sync-identifier=external-sync-identifier                  group identifier for groups coming from an
                                                                       external source

  --fields=fields                                                      Comma separated list of fields to show

  --json                                                               Output formatted JSON

  --no-color                                                           Turn off colors for logging

  --provenance=provenance                                              Track the external source where the group is
                                                                       coming from

  --save-to-file-path=save-to-file-path                                Override default file path to save report
```

_See code: [src/commands/groups/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/groups/update.js)_

## `box help [COMMAND]`

display help for box

```
USAGE
  $ box help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `box legal-hold-policies`

List legal hold policies

```
USAGE
  $ box legal-hold-policies

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --policy-name=policy-name              Filter by policy name
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/index.js)_

## `box legal-hold-policies:assign POLICYID`

Create a new policy assignment

```
USAGE
  $ box legal-hold-policies:assign POLICYID

ARGUMENTS
  POLICYID  ID of the legal hold policy to assign

OPTIONS
  -h, --help                                      Show CLI help
  -s, --save                                      Save report to default reports folder on disk
  -t, --token=token                               Provide a token to perform this call
  -v, --verbose                                   Show verbose output, which can be helpful for debugging
  -y, --yes                                       Automatically respond yes to all confirmation prompts
  --as-user=as-user                               Provide an ID for a user
  --assign-to-id=assign-to-id                     (required) ID of the object to assign the policy to
  --assign-to-type=file_version|file|folder|user  (required) Type of object to assign the policy to
  --bulk-file-path=bulk-file-path                 File path to bulk .csv or .json objects
  --csv                                           Output formatted CSV
  --fields=fields                                 Comma separated list of fields to show
  --json                                          Output formatted JSON
  --no-color                                      Turn off colors for logging
  --save-to-file-path=save-to-file-path           Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/assign.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/assign.js)_

## `box legal-hold-policies:assignments ID`

List policy assignments

```
USAGE
  $ box legal-hold-policies:assignments ID

ARGUMENTS
  ID  ID of the legal hold policy get get assignments for

OPTIONS
  -h, --help                                      Show CLI help
  -s, --save                                      Save report to default reports folder on disk
  -t, --token=token                               Provide a token to perform this call
  -v, --verbose                                   Show verbose output, which can be helpful for debugging
  -y, --yes                                       Automatically respond yes to all confirmation prompts
  --as-user=as-user                               Provide an ID for a user
  --assign-to-id=assign-to-id                     Filter by assignment Id
  --assign-to-type=file_version|file|folder|user  Filter by assignment type
  --bulk-file-path=bulk-file-path                 File path to bulk .csv or .json objects
  --csv                                           Output formatted CSV
  --fields=fields                                 Comma separated list of fields to show
  --json                                          Output formatted JSON
  --no-color                                      Turn off colors for logging
  --save-to-file-path=save-to-file-path           Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/assignments/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/assignments/index.js)_

## `box legal-hold-policies:assignments:delete ID`

Delete a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:delete ID

ARGUMENTS
  ID  ID of the policy assignment to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/assignments/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/assignments/delete.js)_

## `box legal-hold-policies:assignments:get ID`

Get information about a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:get ID

ARGUMENTS
  ID  ID of the policy assignment to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/assignments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/assignments/get.js)_

## `box legal-hold-policies:create POLICYNAME`

Create a new legal hold policy

```
USAGE
  $ box legal-hold-policies:create POLICYNAME

ARGUMENTS
  POLICYNAME  Name of the legal hold policy

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              Description of legal hold policy
  --fields=fields                        Comma separated list of fields to show

  --filter-ended-at=filter-ended-at      Date filter applies to Custodian assignments only. Should be today's date or
                                         before. Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks
                                         ago

  --filter-started-at=filter-started-at  Date filter applies to Custodian assignments only. Should be today's date or
                                         before. Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks
                                         ago

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --ongoing                              Assignments under this policy will continue applying to files based on events,
                                         indefinitely

  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/create.js)_

## `box legal-hold-policies:delete ID`

Delete a legal hold policy

```
USAGE
  $ box legal-hold-policies:delete ID

ARGUMENTS
  ID  ID of the legal hold policy to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/delete.js)_

## `box legal-hold-policies:file-version-holds ID`

List file version legal holds for a legal hold policy

```
USAGE
  $ box legal-hold-policies:file-version-holds ID

ARGUMENTS
  ID  ID of the legal hold policy to get holds for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/file-version-holds/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/file-version-holds/index.js)_

## `box legal-hold-policies:file-version-holds:get ID`

Get information about a file version legal hold

```
USAGE
  $ box legal-hold-policies:file-version-holds:get ID

ARGUMENTS
  ID  ID of the file version legal hold to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/file-version-holds/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/file-version-holds/get.js)_

## `box legal-hold-policies:get ID`

Get information about a legal hold policy

```
USAGE
  $ box legal-hold-policies:get ID

ARGUMENTS
  ID  ID of the legal hold policy to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/get.js)_

## `box legal-hold-policies:update ID`

Update a legal hold policy

```
USAGE
  $ box legal-hold-policies:update ID

ARGUMENTS
  ID  ID of a legal hold policy to update

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --description=description              Description of legal hold policy. Max characters 500
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --policy-name=policy-name              Name of legal hold policy. Max characters 254
  --release-notes=release-notes          Notes around why the policy was released. Max characters 500
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/legal-hold-policies/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/legal-hold-policies/update.js)_

## `box metadata-cascade-policies FOLDERID`

List the metadata cascade policies on a folder

```
USAGE
  $ box metadata-cascade-policies FOLDERID

ARGUMENTS
  FOLDERID  The ID of the folder to list cascade policies for

OPTIONS
  -h, --help                                 Show CLI help
  -s, --save                                 Save report to default reports folder on disk
  -t, --token=token                          Provide a token to perform this call
  -v, --verbose                              Show verbose output, which can be helpful for debugging
  -y, --yes                                  Automatically respond yes to all confirmation prompts
  --as-user=as-user                          Provide an ID for a user
  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects
  --csv                                      Output formatted CSV
  --fields=fields                            Comma separated list of fields to show
  --json                                     Output formatted JSON
  --no-color                                 Turn off colors for logging
  --owner-enterprise-id=owner-enterprise-id  The ID of the enterprise to filter cascade policies for
  --save-to-file-path=save-to-file-path      Override default file path to save report
```

_See code: [src/commands/metadata-cascade-policies/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-cascade-policies/index.js)_

## `box metadata-cascade-policies:delete ID`

Delete a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:delete ID

ARGUMENTS
  ID  The ID of the metadata cascade policy to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/metadata-cascade-policies/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-cascade-policies/delete.js)_

## `box metadata-cascade-policies:force-apply ID`

Force apply a cascade policy to the existing items in a folder

```
USAGE
  $ box metadata-cascade-policies:force-apply ID

ARGUMENTS
  ID  The ID of the cascade policy to force apply

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --conflict-resolution=none|overwrite   (required) The way to resolve conflicts with the metadata being applied
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/metadata-cascade-policies/force-apply.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-cascade-policies/force-apply.js)_

## `box metadata-cascade-policies:get ID`

Get information about a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:get ID

ARGUMENTS
  ID  The ID of the cascade policy to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/metadata-cascade-policies/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-cascade-policies/get.js)_

## `box metadata-templates`

Get all metadata templates in your Enterprise

```
USAGE
  $ box metadata-templates

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box metadata-templates:list
```

_See code: [src/commands/metadata-templates/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/index.js)_

## `box metadata-templates:cascade TEMPLATEKEY`

Create a new metadata cascade policy on a folder

```
USAGE
  $ box metadata-templates:cascade TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to cascade

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --folder=folder                        (required) The ID of the folder to cascade metadata on
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to cascade
```

_See code: [src/commands/metadata-templates/cascade.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/cascade.js)_

## `box metadata-templates:create`

Create a new metadata template

```
USAGE
  $ box metadata-templates:create

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --date=date                            Add a date field with the provided display name
  --description=description              Set the description of a field
  --display-name=display-name            (required) The display name of the metadata template
  --enum=enum                            Add an enum field with the provided display name
  --field-key=field-key                  Set the key of a field
  --fields=fields                        Comma separated list of fields to show
  --[no-]hidden                          Whether this template or field is hidden in the UI
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --multi-select=multi-select            Add a multi-select field with the provided display name
  --no-color                             Turn off colors for logging
  --number=number                        Add a numeric field with the provided display name
  --option=option                        Add an option to a field
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template
  --string=string                        Add a string field with the provided name

  --template-key=template-key            A unique identifier for the template.  If not specified, will be derived from
                                         the display name
```

_See code: [src/commands/metadata-templates/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/create.js)_

## `box metadata-templates:delete TEMPLATEKEY`

Delete a metadata template

```
USAGE
  $ box metadata-templates:delete TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to delete
```

_See code: [src/commands/metadata-templates/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/delete.js)_

## `box metadata-templates:get TEMPLATEKEY`

Get information about a metadata template

```
USAGE
  $ box metadata-templates:get TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the template to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to get
```

_See code: [src/commands/metadata-templates/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/get.js)_

## `box metadata-templates:update TEMPLATEKEY`

Update a metadata template

```
USAGE
  $ box metadata-templates:update TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The key of the template to update

OPTIONS
  -h, --help                                   Show CLI help
  -s, --save                                   Save report to default reports folder on disk
  -t, --token=token                            Provide a token to perform this call
  -v, --verbose                                Show verbose output, which can be helpful for debugging
  -y, --yes                                    Automatically respond yes to all confirmation prompts

  --add-enum-option=add-enum-option            Add an enum option to the specified field; must be followed by one or
                                               more --option flags

  --as-user=as-user                            Provide an ID for a user

  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects

  --csv                                        Output formatted CSV

  --date=date                                  Add a date field with the provided display name

  --description=description                    Set the description of a field

  --display-name=display-name                  The display name of the metadata template or field

  --edit-enum-option=edit-enum-option          Edit the specified enum option; must be followed by an --option flag

  --edit-field=edit-field                      Edit the specified field; must be followed by flags to apply to the field

  --enum=enum                                  Add an enum field with the provided display name

  --field-key=field-key                        Set the key of a field

  --fields=fields                              Comma separated list of fields to show

  --[no-]hidden                                Whether this template or field is hidden in the UI

  --json                                       Output formatted JSON

  --multi-select=multi-select                  Add a multi-select field with the provided display name

  --no-color                                   Turn off colors for logging

  --number=number                              Add a numeric field with the provided display name

  --option=option                              Specify a field option

  --remove-enum-option=remove-enum-option      Removes the specified enum field option; must be in the form
                                               fieldKey.optionKey

  --remove-field=remove-field                  Remove the specified field

  --reorder-enum-options=reorder-enum-options  Reorder the options for a given field; must be followed by one or more
                                               --option flags

  --reorder-fields=reorder-fields              Reorder the template fields; must be in the form first_key,second_key,...

  --save-to-file-path=save-to-file-path        Override default file path to save report

  --scope=scope                                [default: enterprise] The scope of the metadata template

  --string=string                              Add a string field with the provided name
```

_See code: [src/commands/metadata-templates/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/metadata-templates/update.js)_

## `box recent-items`

List information about files accessed in the past 90 days up to a 1000 items

```
USAGE
  $ box recent-items

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/recent-items.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/recent-items.js)_

## `box request RESOURCE`

Manually specify a Box API request

```
USAGE
  $ box request RESOURCE

ARGUMENTS
  RESOURCE  The Box API resource to make a request against, e.g. /search or https://api.box.com/2.0/search

OPTIONS
  -H, --header=header                       HTTP header to add to the request, e.g. "Header: value"
  -X, --method=GET|POST|PUT|DELETE|OPTIONS  [default: GET] The HTTP method for the request
  -h, --help                                Show CLI help
  -s, --save                                Save report to default reports folder on disk
  -t, --token=token                         Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                         Provide an ID for a user
  --body=body                               Body of the request
  --bulk-file-path=bulk-file-path           File path to bulk .csv or .json objects
  --csv                                     Output formatted CSV
  --fields=fields                           Comma separated list of fields to show
  --json                                    Output formatted JSON
  --no-color                                Turn off colors for logging
  --query=query                             Query params to use for the request, either as k1=v1&k2=v2 or as JSON
  --save-to-file-path=save-to-file-path     Override default file path to save report
```

_See code: [src/commands/request.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/request.js)_

## `box retention-policies`

List all retention policies for your enterprise

```
USAGE
  $ box retention-policies

OPTIONS
  -h, --help                                   Show CLI help
  -n, --policy-name=policy-name                A name to filter the retention policies by
  -s, --save                                   Save report to default reports folder on disk
  -t, --token=token                            Provide a token to perform this call
  -u, --created-by-user-id=created-by-user-id  A user id to filter the retention policies by
  -v, --verbose                                Show verbose output, which can be helpful for debugging
  -y, --yes                                    Automatically respond yes to all confirmation prompts
  --as-user=as-user                            Provide an ID for a user
  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects
  --csv                                        Output formatted CSV
  --fields=fields                              Comma separated list of fields to show
  --json                                       Output formatted JSON
  --no-color                                   Turn off colors for logging
  --policy-type=finite|indefinite              A policy type to filter the retention policies by
  --save-to-file-path=save-to-file-path        Override default file path to save report
```

_See code: [src/commands/retention-policies/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/index.js)_

## `box retention-policies:assign POLICYID`

Assign a retention policy assignment

```
USAGE
  $ box retention-policies:assign POLICYID

ARGUMENTS
  POLICYID  The ID of the retention policy to assign this content to

OPTIONS
  -h, --help                                            Show CLI help
  -s, --save                                            Save report to default reports folder on disk
  -t, --token=token                                     Provide a token to perform this call
  -v, --verbose                                         Show verbose output, which can be helpful for debugging
  -y, --yes                                             Automatically respond yes to all confirmation prompts
  --as-user=as-user                                     Provide an ID for a user
  --assign-to-id=assign-to-id                           The ID of the content to assign the retention policy to

  --assign-to-type=enterprise|folder|metadata_template  (required) The type of the content to assign the retention
                                                        policy to

  --bulk-file-path=bulk-file-path                       File path to bulk .csv or .json objects

  --csv                                                 Output formatted CSV

  --fields=fields                                       Comma separated list of fields to show

  --json                                                Output formatted JSON

  --no-color                                            Turn off colors for logging

  --save-to-file-path=save-to-file-path                 Override default file path to save report
```

_See code: [src/commands/retention-policies/assign.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/assign.js)_

## `box retention-policies:assignments ID`

List all retention policies for your enterprise

```
USAGE
  $ box retention-policies:assignments ID

ARGUMENTS
  ID  ID of the retention policy to get assignments for

OPTIONS
  -h, --help                                  Show CLI help
  -s, --save                                  Save report to default reports folder on disk
  -t, --token=token                           Provide a token to perform this call
  -v, --verbose                               Show verbose output, which can be helpful for debugging
  -y, --yes                                   Automatically respond yes to all confirmation prompts
  --as-user=as-user                           Provide an ID for a user
  --bulk-file-path=bulk-file-path             File path to bulk .csv or .json objects
  --csv                                       Output formatted CSV
  --fields=fields                             Comma separated list of fields to show
  --json                                      Output formatted JSON
  --no-color                                  Turn off colors for logging
  --save-to-file-path=save-to-file-path       Override default file path to save report
  --type=folder|enterprise|metadata_template  The type of the retention policy assignment to retrieve
```

_See code: [src/commands/retention-policies/assignments/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/assignments/index.js)_

## `box retention-policies:assignments:get ID`

Get information about a retention policy assignment

```
USAGE
  $ box retention-policies:assignments:get ID

ARGUMENTS
  ID  ID of the retention policy assignment to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/retention-policies/assignments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/assignments/get.js)_

## `box retention-policies:create POLICYNAME`

Create a new retention policy

```
USAGE
  $ box retention-policies:create POLICYNAME

ARGUMENTS
  POLICYNAME  Name of retention policy to be created

OPTIONS
  -h, --help                                                Show CLI help

  -l, --retention-length=retention-length                   The number of days to apply the retention policy. If not
                                                            set, policy will be indefinite

  -s, --save                                                Save report to default reports folder on disk

  -t, --token=token                                         Provide a token to perform this call

  -v, --verbose                                             Show verbose output, which can be helpful for debugging

  -y, --yes                                                 Automatically respond yes to all confirmation prompts

  --[no-]allow-extension                                    The owner of a file will be allowed to extend the retention

  --as-user=as-user                                         Provide an ID for a user

  --bulk-file-path=bulk-file-path                           File path to bulk .csv or .json objects

  --csv                                                     Output formatted CSV

  --disposition-action=permanently_delete|remove_retention  (required) For indefinite policies, disposition action must
                                                            be remove_retention

  --fields=fields                                           Comma separated list of fields to show

  --json                                                    Output formatted JSON

  --no-color                                                Turn off colors for logging

  --[no-]notify-owners                                      The owner or co-owner will get notified when a file is
                                                            nearing expiration

  --save-to-file-path=save-to-file-path                     Override default file path to save report
```

_See code: [src/commands/retention-policies/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/create.js)_

## `box retention-policies:file-version-retentions`

List all file version retentions for your enterprise

```
USAGE
  $ box retention-policies:file-version-retentions

OPTIONS
  -h, --help                                                Show CLI help
  -s, --save                                                Save report to default reports folder on disk
  -t, --token=token                                         Provide a token to perform this call
  -v, --verbose                                             Show verbose output, which can be helpful for debugging
  -y, --yes                                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                                         Provide an ID for a user
  --bulk-file-path=bulk-file-path                           File path to bulk .csv or .json objects
  --csv                                                     Output formatted CSV
  --disposition-action=permanently_delete|remove_retention  A disposition action to filter by

  --disposition-after=disposition-after                     A date to filter retention policies that complete after a
                                                            certain time

  --disposition-before=disposition-before                   A date to filter retention policies that complete before a
                                                            certain time

  --fields=fields                                           Comma separated list of fields to show

  --file-id=file-id                                         A file id to filter the file version retentions by

  --file-version-id=file-version-id                         A file version id to filter the file version retentions by

  --json                                                    Output formatted JSON

  --no-color                                                Turn off colors for logging

  --policy-id=policy-id                                     A policy id to filter the file version retentions by

  --save-to-file-path=save-to-file-path                     Override default file path to save report
```

_See code: [src/commands/retention-policies/file-version-retentions/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/file-version-retentions/index.js)_

## `box retention-policies:file-version-retentions:get ID`

Get information about a file version retention policy

```
USAGE
  $ box retention-policies:file-version-retentions:get ID

ARGUMENTS
  ID  ID of the file version retention to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/retention-policies/file-version-retentions/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/file-version-retentions/get.js)_

## `box retention-policies:get ID`

Get information about a retention policy

```
USAGE
  $ box retention-policies:get ID

ARGUMENTS
  ID  ID of the retention policy to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/retention-policies/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/get.js)_

## `box retention-policies:update ID`

Update a retention policy

```
USAGE
  $ box retention-policies:update ID

ARGUMENTS
  ID  ID of the retention policy to update

OPTIONS
  -a, --disposition-action=disposition-action  For indefinite policies, disposition action must be remove_retention
  -h, --help                                   Show CLI help

  -l, --retention-length=retention-length      The amount of time, in days, to apply the retention policy. Required for
                                               finite policies

  -n, --policy-name=policy-name                New name of retention policy

  -r, --retire                                 Retire a retention policy

  -s, --save                                   Save report to default reports folder on disk

  -t, --token=token                            Provide a token to perform this call

  -v, --verbose                                Show verbose output, which can be helpful for debugging

  -y, --yes                                    Automatically respond yes to all confirmation prompts

  --[no-]allow-extension                       The owner of a file will be allowed to extend the retention

  --as-user=as-user                            Provide an ID for a user

  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects

  --csv                                        Output formatted CSV

  --fields=fields                              Comma separated list of fields to show

  --json                                       Output formatted JSON

  --no-color                                   Turn off colors for logging

  --[no-]notify-owners                         The owner or co-owner will get notified when a file is nearing expiration

  --policy-type=finite|indefinite              Type of policy

  --save-to-file-path=save-to-file-path        Override default file path to save report
```

_See code: [src/commands/retention-policies/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/retention-policies/update.js)_

## `box search [QUERY]`

Search for files and folders in your Enterprise

```
USAGE
  $ box search [QUERY]

ARGUMENTS
  QUERY  The search term

OPTIONS
  -h, --help                                     Show CLI help
  -s, --save                                     Save report to default reports folder on disk
  -t, --token=token                              Provide a token to perform this call
  -v, --verbose                                  Show verbose output, which can be helpful for debugging
  -y, --yes                                      Automatically respond yes to all confirmation prompts

  --ancestor-folder-ids=ancestor-folder-ids      Search for the contents of specific folders (and folders within them).
                                                 Requires a folder ID or a set of comma-delimited folder IDs

  --as-user=as-user                              Provide an ID for a user

  --bulk-file-path=bulk-file-path                File path to bulk .csv or .json objects

  --content-types=content-types                  Search for objects of specified content types. Requires a content type
                                                 or a set of comma-delimited content types

  --created-at-from=created-at-from              Start of created date range. Use a RFC3339 timestamp or shorthand
                                                 syntax 0t, like 5w for 5 weeks

  --created-at-to=created-at-to                  End of created date range. Use a RFC3339 timestamp or shorthand syntax
                                                 0t, like 5w for 5 weeks

  --csv                                          Output formatted CSV

  --fields=fields                                Comma separated list of fields to show

  --file-extensions=file-extensions              Limit searches to specific file extensions i.e. png,md,pdf

  --json                                         Output formatted JSON

  --mdfilter=mdfilter                            Metadata value to filter on, in the format
                                                 <scope>.<templateKey>.<field>=<value>

  --no-color                                     Turn off colors for logging

  --owner-user-ids=owner-user-ids                Search for objects by owner. Requires a user ID or a set of
                                                 comma-delimited user IDs

  --save-to-file-path=save-to-file-path          Override default file path to save report

  --scope=user_content|enterprise_content        The scope on which you want search

  --size-from=size-from                          Lower bound for file size, in bytes

  --size-to=size-to                              Upper bound for file size, in bytes

  --trash-content=trashed_only|non_trashed_only  Controls whether to search in the trash. Defaults to non_trashed_only

  --type=file|folder|web_link                    The type of objects you want to include in the search results

  --updated-at-from=updated-at-from              Start of updated date range. Use a RFC3339 timestamp or shorthand
                                                 syntax 0t, like 5w for 5 weeks

  --updated-at-to=updated-at-to                  End of updated date range. Use a RFC3339 timestamp or shorthand syntax
                                                 0t, like 5w for 5 weeks
```

_See code: [src/commands/search.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/search.js)_

## `box shared-links:get URL`

Get information from a shared item URL

```
USAGE
  $ box shared-links:get URL

ARGUMENTS
  URL  Shared item URL to resolve

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --password=password                    Shared item password
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/shared-links/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/shared-links/get.js)_

## `box storage-policies`

List storage policies

```
USAGE
  $ box storage-policies

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box storage-policies:list
```

_See code: [src/commands/storage-policies/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/index.js)_

## `box storage-policies:assign STORAGEPOLICYID USERID`

Assign a storage policy

```
USAGE
  $ box storage-policies:assign STORAGEPOLICYID USERID

ARGUMENTS
  STORAGEPOLICYID  Id of the storage policy
  USERID           Id of the user to assign the storage policy to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/storage-policies/assign.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/assign.js)_

## `box storage-policies:assignments:get ID`

Get information on a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:get ID

ARGUMENTS
  ID  ID of the storage policy assignment to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/storage-policies/assignments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/assignments/get.js)_

## `box storage-policies:assignments:lookup ID`

Look up which storage policy an object is assigned to

```
USAGE
  $ box storage-policies:assignments:lookup ID

ARGUMENTS
  ID  ID of the object to look up the storage policy for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --type=user|enterprise                 (required) [default: user] Type of object to look up the storage policy for
```

_See code: [src/commands/storage-policies/assignments/lookup.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/assignments/lookup.js)_

## `box storage-policies:assignments:remove ID`

Delete a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:remove ID

ARGUMENTS
  ID  ID of the storage policy assignment to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/storage-policies/assignments/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/assignments/remove.js)_

## `box storage-policies:get ID`

Get information on a storage policy

```
USAGE
  $ box storage-policies:get ID

ARGUMENTS
  ID  ID of the storage policy to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/storage-policies/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/storage-policies/get.js)_

## `box tasks:assign TASKID`

Create a task assignment

```
USAGE
  $ box tasks:assign TASKID

ARGUMENTS
  TASKID  ID of the task to assign

OPTIONS
  -h, --help                                   Show CLI help
  -s, --save                                   Save report to default reports folder on disk
  -t, --token=token                            Provide a token to perform this call
  -v, --verbose                                Show verbose output, which can be helpful for debugging
  -y, --yes                                    Automatically respond yes to all confirmation prompts
  --as-user=as-user                            Provide an ID for a user
  --assign-to-user-id=assign-to-user-id        Assign task by user ID
  --assign-to-user-login=assign-to-user-login  Assign task by user login
  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects
  --csv                                        Output formatted CSV
  --fields=fields                              Comma separated list of fields to show
  --json                                       Output formatted JSON
  --no-color                                   Turn off colors for logging
  --save-to-file-path=save-to-file-path        Override default file path to save report

ALIASES
  $ box task-assignments:create
```

_See code: [src/commands/tasks/assign.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/assign.js)_

## `box tasks:assignments ID`

List all task assignments on a task

```
USAGE
  $ box tasks:assignments ID

ARGUMENTS
  ID  ID of the task to get assignments for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box task-assignments:list
```

_See code: [src/commands/tasks/assignments/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/assignments/index.js)_

## `box tasks:assignments:delete ID`

Delete a task assignment

```
USAGE
  $ box tasks:assignments:delete ID

ARGUMENTS
  ID  ID of the task assignment to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box task-assignments:delete
```

_See code: [src/commands/tasks/assignments/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/assignments/delete.js)_

## `box tasks:assignments:get ID`

Get information about a task assignment

```
USAGE
  $ box tasks:assignments:get ID

ARGUMENTS
  ID  ID of the task assignment to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box task-assignments:get
```

_See code: [src/commands/tasks/assignments/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/assignments/get.js)_

## `box tasks:assignments:update ID`

Update a task assignment

```
USAGE
  $ box tasks:assignments:update ID

ARGUMENTS
  ID  ID of the task assignment to update

OPTIONS
  -h, --help                                       Show CLI help
  -s, --save                                       Save report to default reports folder on disk
  -t, --token=token                                Provide a token to perform this call
  -v, --verbose                                    Show verbose output, which can be helpful for debugging
  -y, --yes                                        Automatically respond yes to all confirmation prompts
  --as-user=as-user                                Provide an ID for a user
  --bulk-file-path=bulk-file-path                  File path to bulk .csv or .json objects
  --csv                                            Output formatted CSV
  --fields=fields                                  Comma separated list of fields to show
  --json                                           Output formatted JSON
  --message=message                                A message from the assignee about this task
  --no-color                                       Turn off colors for logging
  --save-to-file-path=save-to-file-path            Override default file path to save report
  --status=completed|incomplete|approved|rejected  Set the resolution state of the task assignment

ALIASES
  $ box task-assignments:update
```

_See code: [src/commands/tasks/assignments/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/assignments/update.js)_

## `box tasks:create FILEID`

Create a task on a file

```
USAGE
  $ box tasks:create FILEID

ARGUMENTS
  FILEID  ID of the file to create a task on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --due-at=due-at                        When this task is due, use format 05h for 5 hours for example
  --fields=fields                        Comma separated list of fields to show
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --message=message                      Message for task
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/tasks/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/create.js)_

## `box tasks:delete ID`

Delete a task

```
USAGE
  $ box tasks:delete ID

ARGUMENTS
  ID  ID of the task to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/tasks/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/delete.js)_

## `box tasks:get ID`

Get information about a task

```
USAGE
  $ box tasks:get ID

ARGUMENTS
  ID  ID of the task to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/tasks/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/get.js)_

## `box tasks:update ID`

Update a task on a file

```
USAGE
  $ box tasks:update ID

ARGUMENTS
  ID  ID of the task to update

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --due-at=due-at                        When this task is due, use format 05h for 5 hours for example
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --message=message                      Message for task
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/tasks/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tasks/update.js)_

## `box terms-of-service`

List terms of services for your enterprise

```
USAGE
  $ box terms-of-service

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --type=managed|external                Filter by terms of service type
```

_See code: [src/commands/terms-of-service/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/index.js)_

## `box terms-of-service:create`

Create a terms of service

```
USAGE
  $ box terms-of-service:create

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --status=enabled|disabled              (required) Status of the terms of service
  --text=text                            (required) Text for the terms of service
  --type=managed|external                (required) Type of terms of service
```

_See code: [src/commands/terms-of-service/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/create.js)_

## `box terms-of-service:get ID`

Get information on a terms of service

```
USAGE
  $ box terms-of-service:get ID

ARGUMENTS
  ID  ID for the terms of service to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/terms-of-service/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/get.js)_

## `box terms-of-service:get-user-status TOSID`

Get a user's status on a terms of service

```
USAGE
  $ box terms-of-service:get-user-status TOSID

ARGUMENTS
  TOSID  ID of the terms of service to get user status for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --user-id=user-id                      ID for a user to get status for; defaults to the current user ID
```

_See code: [src/commands/terms-of-service/get-user-status.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/get-user-status.js)_

## `box terms-of-service:set-user-status ID`

Set a user's status on a terms of service with a terms of service Id

```
USAGE
  $ box terms-of-service:set-user-status ID

ARGUMENTS
  ID  ID of the terms of service to set the user status on

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --accept                               Set the user's status as accepted
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --reject                               Set the user's status as rejected
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --user-id=user-id                      ID of the user to set status for; defaults to the current user
```

_See code: [src/commands/terms-of-service/set-user-status.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/set-user-status.js)_

## `box terms-of-service:update ID`

Update a terms of service

```
USAGE
  $ box terms-of-service:update ID

ARGUMENTS
  ID  ID of the terms of service to update

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --status=enabled|disabled              Status of the terms of service
  --text=text                            Text for the terms of service
```

_See code: [src/commands/terms-of-service/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/terms-of-service/update.js)_

## `box tokens:exchange SCOPE`

Get a token. Returns the service account token by default

```
USAGE
  $ box tokens:exchange SCOPE

ARGUMENTS
  SCOPE  The scope(s) for the new token, separated by a comma if multiple are present

OPTIONS
  -h, --help             Show CLI help
  -t, --token=token      Specify the token to exchange
  -u, --user-id=user-id  Get a user token from a user ID
  -v, --verbose          Show verbose output, which can be helpful for debugging
  --file-id=file-id      Scope the token to a specific file
  --folder-id=folder-id  Scope the token to a specific folder
  --no-color             Turn off colors for logging
```

_See code: [src/commands/tokens/exchange.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tokens/exchange.js)_

## `box tokens:get`

Get a token. Returns the service account token by default

```
USAGE
  $ box tokens:get

OPTIONS
  -h, --help             Show CLI help
  -u, --user-id=user-id  Get a user token from a user ID
  -v, --verbose          Show verbose output, which can be helpful for debugging
  --no-color             Turn off colors for logging
```

_See code: [src/commands/tokens/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tokens/get.js)_

## `box tokens:revoke TOKEN`

Revoke a token.  The token will no longer be valid for making API calls.

```
USAGE
  $ box tokens:revoke TOKEN

ARGUMENTS
  TOKEN  The token to revoke

OPTIONS
  -h, --help     Show CLI help
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging
```

_See code: [src/commands/tokens/revoke.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/tokens/revoke.js)_

## `box trash`

List all items in trash

```
USAGE
  $ box trash

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box trash:list
```

_See code: [src/commands/trash/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/trash/index.js)_

## `box trash:delete TYPE ID`

Permanently delete an item

```
USAGE
  $ box trash:delete TYPE ID

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to permanently delete
  ID    ID of the item to permanently delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/trash/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/trash/delete.js)_

## `box users`

List all Box users

```
USAGE
  $ box users

OPTIONS
  -a, --all-users                        Results from all users
  -e, --external-users                   Limit results to external users only
  -h, --help                             Show CLI help
  -m, --managed-users                    Limit results to managed users only
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --app-users                            Limit results to app users only
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --filter=filter                        Search term to filter users on; matches prefixes of user name and login fields
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:list
```

_See code: [src/commands/users/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/index.js)_

## `box users:create NAME [LOGIN]`

Create a new Box User

```
USAGE
  $ box users:create NAME [LOGIN]

ARGUMENTS
  NAME   The user's name
  LOGIN  The user's email address, not required when creating app users

OPTIONS
  -S, --status=active|inactive|cannot_delete_edit|cannot_delete_edit_upload  User status
  -a, --address=address                                                      Address of the user

  -d, --disk-space=disk-space                                                User's available storage in bytes. Value of
                                                                             -1 grants unlimited storage

  -h, --help                                                                 Show CLI help

  -j, --job-title=job-title                                                  Job title of the user

  -l, --language=language                                                    Language of the user (ISO 639-1 Language
                                                                             Code).
                                                                             https://developer.box.com/v2.0/docs/api-lan
                                                                             guage-codes

  -p, --phone-number=phone-number                                            Phone number of the user

  -r, --role=user|coadmin                                                    Role of user. Enter user or coadmin

  -s, --save                                                                 Save report to default reports folder on
                                                                             disk

  -t, --token=token                                                          Provide a token to perform this call

  -v, --verbose                                                              Show verbose output, which can be helpful
                                                                             for debugging

  -y, --yes                                                                  Automatically respond yes to all
                                                                             confirmation prompts

  --app-user                                                                 Set this user as an app user

  --as-user=as-user                                                          Provide an ID for a user

  --avatar-url=avatar-url                                                    URL of the user's avatar image

  --bulk-file-path=bulk-file-path                                            File path to bulk .csv or .json objects

  --[no-]can-see-managed-users                                               User can see managed users

  --csv                                                                      Output formatted CSV

  --[no-]exempt-from-2fa                                                     Exempt user from two-factor auth

  --[no-]exempt-from-device-limits                                           Exempt user from device limits

  --fields=fields                                                            Comma separated list of fields to show

  --id-only                                                                  Return only an ID to output from this
                                                                             command

  --json                                                                     Output formatted JSON

  --no-color                                                                 Turn off colors for logging

  --password-reset                                                           Force the user to reset password

  --[no-]restrict-external-collab                                            Restrict user from external collaboration

  --save-to-file-path=save-to-file-path                                      Override default file path to save report

  --[no-]sync-enable                                                         Enable Box Sync for this user

  --timezone=timezone                                                        The user's timezone. Input format follows
                                                                             tz database timezones
```

_See code: [src/commands/users/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/create.js)_

## `box users:delete ID`

Delete a Box User

```
USAGE
  $ box users:delete ID

ARGUMENTS
  ID  User ID to delete

OPTIONS
  -f, --force                            Delete user even if they own files
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --[no-]notify                          The user should be notified
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/users/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/delete.js)_

## `box users:email-aliases USERID`

Get all Email Aliases for a User

```
USAGE
  $ box users:email-aliases USERID

ARGUMENTS
  USERID  User ID to get email aliases for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:get-email-aliases
```

_See code: [src/commands/users/email-aliases/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/email-aliases/index.js)_

## `box users:email-aliases:add USERID EMAIL`

Add a new email alias to a user

```
USAGE
  $ box users:email-aliases:add USERID EMAIL

ARGUMENTS
  USERID  User ID to add email alias
  EMAIL   Email to add as alias

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:add-email-alias
```

_See code: [src/commands/users/email-aliases/add.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/email-aliases/add.js)_

## `box users:email-aliases:remove USERID ALIASID`

Delete an email alias from a user

```
USAGE
  $ box users:email-aliases:remove USERID ALIASID

ARGUMENTS
  USERID   User ID to get email aliases
  ALIASID  The ID of the email alias to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:delete-email-alias
```

_See code: [src/commands/users/email-aliases/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/email-aliases/remove.js)_

## `box users:get [ID]`

Get information about a Box user

```
USAGE
  $ box users:get [ID]

ARGUMENTS
  ID  [default: me] ID of the user to get; defaults to the current user

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/users/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/get.js)_

## `box users:groups ID`

List groups a user belongs to

```
USAGE
  $ box users:groups ID

ARGUMENTS
  ID  ID of the user to get groups for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:list-groups
```

_See code: [src/commands/users/groups.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/groups.js)_

## `box users:invite EMAIL ENTERPRISEID`

Invite an Existing Box User to Your Enterprise

```
USAGE
  $ box users:invite EMAIL ENTERPRISEID

ARGUMENTS
  EMAIL         Email address of the user to invite
  ENTERPRISEID  ID of the Enterprise to invite the user to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:invite-user
```

_See code: [src/commands/users/invite.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/invite.js)_

## `box users:transfer-content USERID NEWUSERID`

Move a user's root content to another user

```
USAGE
  $ box users:transfer-content USERID NEWUSERID

ARGUMENTS
  USERID     User whose content should be moved
  NEWUSERID  User to whom the content should be moved

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --[no-]notify                          Notify the user that their content has been moved
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:move-root-content
```

_See code: [src/commands/users/transfer-content.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/transfer-content.js)_

## `box users:update ID`

Update a Box User

```
USAGE
  $ box users:update ID

ARGUMENTS
  ID  User ID to update

OPTIONS
  -S, --status=active|inactive|cannot_delete_edit|cannot_delete_edit_upload  User status. Enter active, inactive,
                                                                             cannot_delete_edit, or
                                                                             cannot_delete_edit_upload

  -a, --address=address                                                      Address of the user

  -d, --disk-space=disk-space                                                User's available storage in bytes. Value of
                                                                             -1 grants unlimited storage

  -h, --help                                                                 Show CLI help

  -j, --job-title=job-title                                                  Job title of the user

  -l, --language=language                                                    Language of the user (ISO 639-1 Language
                                                                             Code).
                                                                             https://developer.box.com/v2.0/docs/api-lan
                                                                             guage-codes

  -n, --name=name                                                            Set the user's name

  -p, --phone-number=phone-number                                            Phone number of the user

  -r, --role=user|coadmin                                                    Role of user. Enter user or coadmin

  -s, --save                                                                 Save report to default reports folder on
                                                                             disk

  -t, --token=token                                                          Provide a token to perform this call

  -v, --verbose                                                              Show verbose output, which can be helpful
                                                                             for debugging

  -y, --yes                                                                  Automatically respond yes to all
                                                                             confirmation prompts

  --as-user=as-user                                                          Provide an ID for a user

  --avatar-url=avatar-url                                                    URL of the user's avatar image

  --bulk-file-path=bulk-file-path                                            File path to bulk .csv or .json objects

  --[no-]can-see-managed-users                                               User can see managed users

  --csv                                                                      Output formatted CSV

  --[no-]exempt-from-2fa                                                     Exempt user from two-factor auth

  --[no-]exempt-from-device-limits                                           Exempt user from device limits

  --fields=fields                                                            Comma separated list of fields to show

  --json                                                                     Output formatted JSON

  --login=login                                                              Change the user's primary email address
                                                                             used for logging into Box

  --no-color                                                                 Turn off colors for logging

  --password-reset                                                           Force the user to reset password

  --remove                                                                   Remove the user from the enterprise,
                                                                             convert to free account

  --[no-]restrict-external-collab                                            Restrict user from external collaboration

  --save-to-file-path=save-to-file-path                                      Override default file path to save report

  --[no-]sync-enable                                                         Enable Box Sync for this user

  --timezone=timezone                                                        The user's timezone. Input format follows
                                                                             tz database timezones
```

_See code: [src/commands/users/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/users/update.js)_

## `box watermarking:apply ITEMTYPE ITEMID`

Apply a watermark on an item

```
USAGE
  $ box watermarking:apply ITEMTYPE ITEMID

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to apply a watermark to
  ITEMID    ID of the item to apply a watermark to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/watermarking/apply.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/watermarking/apply.js)_

## `box watermarking:get ITEMTYPE ITEMID`

Get the watermark on an item

```
USAGE
  $ box watermarking:get ITEMTYPE ITEMID

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to get watermark for
  ITEMID    ID of the item to get watermark for

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/watermarking/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/watermarking/get.js)_

## `box watermarking:remove ITEMTYPE ITEMID`

Remove a watermark from an item

```
USAGE
  $ box watermarking:remove ITEMTYPE ITEMID

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to remove watermark from
  ITEMID    ID of the item to remove watermark from

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/watermarking/remove.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/watermarking/remove.js)_

## `box web-links:create URL`

Create a new web link

```
USAGE
  $ box web-links:create URL

ARGUMENTS
  URL  The URL the web link points to. Must start with "http://" or "https://"

OPTIONS
  -d, --description=description          Description of the web link
  -h, --help                             Show CLI help
  -n, --name=name                        Name of the web link. Defaults to the URL if not set
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --parent-id=parent-id                  (required) ID of the folder to create the web link in
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/web-links/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/web-links/create.js)_

## `box web-links:delete ID`

Delete a web link

```
USAGE
  $ box web-links:delete ID

ARGUMENTS
  ID  ID of the web link to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/web-links/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/web-links/delete.js)_

## `box web-links:get ID`

Get information about a web link

```
USAGE
  $ box web-links:get ID

ARGUMENTS
  ID  ID of the web link to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/web-links/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/web-links/get.js)_

## `box web-links:move ID PARENTID`

Move a web link

```
USAGE
  $ box web-links:move ID PARENTID

ARGUMENTS
  ID        ID of the web link to move
  PARENTID  ID of the parent folder to move the web link into

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/web-links/move.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/web-links/move.js)_

## `box web-links:update ID`

Update a web link

```
USAGE
  $ box web-links:update ID

ARGUMENTS
  ID  ID of the web link to update

OPTIONS
  -d, --description=description          Description of the web link
  -h, --help                             Show CLI help
  -n, --name=name                        Name of the web link
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -u, --url=url                          The URL the web link points to. Must start with "http://" or "https://"
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/web-links/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/web-links/update.js)_

## `box webhooks`

List all webhooks

```
USAGE
  $ box webhooks

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box webhooks:list
```

_See code: [src/commands/webhooks/index.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/webhooks/index.js)_

## `box webhooks:create TARGETTYPE TARGETID`

Create a new webhook

```
USAGE
  $ box webhooks:create TARGETTYPE TARGETID

ARGUMENTS
  TARGETTYPE  (file|folder) Type of Box item to create a webhook on
  TARGETID    ID of the Box item to create a webhook on

OPTIONS
  -T, --triggers=triggers                (required) Triggers for webhook as a comma separated list, e.g.
                                         FILE.DELETED,FILE.PREVIEWED

  -a, --address=address                  (required) URL for your webhook handler

  -h, --help                             Show CLI help

  -s, --save                             Save report to default reports folder on disk

  -t, --token=token                      Provide a token to perform this call

  -v, --verbose                          Show verbose output, which can be helpful for debugging

  -y, --yes                              Automatically respond yes to all confirmation prompts

  --as-user=as-user                      Provide an ID for a user

  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --csv                                  Output formatted CSV

  --fields=fields                        Comma separated list of fields to show

  --id-only                              Return only an ID to output from this command

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/webhooks/create.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/webhooks/create.js)_

## `box webhooks:delete ID`

Delete a webhook

```
USAGE
  $ box webhooks:delete ID

ARGUMENTS
  ID  ID of the webhook to delete

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/webhooks/delete.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/webhooks/delete.js)_

## `box webhooks:get ID`

Get information about a webhook

```
USAGE
  $ box webhooks:get ID

ARGUMENTS
  ID  ID of the webhook to get

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/webhooks/get.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/webhooks/get.js)_

## `box webhooks:update ID`

Update a webhook

```
USAGE
  $ box webhooks:update ID

ARGUMENTS
  ID  ID of the webhook to update

OPTIONS
  -T, --triggers=triggers                Triggers for webhook, enter as comma separated list. For example:
                                         FILE.DELETED,FILE.PREVIEWED

  -a, --address=address                  URL for your webhook handler

  -h, --help                             Show CLI help

  -s, --save                             Save report to default reports folder on disk

  -t, --token=token                      Provide a token to perform this call

  -v, --verbose                          Show verbose output, which can be helpful for debugging

  -y, --yes                              Automatically respond yes to all confirmation prompts

  --as-user=as-user                      Provide an ID for a user

  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --csv                                  Output formatted CSV

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/webhooks/update.js](https://github.com/box/boxcli/blob/v2.1.0/src/commands/webhooks/update.js)_
<!-- commandsstop -->

Questions, Bugs, and Feature Requests?
--------------------------------------

[Browse the issues tickets](https://github.com/box/boxcli/issues)! Or, if that doesn't work, [file a new one](https://github.com/box/boxcli/issues/new) and someone will get back to you.   If you have general questions about the
Box API, you can post to the [Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum).


Contributing to the Box CLI
---------------------------

1. Clone this repo.
1. Run `npm install`.
1. Run `npm test` to ensure everything is working.
1. Make the changes you want in the `src/` directory.  Be sure to add corresponding tests
in the `test/` directory!
1. Create a pull request with your changes — we'll review it and help you get it merged.

For more information, please see [the Contribution guidelines](./CONTRIBUTING.md).

Copyright and License
---------------------

Copyright 2018 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This software includes third party libraries, which are distributed under their own licenses' terms;
see [LICENSE-THIRD-PARTY.txt](./LICENSE-THIRD-PARTY.txt) for details.
