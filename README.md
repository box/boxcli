# Box CLI
## Current Version: 1.1.1
## [Download the latest version of the CLI](https://developer.box.com/docs/installation-and-setup)
## Prerequisites for Building from Source
* [.Net Core SDK v2.0](https://www.microsoft.com/net/core)

### Steps to Build from Source
1. Clone, fork, or download this Github repo.
2. Navigate to the `BoxCLI/BoxCLI` folder
3. Run the following command to create a build:
    * `dotnet build -r <target-runtime>`
    * Replace `<target-runtime>` with the OS you're building for, such as osx.10.12-x64
    * The binary will be located in `./bin/Debug/netcoreapp2.0/<target-runtime>/box`
4. If you're building for production, run the following command instead:
    * `dotnet publish --configuration Release --runtime <target-runtime>`
    * The binary will now be located in `./bin/Release/netcoreapp2.0/<target-runtime>/publish`
    * You'll need the entire contents of the publish folder

Support
-------

Need to contact us directly?
* [Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum).

Copyright and License
---------------------

Copyright 2017 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
