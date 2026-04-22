`box login`
===========

Sign in with OAuth 2.0 and create a new environment (or update an existing one with --reauthorize).

Login options:

  (1) Official Box CLI App
      No app setup needed. Use --default-box-app (-d) to skip the prompt.

  (2) Your own Platform OAuth App
      Enter your Client ID and Client Secret when prompted. Use --platform-app to skip the prompt.

Quickstart: run "box login -d" to sign in immediately. A browser window will open for authorization. Once access is granted, the environment is created and set as default — you can start running commands right away.

Headless environments: use --code (-c) if no browser is available. The CLI will display an authorize URL — visit it in an external browser, authorize and grant access to the app, then provide the state and authorization code back to the CLI when prompted.

* [`box login`](#box-login)

## `box login`

Sign in with OAuth 2.0 and create a new environment (or update an existing one with --reauthorize).

```
USAGE
  $ box login [--no-color] [-h] [-v] [-q] [-c] [-p <value>] [-d | --platform-app] [-r -n <value>] [-i]

FLAGS
  -c, --code
      Manually provide state and authorization code instead of using a local callback server. Use this in headless
      environments where no browser is available — the CLI will display an authorize URL to visit externally.

  -d, --default-box-app
      Use the Official Box CLI app flow and proceed directly to authorization.
      This is the fastest way to integrate with Box — no app creation in the Developer Console is needed.
      Scopes are limited to content actions, allowing you to effectively operate with your files and folders.
      This flow requires a local callback server on a supported port (3000, 3001, 4000, 5000, or 8080). The default port
      is 3000; use --port to change it.

  -h, --help
      Show CLI help

  -i, --incognito-browser
      Visit authorize URL with incognito browser

  -n, --name=<value>
      [default: oauth] Set a name for the environment

  -p, --port=<value>
      [default: 3000] Set the port number for the local OAuth callback server

  -q, --quiet
      Suppress any non-error output to stderr

  -r, --reauthorize
      Reauthorize the existing environment with given `name`

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  --no-color
      Turn off colors for logging

  --platform-app
      Skip the authentication method prompt and go directly to Platform App setup.
      You will be prompted for Client ID and Client Secret.

DESCRIPTION
  Sign in with OAuth 2.0 and create a new environment (or update an existing one with --reauthorize).

  Login options:

  (1) Official Box CLI App
  No app setup needed. Use --default-box-app (-d) to skip the prompt.

  (2) Your own Platform OAuth App
  Enter your Client ID and Client Secret when prompted. Use --platform-app to skip the prompt.

  Quickstart: run "box login -d" to sign in immediately. A browser window will open for authorization. Once access is
  granted, the environment is created and set as default — you can start running commands right away.

  Headless environments: use --code (-c) if no browser is available. The CLI will display an authorize URL — visit it in
  an external browser, authorize and grant access to the app, then provide the state and authorization code back to the
  CLI when prompted.
```

_See code: [src/commands/login.js](https://github.com/box/boxcli/blob/v4.8.0-beta/src/commands/login.js)_
