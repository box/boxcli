# Box CLI Bulk commands

The Box CLI provides a key element to Box's APIs with bulk operations, with the ability to support repetitive tasks in a single command with a local CSV file.

## Table of contents

- [Getting Started](#getting-started)
- [Available CSV Templates](#available-csv-templates)


## Getting Started

For most operations listed in our documentation, getting started is as easy as flagging the command with `--bulk-file-path` and supplying the CSV file path.

```bash
box files:download --bulk-file-path path/to/csv/file.csv --destination path/to/destination/folder
```

### Setup
1. Clone this github repo or download files from the [`/docs/Bulk actions`][csv-template] directory
    ```bash
    git clone https://github.com/box/boxcli.git
    ```
2. Create an OAuth Application following the [CLI Setup Quick Start][oauth-guide].
3. Navigate to a particular [CSV template][csv-template] in the and adjust it based on your data.



## Available CSV Templates

* [`box collaborations`](collaborations/collaborations.md) - Manage collaborations
* [`box files`](files/files.md) - Manage files
* [`box folders`](folders/folders.md) - Manage folders
* [`box groups`](groups/groups.md) - List all groups
* [`box metadata-templates`](metadata-templates/metadata-templates.md) - Get all metadata templates in your Enterprise
* [`box shared-links`](shared-links/shared-links.md) - Manage shared links
* [`box users`](users/users.md) - List all Box users
* [`box webhooks`](webhooks/webhooks.md) - List all webhooks


[oauth-guide]: https://developer.box.com/guides/cli/quick-start/
[csv-template]: https://github.com/box/boxcli/tree/main/docs/Bulk%20Actions
