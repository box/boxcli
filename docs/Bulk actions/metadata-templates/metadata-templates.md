`box metadata-templates`
========================

Get all metadata templates in your Enterprise

* [`box metadata-templates:create`](#box-metadata-templatescreate)
* [`box metadata-templates:cascade`](#box-metadata-templatescascade)


## `box metadata-templates:create`

Create a new metadata template

```
USAGE
  $ box metadata-templates:create

EXAMPLE
  box metadata-templates:create --bulk-file-path path/to/csv/metadata-templates-create.csv
```

- _See documentation [metadata-templates.md](https://github.com/box/boxcli/blob/main/docs/metadata-templates.md#box-metadata-templatescreate)_
- _See example: [metadata-templates-create.csv](metadata-templates-create.csv)_

## `box metadata-templates:cascade TEMPLATEKEY`

Create a new metadata cascade policy on a folder

```
ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to cascade

USAGE
  $ box metadata-templates:cascade

EXAMPLE
  box metadata-templates:cascade --bulk-file-path path/to/csv/metadata-templates-create.csv
```

- _See documentation [metadata-templates.md](https://github.com/box/boxcli/blob/main/docs/metadata-templates.md#box-metadata-templatescascade-templatekey)_
- _See example: [metadata-templates-cascade.csv](metadata-templates-cascade.csv)_
