`box ai`
========

Sends an AI request to supported LLMs and returns an answer

* [`box ai:ask`](#box-aiask)
* [`box ai:extract`](#box-aiextract)
* [`box ai:extract-structured`](#box-aiextract-structured)
* [`box ai:text-gen`](#box-aitext-gen)

## `box ai:ask`

Sends an AI request to supported LLMs and returns an answer

```
USAGE
  $ box ai:ask --prompt <value> --items <value>... [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --items=<value>...           (required) The items for the AI request
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --prompt=<value>             (required) The prompt for the AI request
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported LLMs and returns an answer

EXAMPLES
  $ box ai:ask --items=id=12345,type=file --prompt "What is the status of this document?"
```

_See code: [src/commands/ai/ask.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/ai/ask.js)_

## `box ai:extract`

Sends an AI request to supported Large Language Models (LLMs) and extracts metadata in form of key-value pairs

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
      --ai-agent=<value>           The AI agent to be used for the extraction, provided as a JSON string. Example:
                                   {"type": "ai_agent_extract", "basic_text": {"model": "azure__openai__gpt_4o_mini",
                                   "prompt_template": "Answer the question based on {content}"}}
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --items=<value>...           (required) The items that LLM will process.
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --prompt=<value>             (required) The prompt provided to a Large Language Model (LLM) in the request.
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported Large Language Models (LLMs) and extracts metadata in form of key-value pairs

EXAMPLES
  $ box ai:extract --items=id=12345,type=file --prompt "firstName, lastName, location, yearOfBirth, company"

  $ box ai:extract --prompt "firstName, lastName, location, yearOfBirth, company" --items "id=12345,type=file" --ai-agent '{"type":"ai_agent_extract","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"}}}'
```

_See code: [src/commands/ai/extract.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/ai/extract.js)_

## `box ai:extract-structured`

Sends an AI request to supported Large Language Models (LLMs) and returns extracted metadata as a set of key-value pairs. For this request, you either need a metadata template or a list of fields you want to extract. Input is either a metadata template or a list of fields to ensure the structure.

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
      --ai-agent=<value>           The AI agent to be used for the structured extraction, provided as a JSON string.
                                   Example: {"type": "ai_agent_extract_structured", "basic_text": {"model":
                                   "azure__openai__gpt_4o_mini", "prompt_template": "Answer the question based on
                                   {content}"}}
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>...          The fields to be extracted from the provided items.
      --items=<value>...           (required) The items that LLM will process.
      --json                       Output formatted JSON
      --metadata-template=<value>  The metadata template containing the fields to extract.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported Large Language Models (LLMs) and returns extracted metadata as a set of key-value
  pairs. For this request, you either need a metadata template or a list of fields you want to extract. Input is either
  a metadata template or a list of fields to ensure the structure.

EXAMPLES
  $ box ai:extract-structured --items="id=12345,type=file" --fields "key=hobby,type=multiSelect,description=Person hobby,prompt=What is your hobby?,displayName=Hobby,options=Guitar;Books"

  $ box ai:extract-structured --items="id=12345,type=file" --metadata-template="type=metadata_template,scope=enterprise,template_key=test" --ai-agent '{"type":"ai_agent_extract_structured","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"}}}'
```

_See code: [src/commands/ai/extract-structured.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/ai/extract-structured.js)_

## `box ai:text-gen`

Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.

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
      --items=<value>...             (required) The items to be processed by the LLM, often files. The array can include
                                     exactly one element.
      --json                         Output formatted JSON
      --no-color                     Turn off colors for logging
      --prompt=<value>               (required) The prompt for the AI request
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.

EXAMPLES
  $ box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this document?"
```

_See code: [src/commands/ai/text-gen.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/ai/text-gen.js)_
