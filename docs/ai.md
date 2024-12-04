`box ai`
========

Sends an AI request to supported LLMs and returns an answer

- [`box ai`](#box-ai)
  - [`box ai:ask`](#box-aiask)
  - [`box ai:text-gen`](#box-aitext-gen)

## `box ai:ask`

Sends an AI request to supported LLMs and returns an answer

```
USAGE
  $ box ai:ask

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --items=items                          (required) The items for the AI request
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --prompt=prompt                        (required) The prompt for the AI request
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box ai:ask --items=id=12345,type=file --prompt "What is the status of this document?"
```

_See code: [src/commands/ai/ask.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/ai/ask.js)_

## `box ai:text-gen`

Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.

```
USAGE
  $ box ai:text-gen

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --dialogue-history=dialogue-history    The history of prompts and answers previously passed to the LLM.
  --fields=fields                        Comma separated list of fields to show

  --items=items                          (required) The items to be processed by the LLM, often files. The array can
                                         include exactly one element.

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --prompt=prompt                        (required) The prompt for the AI request

  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in 
  review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this 
  document?"
```

_See code: [src/commands/ai/text-gen.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/ai/text-gen.js)_
