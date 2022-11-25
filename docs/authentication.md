Authentication
==============

See the [OAuth 2 overview](https://developer.box.com/en/guides/authentication/) for a detailed
overview of how the Box API handles authentication.

- [Ways to Authenticate](#ways-to-authenticate)
  - [Developer Token](#developer-token)
  - [Server Auth with JWT](#server-auth-with-jwt)
  - [Server Auth with CCG](#server-auth-with-ccg)
  - [Traditional 3-Legged OAuth2](#traditional-3-legged-oauth2)

Ways to Authenticate
--------------------

### Developer Token

The fastest way to get started using the API is with developer tokens. A
developer token is simply a short-lived access token that cannot be refreshed
and can only be used with your own account. Therefore, they're only useful for
testing an app and aren't suitable for production. You can obtain a developer
token from your application's
[developer console][dev-console] page.

You can pass dev token to any cli command by using `--token` flag

```bash
box users:get --token myToken
```

[dev-console]: https://app.box.com/developers/console

### Server Auth with JWT

Server auth allows your application to authenticate itself with the Box API
for a given enterprise.  By default, your application has a
[Service Account](https://developer.box.com/en/guides/authentication/user-types/)
that represents it and can perform API calls.  The Service Account is separate
from the Box accounts of the application developer and the enterprise admin of
any enterprise that has authorized the app — files stored in that account are
not accessible in any other account by default, and vice versa.

If you generated your public and private keys automatically through the
[Box Developer Console][dev-console], you can use the JSON file created there
to configure the SDK and create an environment to make calls as the
Service Account:

```bash
box configure:environments:add /path/to/file/config.json 
```

Remember to set your current environment to the proper one

```bash
box configure:environments:set-current
```

### Server Auth with CCG

Server auth allows your application to authenticate itself with the Box API
for a given enterprise. 
Client Credentials Grant (CCG) allows you to authenticate by providing `clientId` and `clientSecret` and `enterpriseId` of your app.
By default, your application has a
[Service Account](https://developer.box.com/en/guides/authentication/user-types/)
that represents it and can perform API calls. The Service Account is separate
from the Box accounts of the application developer and the enterprise admin of
any enterprise that has authorized the app — files stored in that account are
not accessible in any other account by default, and vice versa.

Adding a CCG environment is a similar process to adding a JWT environment. However, you must manually create a configuration file. 
This file should contain `clientID`, `clientSecret` and `enterpriseId`. You can find this information in the [Box Developer Console][dev-console].

Example configuration file:

```json
{
  "boxAppSettings": {
    "clientID": "myClientId",
    "clientSecret": "mySecret"
  },
  "enterpriseID": "myEnterpriseId"
}
```

Then create a new environment with `--ccg-auth` flag and point it to the configuration file

```bash
box configure:environments:add /path/to/file/config.json --ccg-auth
```

Remember to set your current environment to the proper one

```bash
box configure:environments:set-current
```

An environment for making calls as an App User or Managed User can be created just like a Service Account environment. You need to pass an additional `--ccg-user` flag with `userId` as the value

```bash
box configure:environments:add /path/to/file/config.json --ccg-auth --ccg-user "USER_ID"
```

### Traditional 3-Legged OAuth2

Refer to the [OAuth Guide](https://developer.box.com/guides/cli/quick-start) if you want to use OAuth2.
