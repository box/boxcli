`box ai`
========

Sends a request to supported LLMs using Box AI. This is intended for direct use, not by AI agents.

* [`box ai:ask`](#box-aiask)
* [`box ai:extract`](#box-aiextract)
* [`box ai:extract-structured`](#box-aiextract-structured)
* [`box ai:text-gen`](#box-aitext-gen)

## `box ai:ask`

Sends a request to supported LLMs using Box AI. This is intended for direct use, not by AI agents.

```
USAGE
  $ box ai:ask --prompt <value> --items <value>... [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--ai-agent <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --ai-agent=<value>           AI agent configuration as JSON. Example:
                                   {"type":"ai_agent_ask","basic_text":{"model":"azure__openai__gpt_4o_mini"}}
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --items=<value>...           (required) Items for the AI request. Format: id=FILE_ID,type=file (or
                                   content=TEXT,type=file). Supported keys: id, type, content.
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --prompt=<value>             (required) The prompt for the AI request
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends a request to supported LLMs using Box AI. This is intended for direct use, not by AI agents.

EXAMPLES
  $ box ai:ask --items=id=12345,type=file --prompt "What is the status of this document?"
```

_See code: [src/commands/ai/ask.js](https://github.com/box/boxcli/blob/v4.6.0/src/commands/ai/ask.js)_

## `box ai:extract`

Sends an AI request to supported Large Language Models (LLMs) and extracts metadata in form of key-value pairs. This is intended for direct use, not by AI agents.

```
USAGE
  $ box ai:extract --prompt <value> --items <value>... [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--ai-agent <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --ai-agent=<value>           AI agent configuration as JSON. Example: {"type":"ai_agent_extract","basic_text":{"mo
                                   del":"azure__openai__gpt_4o_mini","prompt_template":"Answer the question based on
                                   {content}"}}
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --items=<value>...           (required) Items for extraction. Format: id=FILE_ID,type=file (or
                                   content=TEXT,type=file). Supported keys: id, type, content.
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --prompt=<value>             (required) The prompt provided to a Large Language Model (LLM) in the request.
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported Large Language Models (LLMs) and extracts metadata in form of key-value pairs. This
  is intended for direct use, not by AI agents.

EXAMPLES
  $ box ai:extract --items=id=12345,type=file --prompt "firstName, lastName, location, yearOfBirth, company"

  $ box ai:extract --prompt "firstName, lastName, location, yearOfBirth, company" --items "id=12345,type=file" --ai-agent '{"type":"ai_agent_extract","basic_text":{"model":"azure__openai__gpt_4o_mini"}}'
```

_See code: [src/commands/ai/extract.js](https://github.com/box/boxcli/blob/v4.6.0/src/commands/ai/extract.js)_

## `box ai:extract-structured`

Sends an AI request to supported Large Language Models (LLMs) and returns extracted metadata as a set of key-value pairs. For this request, you either need a metadata template or a list of fields you want to extract. Input is either a metadata template or a list of fields to ensure the structure. This is intended for direct use, not by AI agents.

```
USAGE
  $ box ai:extract-structured --items <value>... [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>...] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--metadata-template <value>] [--ai-agent <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --ai-agent=<value>           AI agent configuration as JSON. Example: {"type":"ai_agent_extract_structured","basic
                                   _text":{"model":"azure__openai__gpt_4o_mini","prompt_template":"Answer the question
                                   based on {content}"}}
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>...          Fields to extract from the provided items. Use options=VALUE1;VALUE2 for multiSelect
                                   fields.
      --items=<value>...           (required) Items for structured extraction. Format: id=FILE_ID,type=file (or
                                   content=TEXT,type=file). Supported keys: id, type, content.
      --json                       Output formatted JSON
      --metadata-template=<value>  The metadata template containing the fields to extract.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported Large Language Models (LLMs) and returns extracted metadata as a set of key-value
  pairs. For this request, you either need a metadata template or a list of fields you want to extract. Input is either
  a metadata template or a list of fields to ensure the structure. This is intended for direct use, not by AI agents.

EXAMPLES
  $ box ai:extract-structured --items="id=12345,type=file" --fields "key=hobby,type=multiSelect,description=Person hobby,prompt=What is your hobby?,displayName=Hobby,options=Guitar;Books"

  $ box ai:extract-structured --items="id=12345,type=file" --metadata-template="type=metadata_template,scope=enterprise,template_key=test" --ai-agent '{"type":"ai_agent_extract_structured","basic_text":{"model":"azure__openai__gpt_4o_mini","prompt_template":"Answer using the provided content"}}'
```

_See code: [src/commands/ai/extract-structured.js](https://github.com/box/boxcli/blob/v4.6.0/src/commands/ai/extract-structured.js)_

## `box ai:text-gen`

Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text. This is intended for direct use, not by AI agents.

```
USAGE
  $ box ai:text-gen --items <value>... --prompt <value> [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--dialogue-history <value>...]

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --dialogue-history=<value>...  The history of prompts and answers previously passed to the LLM.
      --fields=<value>               Comma separated list of fields to show
      --items=<value>...             (required) Items for text generation. Format: id=FILE_ID,type=file (or
                                     content=TEXT,type=file). Supported keys: id, type, content. Exactly one item is
                                     supported.
      --json                         Output formatted JSON
      --no-color                     Turn off colors for logging
      --prompt=<value>               (required) The prompt for the AI request
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text. This is
  intended for direct use, not by AI agents.

EXAMPLES
  $ box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this document?"
```

_See code: [src/commands/ai/text-gen.js](https://github.com/box/boxcli/blob/v4.6.0/src/commands/ai/text-gen.js)_
