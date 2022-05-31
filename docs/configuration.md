# Configuration
To configure Box CLI the method [configure].
You can have many environents that define how you authinticate to box but there is only one configuration shared across them.
To see current configuration run:
```commandline
 box configure:settings
```

You can also configure CLI settings by changing the `~/.box/settings.json` file.

Topics covered in this guide include:
 - [Using `settings` command](#using-settings-command)
   - [Setting up proxy](#setting-up-proxy)
 - [Using configuration file](#using-configuration-file)
   - [Configure how client retries calls and handles timeouts](#configure-how-client-retries-calls-and-handles-timeouts)
   - [Configure base URL](#configure-base-url)


# Using `settings` command
## Setting up proxy

To configure proxy you will need:
* Proxy URL, which should contain the protocol, url, and port (i.e. http://sample.proxyurl.com:80)
* Username and Password if required

Use [configure] command to setup proxy:
```commandline
box configure:settings --enable-proxy\
 --proxy-url=proxy-url\
 --proxy-username=proxy-username\
 --proxy-password=proxy-password
```

The output should contain proxy settings:
```commandline
Proxy:
    URL: proxy-url
    Username: proxy-username
    Password: proxy-password
```

Now every call will be using configured proxy. To disable proxy settings run:
```commandline
box configure:settings --no-enable-proxy
```

Proxy settings are not removed from your configuration, this command disables proxy setting by CLI.
You can enable proxy once again (will be using prevous settings) with:
```commandline
box configure:settings --enable-proxy
```

# Using configuration file
You can find configuration file here `~/.box/settings.json`. This file will be created by running [configure] command 
and changing any setting. 

```json
{
  "boxReportsFolderPath": "path_where_to_store_reports",
  "boxReportsFileFormat": "txt",
  "boxDownloadsFolderPath": "path_where_to_store_downloads",
  "outputJson": false,
  "enableProxy": false,
  "proxy": {
	"url": null,
	"username": null,
	"password": null
  }
}
```

- `boxReportsFolderPath`: the folder path to store reports
- `boxReportsFileFormat`: the file format for generated reports, possible values: `csv`, `json`, `txt`
- `boxDownloadsFolderPath`: folder path for the downloads folder
- `outputJson`: sets JSON output for all commands, possible values: `true`, `false`
- `enableProxy`: Enable (`true`) or disable (`false`) proxy
- `proxy.url`: proxy url, which should contain the protocol, url, and port (i.e. http://sample.proxyurl.com:80)
- `proxy.username`: username for proxy
- `proxy.password`: password for proxy

## Configure how client retries calls and handles timeouts

You can confugure how many retries, how long to wait between retries or upload timeout. The default values are already
defined for the CLI but if you want to change default behaviour add those options to `settings.json`

```json
{
  "numMaxRetries": 3,
  "retryIntervalMS": 3000,
  "uploadRequestTimeoutMS": 90000
}
```

- `numMaxRetries`: the maximum number of retries when API request fails. Default value is `5`.

- `retryIntervalMS`: is used to calculate the wait time between retries. It is a number of miliseconds. SDK
uses `Exponential backoff` algorithm to calculate the wait time. Default value is `2000` ms.

- `uploadRequestTimeoutMS`: the timeout after which an upload request is aborted Default value is `60000` ms.

### Configure base URL

The Base Url is the URL that is used by the SDK to access Box. The default base URLs are already defined for the CLI but
if you want to change default behaviour add those options to `settings.json`

```json
{
  "apiRootURL": "https://my.company.url.com",
  "uploadAPIRootURL": "https://my.company.url.com/upload",
  "authorizeRootURL": "https://my.company.url.com/authorize"
}
```

The `apiRootURL` sets to what URL all API calls will be directed.

The `uploadAPIRootURL` is used to configure the base URL used while uploading files.

The `authorizeRootURL` is used to configure the base URL used to obtain OAuth2 authorization tokens.

[configure]: configure.md
