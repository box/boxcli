<p align="center">
  <img src="https://github.com/box/sdks/blob/master/images/box-dev-logo.png" alt= “box-dev-logo” width="30%" height="50%">
</p>

# Box CLI

[![Project Status](http://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)
![Platform](https://img.shields.io/badge/node-18--22-blue)
[![Coverage](https://coveralls.io/repos/github/box/boxcli/badge.svg?branch=main)](https://coveralls.io/github/box/boxcli?branch=main)

The Box CLI is a user-friendly command line tool which allows both technical and non-technical users to leverage the Box API to perform routine or bulk actions. There is no need to write any code, as these actions are executed through a [set of commands](#command-topics).

Among other features, Box CLI includes the following functionality:
* [Bulk actions](docs/Bulk%20actions/README.md) - A csv file can be used to execute commands in bulk, and each row of the spreadsheet is treated as an individual API call.
* As-User header - Act on behalf of another user.
* Search API - Search for files and folders in your Box Enterprise account.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Getting Started](#getting-started)
    - [CLI Installation](#cli-installation)
      - [Windows & macOS Installers](#windows--macos-installers)
      - [Linux & Node install](#linux--node-install)
    - [Quick Login with the Official Box CLI App](#quick-login-with-the-official-box-cli-app)
    - [CLI and Server Authentication with JWT](#cli-and-server-authentication-with-jwt)
    - [Logout](#logout)
  - [Secure Storage](#secure-storage)
    - [What is Stored Securely](#what-is-stored-securely)
    - [Platform Support](#platform-support)
    - [Linux Installation](#linux-installation)
    - [Automatic Migration](#automatic-migration)
    - [Data Location](#data-location)
  - [Usage](#usage)
- [Command Topics](#command-topics)
  - [Questions, Bugs, and Feature Requests?](#questions-bugs-and-feature-requests)
  - [Versions](#versions)
    - [Supported Version](#supported-version)
    - [Version schedule](#version-schedule)
  - [Contributing to the Box CLI](#contributing-to-the-box-cli)
  - [Copyright and License](#copyright-and-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

### CLI Installation
Installers are available for Windows and macOS. However, the raw source-code is available if you would like to build the CLI in other environments.

#### Windows & macOS Installers
To install the latest CLI on your machine, download the latest `.exe` for Windows or `.pkg` for macOS for the [latest release](https://github.com/box/boxcli/releases).

#### Linux & Node install
Additionally, the CLI can be installed as a Node package on any platform, including Linux. For this to work, you will need to have [Node JS](https://nodejs.org/) installed on your machine.

```bash
npm install --global @box/cli
```

### Quick Login with the Official Box CLI App

After installation, run `box login` to sign in. You have two options:

**Option 1: Official Box CLI App**

No app setup required — just run:

```bash
box login -d
```

A browser window opens for authorization. Once you grant access, the CLI creates a new environment and you're ready to go. This option uses predefined scopes limited to content actions. See the [authentication docs](docs/authentication.md) for more details.

**Option 2: Your own custom OAuth app**

If you need custom scopes or specific configuration, run:

```bash
box login
```

You will be prompted to enter the Client ID and Client Secret of your own OAuth app created in the [Box Developer Console][dev-console]. See the [Box CLI with OAuth 2.0 guide][oauth-guide] and the [authentication docs](docs/authentication.md) for setup instructions.

### CLI and Server Authentication with JWT

Alternatively, to get started with the Box CLI, [download and install](#CLI-Installation) CLI, set up a Box application using Server Authentication with JWT and
download the JSON configuration file from the Configuration page of your platform app in the
[Box Developer Console][dev-console] following [JWT CLI Guide][jwt-guide].  Then, set up the CLI by pointing it to your configuration file:

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
[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
[jwt-guide]: https://developer.box.com/guides/cli/cli-docs/jwt-cli/

### Logout

To sign out from the current environment, run:

```bash
box logout
```

This revokes the access token on Box and clears the local token cache. For OAuth, run `box login` to authorize again. For CCG and JWT, a new token is fetched automatically on the next command. Use `-f` to skip the confirmation prompt, or `--on-revoke-failure=clear` / `--on-revoke-failure=abort` to control behavior when token revocation fails. See [`box logout`](docs/logout.md) for full details.

## Secure Storage

The Box CLI uses secure storage to protect your sensitive data:

### What is Stored Securely

- **Environment Configuration**: Client IDs, client secrets, and enterprise IDs, private keys and public keys
- **Authentication Tokens**: Access tokens and refresh tokens for all configured environments

### Platform Support

| Platform | Secure Storage | Installation Required |
|----------|---------------|----------------------|
| **macOS** | Keychain | Built-in |
| **Windows** | Credential Manager | Built-in |
| **Linux** | Secret Service (libsecret) | May require installation |

### Linux Installation

On Linux systems, you need to install `libsecret-1-dev` for secure storage.

**Note**: If libsecret is not installed, the CLI will automatically fall back to storing credentials in plain text files in `~/.box/`. You can still use the CLI, but for security, we recommend installing libsecret.

### Automatic Migration

When you upgrade to a version with secure storage support:
- Existing plaintext credentials are automatically read
- On the next token refresh or configuration update, credentials are migrated to secure storage
- Old plaintext files are automatically deleted after successful migration
- No manual action required!

### Data Location

- **Secure Storage**: Credentials stored in your OS keychain/credential manager
- **Fallback (if secure storage unavailable)**: `~/.box/box_environments.json` and `~/.box/{environment}_token_cache.json`

## Usage

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


<!-- commands -->
# Command Topics

* [`box ai`](docs/ai.md) - Sends an AI request to supported LLMs and returns an answer
* [`box autocomplete`](docs/autocomplete.md) - Display autocomplete installation instructions
* [`box collaboration-allowlist`](docs/collaboration-allowlist.md) - List collaboration allowlist entries
* [`box collaborations`](docs/collaborations.md) - Manage collaborations
* [`box collections`](docs/collections.md) - List your collections
* [`box comments`](docs/comments.md) - Manage comments on files
* [`box configure`](docs/configure.md) - Configure the Box CLI
* [`box device-pins`](docs/device-pins.md) - List all the device pins for your enterprise
* [`box events`](docs/events.md) - Get events
* [`box file-requests`](docs/file-requests.md) - Copies existing file request to new folder
* [`box files`](docs/files.md) - Manage files
* [`box folders`](docs/folders.md) - Manage folders
* [`box groups`](docs/groups.md) - List all groups
* [`box help`](docs/help.md) - Display help for the Box CLI
* [`box integration-mappings`](docs/integration-mappings.md) - List Slack integration mappings
* [`box legal-hold-policies`](docs/legal-hold-policies.md) - List legal hold policies
* [`box login`](docs/login.md) - Sign in with OAuth 2.0 and create a new environment (or update an existing one with --reauthorize).
* [`box logout`](docs/logout.md) - Revoke the access token and clear local token cache.
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
* [`box sign-templates`](docs/sign-templates.md) - List sign templates
* [`box storage-policies`](docs/storage-policies.md) - List storage policies
* [`box tasks`](docs/tasks.md) - Manage tasks
* [`box terms-of-service`](docs/terms-of-service.md) - List terms of services for your enterprise
* [`box tokens`](docs/tokens.md) - Get a token. Returns the service account token by default
* [`box trash`](docs/trash.md) - List all items in trash
* [`box update`](docs/update.md) - Update the BoxCLI using GitHub
* [`box users`](docs/users.md) - List all Box users
* [`box version`](docs/version.md)
* [`box watermarking`](docs/watermarking.md) - Apply a watermark on an item
* [`box web-links`](docs/web-links.md) - Manage web links
* [`box webhooks`](docs/webhooks.md) - List all webhooks

<!-- commandsstop -->

## Questions, Bugs, and Feature Requests?

[Browse the issues tickets](https://github.com/box/boxcli/issues)! Or, if that doesn't work, [file a new one](https://github.com/box/boxcli/issues/new) and someone will get back to you.   If you have general questions about the
Box API, you can post to the [Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum).


## Versions

We use a modified version of [Semantic Versioning](https://semver.org/) for all changes. See [version strategy](VERSIONS.md) for details which is effective from 30 July 2022.

### Supported Version

Only the current MAJOR version of SDK is supported. New features, functionality, bug fixes, and security updates will only be added to the current MAJOR version.

A current release is on the leading edge of our SDK development, and is intended for customers who are in active development and want the latest and greatest features.  Instead of stating a release date for a new feature, we set a fixed minor or patch release cadence of maximum 2-3 months (while we may release more often). At the same time, there is no schedule for major or breaking release. Instead, we will communicate one quarter in advance the upcoming breaking change to allow customers to plan for the upgrade. We always recommend that all users run the latest available minor release for whatever major version is in use. We highly recommend upgrading to the latest SDK major release at the earliest convenient time and before the EOL date.

### Version schedule

| Version | Supported Environments  | State     | First Release | EOL/Terminated |
|---------|-------------------------|-----------|---------------|----------------|
| 4       | Node.js >= 18           |           |               |                |
| 3       | Node.js >= 16           | Supported | 01 Feb 2022   | TBD            |
| 2       |                         | EOL       | 14 Dec 2018   | 01 Feb 2022    |
| 1       |                         | EOL       | 01 Nov 2017   | 14 Dec 2018    |

## Contributing to the Box CLI

1. Clone this repo.
1. Run `npm install`.
1. Run `npm test` to ensure everything is working.
1. Make the changes you want in the `src/` directory.  Be sure to add corresponding tests
in the `test/` directory!
1. Create a pull request with your changes — we'll review it and help you get it merged.

For more information, please see [the Contribution guidelines](./CONTRIBUTING.md).

## Copyright and License

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
