Authentication
==============

See the [OAuth 2 overview](https://developer.box.com/en/guides/authentication/) for a detailed
overview of how the Box API handles authentication.

- [Ways to Authenticate](#ways-to-authenticate)
  - [Developer Token](#developer-token)
  - [Server Auth with JWT](#server-auth-with-jwt)
  - [Server Auth with CCG](#server-auth-with-ccg)
  - [OAuth 2.0 Login (`box login`)](#oauth-20-login-box-login)
    - [Option 1: Official Box CLI App (Recommended)](#option-1-official-box-cli-app-recommended)
    - [Option 2: Your Own Custom App](#option-2-your-own-custom-app)
    - [Supported Ports](#supported-ports)
    - [Additional Flags](#additional-flags)
    - [Reauthorize OAuth2](#reauthorize-oauth2)


Ways to Authenticate
--------------------

### Developer Token

A developer token is a token that you can generate directly from the [Box Developer Console][dev-console]. It provides a quick way to test API calls without setting up a full authentication flow.

[dev-console]: https://app.box.com/developers/console

**Key characteristics:**

- Cannot be refreshed.
- Scoped to your own account only.
- Intended for **development and testing** — not suitable for production use.

**Usage** — pass the token to any CLI command with the `--token` flag:

```bash
box users:get --token <DEVELOPER_TOKEN>
```

> **Tip:** You can generate a new developer token at any time from the **Configuration** tab of your application in the [Developer Console][dev-console].

### Server Auth with JWT

JSON Web Token (JWT) authentication allows your application to authenticate as a [Service Account](https://developer.box.com/platform/user-types#service-account) without requiring user interaction. This is ideal for server-to-server integrations, automated workflows, and backend services.

**Key characteristics:**

- The application authenticates on behalf of a **Service Account**, which is separate from any individual user's account.
- Files stored in the Service Account are not accessible from other accounts by default, and vice versa.
- Requires a public/private key pair, which can be generated automatically in the [Developer Console][dev-console].

**Setup:**

1. In the [Developer Console][dev-console], create or open an application that uses **JWT** authentication.
2. Generate a public/private key pair (or upload your own). This produces a JSON configuration file.
3. Download the configuration file and add it as an environment:

```bash
box configure:environments:add /path/to/config.json --name 'YOUR_ENVIRONMENT_NAME'
```

4. If you have multiple environments, set the active one:

```bash
box configure:environments:set-current
```

After setup, all CLI commands will authenticate using the JWT credentials from the selected environment.

### Server Auth with CCG

Client Credentials Grant (CCG) authentication allows your application to authenticate as a [Service Account](https://developer.box.com/platform/user-types#service-account) using a **Client ID**, **Client Secret**, and **Enterprise ID**. Like JWT, this method is designed for server-to-server communication and does not require user interaction.

**Key characteristics:**

- The application authenticates on behalf of a **Service Account**, which is separate from any individual user's account.
- Files stored in the Service Account are not accessible from other accounts by default, and vice versa.
- No key pair generation is needed — authentication relies on the Client ID and Client Secret only.

**Setup:**

1. In the [Developer Console][dev-console], create or open an application that uses **Client Credentials Grant** authentication.
2. Create a JSON configuration file with the following structure:

```json
{
  "boxAppSettings": {
    "clientID": "your_client_id",
    "clientSecret": "your_client_secret"
  },
  "enterpriseID": "your_enterprise_id"
}
```

> **Tip:** You can find the `clientID` and `clientSecret` values in the **Configuration** tab, and the `enterpriseID` in the **General Settings** tab of your application in the [Developer Console][dev-console].

3. Add the environment with the `--ccg-auth` flag:

```bash
box configure:environments:add /path/to/config.json --ccg-auth --name 'YOUR_ENVIRONMENT_NAME'
```

4. If you have multiple environments, set the active one:

```bash
box configure:environments:set-current
```

**Authenticating as a specific user:**

By default, CCG authenticates as the Service Account. To make API calls as an App User or Managed User instead, pass the `--ccg-user` flag with the user's ID:

```bash
box configure:environments:add /path/to/config.json --ccg-auth --ccg-user "USER_ID"
```

### OAuth 2.0 Login (`box login`)

The `box login` command authenticates you with Box using OAuth 2.0. It starts a local callback server, opens your browser for authorization, and stores the resulting tokens in a named environment.

When you run `box login`, the CLI presents three options: the **Official Box CLI App**, a **custom app** you create yourself, or **quit** (`q`) to exit. You can either choose interactively or skip the selection entirely using the `--default-box-app` (`-d`) flag. You can also paste a Client ID directly at the prompt — any input between 16 and 99 characters is treated as a Client ID.

#### Option 1: Official Box CLI App

This is the fastest way to get started with Box CLI. No app creation in the Box Developer Console is required — just run the command and authorize.

**Interactive selection** — run `box login` and choose option `1` to use the built-in app, `2` for a custom app, or `q` to quit:

```bash
box login
# Choose [1] for Official Box CLI App, [2] for custom app, or [q] to quit.
```

**Skip the prompt** — use the `--default-box-app` (or `-d`) flag to go directly to authorization:

```bash
box login --default-box-app
```

```bash
box login -d
```

> **Note:** The Official Box CLI App uses scopes limited to content actions, which allows you to effectively manage your files and folders. If you need broader scopes (e.g., managing users, groups, or enterprise settings), use your own custom app instead.

#### Option 2: Your Own Custom App

If you need customized scopes or a dedicated application, you can log in with your own OAuth app. When prompted, enter the **Client ID** and **Client Secret** from your application's configuration.

Before running the command, set up the app in the [Box Developer Console](https://cloud.app.box.com/developers/console):

1. Select an application with **OAuth 2.0 user authentication** (or create a new Custom App).
2. In the **Configuration** tab, set the **Redirect URI** to `http://localhost:3000/callback` (adjust the port if you use a different `--port` value).
3. Click **Save Changes**.

Then log in:

```bash
box login
# Choose [2] when prompted, then enter your Client ID and Client Secret.
# Alternatively, paste your Client ID directly at the prompt (any input between 16 and 99 characters is recognized as a Client ID).
```

For a step-by-step walkthrough, see the [Quickstart Guide](https://developer.box.com/guides/tooling/cli/quick-start/).

#### Supported Ports

The `box login` command starts a local callback server to receive the OAuth redirect. You can control the port with the `--port` (`-p`) flag. The default port is **3000**.

When using the **Official Box CLI App**, only the following ports are supported:

| Port | Command |
|------|---------|
| 3000 | `box login -d` (default) |
| 3001 | `box login -d --port 3001` |
| 4000 | `box login -d --port 4000` |
| 5000 | `box login -d --port 5000` |
| 8080 | `box login -d --port 8080` |

When using your own custom app, any port can be used — just make sure the **Redirect URI** in the Developer Console matches `http://localhost:<port>/callback`.

#### Additional Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--default-box-app` | `-d` | Use the Official Box CLI App and proceed directly to authorization. |
| `--port <number>` | `-p` | Set the port for the local callback server. Default: `3000`. |
| `--name <string>` | `-n` | Set a name for the environment. Default: `oauth`. |
| `--reauthorize` | `-r` | Reauthorize an existing environment (requires `--name`). |
| `--code` | `-c` | Manually visit the authorize URL and input the auth code. |
| `--incognito-browser` | `-i` | Open the authorize URL in a private/incognito browser window. |

#### Reauthorize OAuth2

After each successful OAuth 2.0 authorization, a pair of tokens is generated: an **Access Token** and a **Refresh Token**.

- The [Access Token](https://developer.box.com/guides/authentication/tokens/access-tokens/) represents the authenticated user and is valid for **60 minutes**.
- The [Refresh Token](https://developer.box.com/guides/authentication/tokens/refresh/) is used to obtain a new Access Token. It is valid for **1 use within 60 days**.

If both tokens expire, you will see the following error:

```
Your refresh token has expired.
Please run this command "box login --name <ENVIRONMENT_NAME> --reauthorize" to reauthorize selected environment and then run your command again.
```

To reauthorize, run:

```bash
box login --name "ENVIRONMENT_NAME" --reauthorize
```

The `--reauthorize` flag retrieves the existing `clientID` and `clientSecret` from the stored environment, so you do not need to enter them again. After a successful login, the environment is updated and set as the default.

You can also combine `--reauthorize` with `--default-box-app` to switch an existing environment to the Official Box CLI App:

```bash
box login --name "ENVIRONMENT_NAME" --reauthorize --default-box-app
```
