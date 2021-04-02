'use strict';

const BoxCommand = require('../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const BoxCLIError = require('../cli-error');
const chalk = require('chalk');
const CLITokenCache = require('../token-cache');
const utils = require('../util');
const BoxSDK = require('box-node-sdk');
const open = require('open');
const express = require('express');

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(OAuthLoginCommand);
		let environmentsObj = this.getEnvironments();
    let environmentName = 'oauth';
    let newEnvironment = {
			clientId: 'w8j8xjpheut2i5bn6mj7ois9qdlznk85',
      clientSecret: 'NqBbzIK9akWndtgdnkUaLQgleK6208iZ',
			name: environmentName,
			cacheTokens: true,
		};

    var sdk = new BoxSDK({
        clientID: 'w8j8xjpheut2i5bn6mj7ois9qdlznk85',
        clientSecret: 'NqBbzIK9akWndtgdnkUaLQgleK6208iZ'
    });

    const app = express();
    app.get('/callback', (req, res) => {
      // Will print the OAuth auth code
      sdk.getTokensAuthorizationCodeGrant(req.query.code, null, (err, tokenInfo) => {

        if (err) {
          // throw new BoxCLIError(err);
        }

        let tokenCache = new CLITokenCache(environmentName);
        tokenCache.write(tokenInfo, (storeErr) => {
      
          if (storeErr) {
            throw new BoxCLIError(storeErr);
          }
          
          environmentsObj.environments[environmentName] = newEnvironment;
          environmentsObj.default = environmentName;
          this.updateEnvironments(environmentsObj);
        });
      });
      res.end('You are now logged in!');
    });
    await app.listen(3000);

    // the URL to redirect the user to
    var authorize_url = sdk.getAuthorizeURL({
        response_type: 'code'
    });

    open(authorize_url);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description = 'Sign in with OAuth and set as default environment';

// OAuthLoginCommand.flags = {
// 	...BoxCommand.minFlags,
// 	'private-key-path': flags.string({
// 		description: 'Provide a path to application private key',
// 		parse: utils.parsePath,
// 	}),
// 	'set-as-current': flags.boolean({ description: 'Set this new environment as your current environment' }),
// 	name: flags.string({
// 		char: 'n',
// 		description: 'Set a name for the environment',
// 		default: 'default',
// 	})
// };

// OAuthLoginCommand.args = [
// 	{
// 		name: 'path',
// 		required: true,
// 		hidden: false,
// 		description: 'Provide a file path to configuration file'
// 	}
// ];

module.exports = OAuthLoginCommand;
