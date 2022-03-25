Box CLI
=======

[![Project Status](http://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)
[![Coverage](https://coveralls.io/repos/github/box/boxcli/badge.svg?branch=main)](https://coveralls.io/github/box/boxcli?branch=main)


A command line interface to the [Box Content API](https://developers.box.com/docs/).

Getting Started Docs: https://developer.box.com/guides/tooling/cli/quick-start/

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Command Topics](#command-topics)
- [Questions, Bugs, and Feature Requests?](#questions-bugs-and-feature-requests)
- [Versions](#versions)
  - [Supported Version](#supported-version)
  - [Version schedule](#version-schedule)
- [Contributing to the Box CLI](#contributing-to-the-box-cli)
- [Copyright and License](#copyright-and-license)

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

* [`box autocomplete`](docs/autocomplete.md) - Display autocomplete installation instructions
* [`box collaboration-allowlist`](docs/collaboration-allowlist.md) - List collaboration allowlist entries
* [`box collaborations`](docs/collaborations.md) - Manage collaborations
* [`box collections`](docs/collections.md) - List your collections
* [`box comments`](docs/comments.md) - Manage comments on files
* [`box configure`](docs/configure.md) - Configure the Box CLI
* [`box device-pins`](docs/device-pins.md) - List all the device pins for your enterprise
* [`box events`](docs/events.md) - Get events
* [`box files`](docs/files.md) - Manage files
* [`box folders`](docs/folders.md) - Manage folders
* [`box groups`](docs/groups.md) - List all groups
* [`box help`](docs/help.md) - Display help for the Box CLI
* [`box legal-hold-policies`](docs/legal-hold-policies.md) - List legal hold policies
* [`box login`](docs/login.md) - Sign in with OAuth and set a new environment
* [`box metadata-cascade-policies`](docs/metadata-cascade-policies.md) - List the metadata cascade policies on a folder
* [`box metadata-query`](docs/metadata-query.md) - Create a search using SQL-like syntax to return items that match specific metadata
* [`box metadata-templates`](docs/metadata-templates.md) - Get all metadata templates in your Enterprise
* [`box oss`](docs/oss.md) - Print a list of open-source licensed packages used in the Box CLI
* [`box recent-items`](docs/recent-items.md) - List information about files accessed in the past 90 days up to a 1000 items
* [`box request`](docs/request.md) - Manually specify a Box API request
* [`box retention-policies`](docs/retention-policies.md) - List all retention policies for your enterprise
* [`box search`](docs/search.md) - Search for files and folders in your Enterprise
* [`box shared-links`](docs/shared-links.md) - Manage shared links
* [`box sign-requests`](docs/sign-requests.md) - List sign requests
* [`box storage-policies`](docs/storage-policies.md) - List storage policies
* [`box tasks`](docs/tasks.md) - Manage tasks
* [`box terms-of-service`](docs/terms-of-service.md) - List terms of services for your enterprise
* [`box tokens`](docs/tokens.md) - Get a token. Returns the service account token by default
* [`box trash`](docs/trash.md) - List all items in trash
* [`box users`](docs/users.md) - List all Box users
* [`box watermarking`](docs/watermarking.md) - Apply a watermark on an item
* [`box web-links`](docs/web-links.md) - Manage web links
* [`box webhooks`](docs/webhooks.md) - List all webhooks

<!-- commandsstop -->

Questions, Bugs, and Feature Requests?
--------------------------------------

[Browse the issues tickets](https://github.com/box/boxcli/issues)! Or, if that doesn't work, [file a new one](https://github.com/box/boxcli/issues/new) and someone will get back to you.   If you have general questions about the
Box API, you can post to the [Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum).


Versions
---------------------------

We use a modified version of [Semantic Versioning](https://semver.org/) for all changes. See [version strategy](VERSIONS.md) for details which is effective from 30 July 2022.

### Supported Version

Only the current MAJOR version of SDK is supported. New features, functionality, bug fixes, and security updates will only be added to the current MAJOR version.

A current release is on the leading edge of our SDK development, and is intended for customers who are in active development and want the latest and greatest features.  Instead of stating a release date for a new feature, we set a fixed minor or patch release cadence of maximum 2-3 months (while we may release more often). At the same time, there is no schedule for major or breaking release. Instead, we will communicate one quarter in advance the upcoming breaking change to allow customers to plan for the upgrade. We always recommend that all users run the latest available minor release for whatever major version is in use. We highly recommend upgrading to the latest SDK major release at the earliest convenient time and before the EOL date.

### Version schedule

| Version | Supported Environments | State     | First Release | EOL/Terminated |
|---------|------------------------|-----------|---------------|----------------|
| 3       | Node.js 12+            | Supported | 01 Feb 2022   | TBD            |
| 2       |                        | EOL       | 14 Dec 2018   | 01 Feb 2022    |
| 1       |                        | EOL       | 01 Nov 2017   | 14 Dec 2018    |

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
