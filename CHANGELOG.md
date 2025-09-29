# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.3.1](https://github.com/box/boxcli/compare/v4.3.0...v4.3.1) (2025-09-29)


### Bug Fixes

* fix multi item mode in `ai:ask` command ([#593](https://github.com/box/boxcli/issues/593)) ([5081d43](https://github.com/box/boxcli/commit/5081d432d8ded16c8bf759352d28be0214fbe4ec))

## [4.3.0](https://github.com/box/boxcli/compare/v4.2.0...v4.3.0) (2025-08-07)


### New Features and Enhancements

* add agent support to `ai:ask` command ([#589](https://github.com/box/boxcli/issues/589)) ([095f411](https://github.com/box/boxcli/commit/095f4110274f67c5b1024de49a256b5bbe35cf18))

### Bug Fixes

* Fix support metadata query array ([#583](https://github.com/box/boxcli/issues/583)) ([112db16](https://github.com/box/boxcli/commit/112db160230e5bb75f84e44cb86a8372341dd8ad))
* Remove `description` flag from folders:create command ([#587](https://github.com/box/boxcli/issues/587)) ([adca76b](https://github.com/box/boxcli/commit/adca76b5fb03f62daf2104500b87f8a962382a35))

## [4.2.0](https://github.com/box/boxcli/compare/v4.1.0...v4.2.0) (2025-06-20)


### New Features and Enhancements

* Setup proxy for Box CLI with TS SDK ([#577](https://github.com/box/boxcli/issues/577)) ([ec42077](https://github.com/box/boxcli/commit/ec4207715360cc284574e1cbb573586218379517))
* Support `owned-by` flag when moving folder ([#580](https://github.com/box/boxcli/issues/580)) ([2ec8e7f](https://github.com/box/boxcli/commit/2ec8e7fcf241dcd2c5841b8912e178e2384db426))
* Support integration mappings for Teams ([#579](https://github.com/box/boxcli/issues/579)) ([163a367](https://github.com/box/boxcli/commit/163a36727c5f76b0e3b1c36049b3abae50148eb6))
* Support metadata query with array ([#581](https://github.com/box/boxcli/issues/581)) ([6750708](https://github.com/box/boxcli/commit/675070856eac6d06f2091203f4f19e41055dd97d))

## [4.1.0](https://github.com/box/boxcli/compare/v4.0.1...v4.1.0) (2025-05-15)


### New Features and Enhancements

* Support AI Extract endpoints ([#574](https://github.com/box/boxcli/issues/574)) ([0b4ff6b](https://github.com/box/boxcli/commit/0b4ff6b63c8707c6842f3812d2a69071d195b799))

### Bug Fixes

* Remove invalid `process.stderr.setEncoding` call ([486779e](https://github.com/box/boxcli/commit/486779ee3b8403805286b7ae6d3ab5c802c6f948)), closes [#571](https://github.com/box/boxcli/issues/571)

### [4.0.1](https://github.com/box/boxcli/compare/v4.0.0...v4.0.1) (2025-03-07)


### Bug Fixes

* Fix `configure:environments:set-current` command ([#568](https://github.com/box/boxcli/issues/568)) ([dc0905f](https://github.com/box/boxcli/commit/dc0905f7b85a32373e93ec7726afb261223e9fac))

## [4.0.0](https://github.com/box/boxcli/compare/v3.16.0...v4.0.0) (2025-01-28)


### ⚠ BREAKING CHANGES

* Ended support for Node.js 14 & 16; added support for Node.js 20 & 22 ([#548](https://github.com/box/boxcli/issues/548)) ([22179ec](https://github.com/box/boxcli/commit/22179ecfc68b8dd315339ac204a7274d712d5a8e))

### New Features and Enhancements

* Incognito browser option for box login ([#561](https://github.com/box/boxcli/issues/561)) ([a666766](https://github.com/box/boxcli/commit/a6667664d6b43fd80de9e57482b0f4138efcd6cf))
* Replace `@oclif/command` to `@oclif/core` library ([#553](https://github.com/box/boxcli/issues/553)) ([aed470b](https://github.com/box/boxcli/commit/aed470b22d28ed19040b4417e3143f3323b9a916))

### Bug Fixes

* Respect using environment `defaultAsUserId` for CCG Auth and OAuth ([#554](https://github.com/box/boxcli/issues/554)) ([b3a691e](https://github.com/box/boxcli/commit/b3a691e8c886f7bb3a25ae8f7986f284a695f046))

## [3.16.0](https://github.com/box/boxcli/compare/v3.15.0...v3.16.0) (2024-11-25)


### New Features and Enhancements

* add support for `template_id` during sign request creation ([#549](https://github.com/box/boxcli/issues/549)) ([95963c1](https://github.com/box/boxcli/commit/95963c19650937f9d67c47184cc8a743166eae60))

### Bug Fixes

* Change zone name in the mass update user zone script ([#546](https://github.com/box/boxcli/issues/546)) ([1a1d603](https://github.com/box/boxcli/commit/1a1d603267b928e08df32394637f53264e9e57c9))

## [3.15.0](https://github.com/box/boxcli/compare/v3.14.1...v3.15.0) (2024-08-06)


### New Features and Enhancements

* Support AI APIs using Box Node SDK ([#539](https://github.com/box/boxcli/issues/539)) ([59551d2](https://github.com/box/boxcli/commit/59551d2153549b5a87b2c3fae01eb3089d640c89))

### [3.14.1](https://github.com/box/boxcli/compare/v3.14.0...v3.14.1) (2024-06-06)


### Bug Fixes

* Fix bulk action in `search` command ([#528](https://github.com/box/boxcli/issues/528)) ([782b0e6](https://github.com/box/boxcli/commit/782b0e6b00905d9724289cb05cf03a708c32ebb3))
* Fix bulk operation for `sign-requests:create` command ([#531](https://github.com/box/boxcli/issues/531)) ([6d9cd6b](https://github.com/box/boxcli/commit/6d9cd6b82088185c1b98e8c4ed9ac26af4ee3362))

## [3.14.0](https://github.com/box/boxcli/compare/v3.13.0...v3.14.0) (2024-03-06)


### New Features and Enhancements

* Add support for `vanity_name` when creating `shared-links` ([#524](https://github.com/box/boxcli/issues/524)) ([38164bc](https://github.com/box/boxcli/commit/38164bc716879aef0a8a2b973a9c6fc7eb705978))
* Support sign request signer group ID ([#521](https://github.com/box/boxcli/issues/521)) ([f7b1b44](https://github.com/box/boxcli/commit/f7b1b4409e0f72c264cc23a0f1ca1849060bf121))

## [3.13.0](https://github.com/box/boxcli/compare/v3.12.2...v3.13.0) (2024-02-22)


### New Features and Enhancements

* Add additional `UseDisplayName` flag to metadata extraction script ([#515](https://github.com/box/boxcli/issues/515)) ([b900fdb](https://github.com/box/boxcli/commit/b900fdb984345c0fdfeb09e531f6a358ad8c3b8e))
* Add additional context info when throw exception ([#519](https://github.com/box/boxcli/issues/519)) ([b99a58d](https://github.com/box/boxcli/commit/b99a58d930eccf5363c82b84e4415336d7d69541))
* Support overwrite/skip folder download ([#516](https://github.com/box/boxcli/issues/516)) ([300f914](https://github.com/box/boxcli/commit/300f914ba8bb94d9c399699d126d81aba0b22142))

### Bug Fixes

* Fix metadata extraction script ([#514](https://github.com/box/boxcli/issues/514)) ([2fad540](https://github.com/box/boxcli/commit/2fad540badf60538fe1456f8071b74bf917f7464))
* Fix the functionality of the overwrite flag ([#513](https://github.com/box/boxcli/issues/513)) ([f4bf7af](https://github.com/box/boxcli/commit/f4bf7af8e0bbdf7e73fab23d920259ef16672be0))

### [3.12.2](https://github.com/box/boxcli/compare/v3.12.1...v3.12.2) (2023-11-08)


### Bug Fixes

* Bump box-node-sdk ([#510](https://github.com/box/boxcli/issues/510)) ([2621f41](https://github.com/box/boxcli/commit/2621f4121999ff6e9d0cc0c391dfd3aa93aefe49))

### [3.12.1](https://github.com/box/boxcli/compare/v3.12.0...v3.12.1) (2023-11-06)


### Bug Fixes

* force offset based pagination in get users ([#504](https://github.com/box/boxcli/issues/504)) ([9bed083](https://github.com/box/boxcli/commit/9bed083d59b2386d045619fdf2f3ea915e44d231))

## [3.12.0](https://github.com/box/boxcli/compare/v3.11.0...v3.12.0) (2023-09-18)


### New Features and Enhancements

* Support sign templates ([#496](https://github.com/box/boxcli/issues/496)) ([955106f](https://github.com/box/boxcli/commit/955106ffa5d7938c567e5440868f2ec3c87045ce))

## [3.11.0](https://github.com/box/boxcli/compare/v3.10.0...v3.11.0) (2023-09-05)


### New Features and Enhancements

* detect and exclude the byte order mark (BOM) from the CSV input if present ([#492](https://github.com/box/boxcli/issues/492)) ([e147919](https://github.com/box/boxcli/commit/e14791955b53be5c15f8580ee1f9841d8227803b))

## [3.10.0](https://github.com/box/boxcli/compare/v3.9.2...v3.10.0) (2023-08-16)


### New Features and Enhancements

* Support update user tracking codes ([#489](https://github.com/box/boxcli/issues/489)) ([159e6d0](https://github.com/box/boxcli/commit/159e6d07fa91f2b199ca85207a4cad5cf4274f0e))

### [3.9.2](https://github.com/box/boxcli/compare/v3.9.1...v3.9.2) (2023-08-08)


### Bug Fixes

* Fix escaped slashes when passing an input to command ([#486](https://github.com/box/boxcli/issues/486)) ([7670210](https://github.com/box/boxcli/commit/7670210ffb5c38cef8dd153e823029d5237080b6))

### [3.9.1](https://github.com/box/boxcli/compare/v3.9.0...v3.9.1) (2023-07-19)


## [3.9.0](https://github.com/box/boxcli/compare/v3.8.0...v3.9.0) (2023-06-02)


### New Features and Enhancements

* add `max-items`, improve list endpoints performance ([#470](https://github.com/box/boxcli/issues/470)) ([8f386f3](https://github.com/box/boxcli/commit/8f386f3b7c4ff4efbaa941321fd672694ce3c7a1))
* Add support for Integration Mappings API ([#472](https://github.com/box/boxcli/issues/472)) ([bbf2548](https://github.com/box/boxcli/commit/bbf2548223e0d07ce2412c04991e7d8f00022fa7))
* New fields in `retention-policy` and `retention-policy-assignment` ([#466](https://github.com/box/boxcli/issues/466)) ([f960e59](https://github.com/box/boxcli/commit/f960e59aaf55fe0a0507e9f4c9d867e7c3dd039a))

## [3.8.0](https://github.com/box/boxcli/compare/v3.7.0...v3.8.0) (2023-03-03)


### New Features and Enhancements

* add alias for metadata cascade policy create ([#460](https://github.com/box/boxcli/issues/460)) ([8d2f683](https://github.com/box/boxcli/commit/8d2f683e092c036efe352e6fd70904083ad7c208))
* Add support for `--reauthorize` flag in login command ([#457](https://github.com/box/boxcli/issues/457)) ([f653a0d](https://github.com/box/boxcli/commit/f653a0d526c7194f0a5e80dc837f0f16a9d4f27b))

### Bug Fixes

* Fix `keychain` access by bumping `keychain` library to `1.4.0` ([#459](https://github.com/box/boxcli/issues/459)) ([56919ce](https://github.com/box/boxcli/commit/56919cefabef6de4d96a1f69f7c80740a680876c))
* Fix unit tests ([#456](https://github.com/box/boxcli/issues/456)) ([f89d9ef](https://github.com/box/boxcli/commit/f89d9ef5c3c4e7bf00c0be40f128428b1e7e6983))

## [3.7.0](https://github.com/box/boxcli/compare/v3.6.0...v3.7.0) (2023-01-19)


### New Features and Enhancements

* Add more flags for folder update collaborators ([#438](https://github.com/box/boxcli/issues/438)) ([83ac6d7](https://github.com/box/boxcli/commit/83ac6d7c8eeb7f3dc8562c8132cade4f5af80ee1))
* Add support session termination ([#446](https://github.com/box/boxcli/issues/446)) ([aef15a8](https://github.com/box/boxcli/commit/aef15a8d2c7ee904db320d879deb6ebf0f934d22))

### Bug Fixes

* Fix delete token cache from disk ([#445](https://github.com/box/boxcli/issues/445)) ([aafb68a](https://github.com/box/boxcli/commit/aafb68ae38a8280bd97cf978042a8df5b71b2f52))
* Fix metadata template update when adding multiple options to enum ([#442](https://github.com/box/boxcli/issues/442)) ([8779eec](https://github.com/box/boxcli/commit/8779eecf24bda5b093bc891f5097879e1876b601))
* single file upload on Node 16 ([#441](https://github.com/box/boxcli/issues/441)) ([d94ab35](https://github.com/box/boxcli/commit/d94ab35a38938daf4edbbd134774a3809facecbd))

## [3.6.0](https://github.com/box/boxcli/compare/v3.5.0...v3.6.0) (2022-11-22)


### New Features and Enhancements

* Add `id` and `type` field  to shared-links:create response ([#427](https://github.com/box/boxcli/issues/427)) ([5ea4cb8](https://github.com/box/boxcli/commit/5ea4cb82294188dd30563ef9cea2c8e0b76bbfae))
* Add fields disposition_at field for files under retention ([#429](https://github.com/box/boxcli/issues/429)) ([db824ef](https://github.com/box/boxcli/commit/db824ef0b4111810b7902896062c950ef9ac01b3))

### Bug Fixes

* Fix `event:poll` polling-interval ([#430](https://github.com/box/boxcli/issues/430)) ([9ada74b](https://github.com/box/boxcli/commit/9ada74b09eb5aa0e09881946a4f7f30e2d68e037))

## [3.5.0](https://github.com/box/boxcli/compare/v3.4.0...v3.5.0) (2022-11-02)


### New Features and Enhancements

* Add option to change name of downloaded file in `save-as`parameter ([#415](https://github.com/box/boxcli/issues/415)) ([81fe64e](https://github.com/box/boxcli/commit/81fe64eb2891e7ab55564e2428f64f1129b468e8))
* Add support for modifiable retention policies & enable deleting retention policy assignment ([#420](https://github.com/box/boxcli/issues/420)) ([26ab5b4](https://github.com/box/boxcli/commit/26ab5b4d7ec49576fdac48abc025903622f8efe0))

## [3.4.0](https://github.com/box/boxcli/compare/v3.3.2...v3.4.0) (2022-09-26)


### New Features and Enhancements

* Add `DryRun` mode in `User Deprovision` example script ([#392](https://github.com/box/boxcli/issues/392)) ([584a30e](https://github.com/box/boxcli/commit/584a30ef33446a6687ce558c810804202650299f))
* Add `redirect_url` and `declined_redirect_url` to Sign Request ([#395](https://github.com/box/boxcli/issues/395)) ([261b7d2](https://github.com/box/boxcli/commit/261b7d22a5e5adf3647276cbf59454cca9bf607f))
* Add progress bar for file download and bulk command ([#376](https://github.com/box/boxcli/issues/376)) ([68359c7](https://github.com/box/boxcli/commit/68359c7e97ce2b606184426cbbaac73914ceb81a))
* create destination path during download ([#393](https://github.com/box/boxcli/issues/393)) ([40881dd](https://github.com/box/boxcli/commit/40881ddbd2c86e80f19689f012736fb19f18d945))
* native credentials storage for Windows with a new library ([#385](https://github.com/box/boxcli/issues/385)) ([a6918aa](https://github.com/box/boxcli/commit/a6918aaa6e28bd29619bea31c97b845d8d429fec))

### Bug Fixes

* correctly resolve home dir in folders download ([#398](https://github.com/box/boxcli/issues/398)) ([86d3230](https://github.com/box/boxcli/commit/86d3230456827a042be04f5ef372b15d83fd6a10))
* Fix logs in `Users Deprovisioning` script ([#381](https://github.com/box/boxcli/issues/381)) ([c85f77b](https://github.com/box/boxcli/commit/c85f77b3042dfc3ddfe54b2acd94b220f6ee0e9b))
* Fix problem with `keytar` library ([#394](https://github.com/box/boxcli/issues/394)) ([1979f01](https://github.com/box/boxcli/commit/1979f01758a30cd1dbf9d32c19ce2f3a00c0d5ec))

### Note

* To migrate storing Box CLI environments to the system credential storage, execute the following command in the terminal (https://github.com/box/boxcli/issues/295):
  ```
  box configure:environments:update
  ```

### [3.3.2](https://github.com/box/boxcli/compare/v3.3.1...v3.3.2) (2022-07-29)


### Bug Fixes

* Fix request command when calling without body ([#369](https://github.com/box/boxcli/issues/369)) ([9317888](https://github.com/box/boxcli/commit/9317888c3f1bff56ef784d7319f1b8ccf12239ef))

### [3.3.1](https://github.com/box/boxcli/compare/v3.3.0...v3.3.1) (2022-07-25)


### Bug Fixes

* Fix OAuth login ([#364](https://github.com/box/boxcli/issues/364)) ([579b44b](https://github.com/box/boxcli/commit/579b44b83c60f6568c98cb5f1417effbac26c58c))

## [3.3.0](https://github.com/box/boxcli/compare/v3.2.0...v3.3.0) (2022-07-19)


### New Features and Enhancements

* add editable shared link support ([#350](https://github.com/box/boxcli/issues/350)) ([ab639e7](https://github.com/box/boxcli/commit/ab639e7e9336e8745ef84dd6dfc646c987638ec3))
* add file requests api support ([#355](https://github.com/box/boxcli/issues/355)) ([73f0490](https://github.com/box/boxcli/commit/73f0490ff3c3dfefb89e14dde933d3a3ffc4113f))
* add possibility to set custom analytics header ([#348](https://github.com/box/boxcli/issues/348)) ([5a3387f](https://github.com/box/boxcli/commit/5a3387fb687bcbd5d8441117c497312ac1d20f27))
* Support --copy-instance-on-item-copy flag for update metadata template ([#357](https://github.com/box/boxcli/issues/357)) ([5d8272a](https://github.com/box/boxcli/commit/5d8272a0559ec97a345a2032456998383e7a6716))
* support Client Credentials Grant as authentication method ([#335](https://github.com/box/boxcli/issues/335)) ([4649d8a](https://github.com/box/boxcli/commit/4649d8adf39f64c8292b70c35b7bffa96e462edc))

## [3.2.0](https://github.com/box/boxcli/compare/v3.1.0...v3.2.0) (2022-06-30)


### New Features and Enhancements

* Added support for stream type `admin_logs_streaming` ([#337](https://github.com/box/boxcli/issues/337)) ([7596157](https://github.com/box/boxcli/commit/7596157e3a72ef152be44a04198e38d6c57de250))

### Bug Fixes

* Fix native storage errors ([#345](https://github.com/box/boxcli/issues/345)) ([b73b841](https://github.com/box/boxcli/commit/b73b841224ad7f5bb543c92962adb7fc5960bb8c))

## [3.1.0](https://github.com/box/boxcli/compare/v3.0.0...v3.1.0) (2022-06-17)


### New Features and Enhancements

* Add --all flag for search to return all results ([#336](https://github.com/box/boxcli/issues/336)) ([23ea0a5](https://github.com/box/boxcli/commit/23ea0a5c5b065ea3b91b73b64bb7b267a6ff0a18))
* add unique state parameter to OAuth2 login ([#292](https://github.com/box/boxcli/issues/292)) ([5ce6a40](https://github.com/box/boxcli/commit/5ce6a40b4c6e2fc78b2b598a8b1529200c63902e))
* allow changing base URLs ([#303](https://github.com/box/boxcli/issues/303)) ([e284059](https://github.com/box/boxcli/commit/e28405971ebcf2c2284bb875b40ceb7eaebb41c4))
* obtain `oauth` authorization from commandline ([#299](https://github.com/box/boxcli/issues/299)) ([18c88bb](https://github.com/box/boxcli/commit/18c88bb6835509394b92eb0685e3a9306ede8984))
* use native credential storage for MacOS and Windows ([#295](https://github.com/box/boxcli/issues/295)) ([74c4922](https://github.com/box/boxcli/commit/74c492271ebc54e15500abbaaa2c7aac32be5070))

### Bug Fixes

* `users:transfer-content` to respect quiet flag ([#288](https://github.com/box/boxcli/issues/288)) ([1d0bbab](https://github.com/box/boxcli/commit/1d0bbab652bf74a59c8486fc4d5eac415161254c))
* correctly pass `copy-instance-on-item-copy` flag ([#285](https://github.com/box/boxcli/issues/285)) ([cd4fbf4](https://github.com/box/boxcli/commit/cd4fbf4f746b83c2b066efb31b2e2952dba1312d))
* Fix updating webhook triggers ([#297](https://github.com/box/boxcli/issues/297)) ([09e94c3](https://github.com/box/boxcli/commit/09e94c32ed8e4243e76dd19e67b6d1c17c2cdc04))
* support large output when using `json` flag by replacing `json.stringify` ([#328](https://github.com/box/boxcli/issues/328)) ([1204f2c](https://github.com/box/boxcli/commit/1204f2c146c713124060730e0554ab2f2dde27fa))
* Support limit flag for Box Search ([#323](https://github.com/box/boxcli/issues/323)) ([0009a77](https://github.com/box/boxcli/commit/0009a77ee3fc4b72ef01bbbeff0ea588c10a6f89)), closes [#322](https://github.com/box/boxcli/issues/322)
* Support OAuth with multiple redirect URIs ([#302](https://github.com/box/boxcli/issues/302)) ([9fe216e](https://github.com/box/boxcli/commit/9fe216e8d2f59e4375a4b7c766844366f7166a0a))

## [3.0.0](https://github.com/box/boxcli/compare/v2.9.0...v3.0.0) (2022-01-27)

### ⚠ BREAKING CHANGES

- Drop support for Node 10
- Insensitive language changes (#247, #252)

### New Features and Enhancements

- Add support for login with OAuth ([#240](https://github.com/box/boxcli/pull/240))
- feat: support as-user flag for bulk files and when token is present ([#270](https://github.com/box/boxcli/pull/270))
- Add support for copyInstanceOnItemCopy field for metadata templates  ([#239](https://github.com/box/boxcli/pull/239))
- Add support note to the mdfilter equality check in search ([#253](https://github.com/box/boxcli/pull/253))
- Add support for Box Sign API ([#258](https://github.com/box/boxcli/pull/258))
- Add support Metadata Query API ([#259](https://github.com/box/boxcli/pull/259))
- fix: folder:collaborations:add make role a required flag (SDK-1070) ([#261](https://github.com/box/boxcli/pull/261))
- Minor dependencies upgrade
- Add new API for files and file versions under retention (#250)
- Adding support for sign request (#258)
- Support Metadata Query API (#259)
- chore: enforce conventional commits (#268)
- feat: support as-user flag for bulk files and when token is present (#270)

### Bug Fixes
- fix: folder:collaborations:add make role a required flag (#261)
- fix: Fixed shared-links delete example. (#262)

## [2.9.0](https://github.com/box/boxcli/compare/v2.8.0...v2.9.0) (2021-02-22)

### New Features and Enhancements

- Add ability to add an option to a metadata template multi select field ([#230](https://github.com/box/boxcli/pull/230))
- Add folder lock functionality ([#232](https://github.com/box/boxcli/pull/232))
- Add support for search param to get shared link items ([#233](https://github.com/box/boxcli/pull/233))

### Bug Fixes

- Fix events command bug when there is no stream position flag ([#234](https://github.com/box/boxcli/pull/234))

## [2.8.0](https://github.com/box/boxcli/compare/v2.7.0...v2.8.0) (2020-12-03)

### Warning:

- Due to the changes in ([#217](https://github.com/box/boxcli/pull/217)), additional details about Box Items may now be returned for some commands.

### New Features and Enhancements

- Output contents of array for bulk commands ([#217](https://github.com/box/boxcli/pull/217))

### Bug Fixes

- Fix bug with setting proxy settings ([#218](https://github.com/box/boxcli/pull/218))

## [2.7.0](https://github.com/box/boxcli/compare/v2.6.0...v2.7.0) (2020-11-02)

### New Features and Enhancements

- Make commands `collaborations:add`, `shared-links:update`, `shared-links:delete`, `users:search` that were previously hidden, now available ([#211](https://github.com/box/boxcli/pull/211))
- Add `filter_term` parameter to `groups:list` ([#210](https://github.com/box/boxcli/pull/210))

### Bug Fixes

- Fix bug with setting proxy settings ([#213](https://github.com/box/boxcli/pull/213))

## [2.6.0](https://github.com/box/boxcli/compare/v2.5.1...v2.6.0) [2020-08-20]

- Fix filename issue when saving reports on Windows
- Add proxy support for `http`, `https`, `socks` and `pac` protocols. Proxy settings can be found under `box configure:settings`
- Add zip functionality

## [2.5.1](https://github.com/box/boxcli/compare/v2.4.0...v2.5.1) [2020-04-14]

- Added `--quiet` flag to suppress any non-error output to stderr
- Fixed a bug for the `--restrict-collaboration` flag for `box folders:update` where previously the flag would not restrict the collaborations when passed as true and would restrict collaborations when passed as false
- Added `box trash:restore` to restore a trashed item and `box trash:get` to get information on a trashed item
- Fixed a bug where flags that can be specified multiple times in a single command could not be passed through the command line for bulk commands
- **Note**: Skipped version 2.5.0 due to development of new release process

## [2.4.0](https://github.com/box/boxcli/compare/v2.3.0...v2.4.0) [2019-08-29]

- Fixed an issue where the CSV formatting of commands that return multiple different object types (e.g
  `box files:metadata:list` and `box search`) would only include the columns from the first object in the result set.
  These commands now output the full set of columns across all objects in the result set.
- Added a success message to `box collaborations:update` when setting `--role=owner`; previously the command would
  output `undefined`.
- Added support for setting external App User IDs in the `box users:create` and `box users:update` commands with
  the `--external-id` flag

## [2.3.0](https://github.com/box/boxcli/compare/v2.2.0...v2.3.0) [2019-05-23]

- Added `--confirm` flag to the `box users:email-aliases:add` command to automatically confirm the email alias
- Added `--restrict-to-enterprise` flag to the `box folders:update` command to restrict collaboration on the folder
  to the owner's enterprise
- Fixed a bug in the `box folders:update` command where the `--upload-email-access` flag would not correctly set
  the folder upload email access level

## [2.2.0](https://github.com/box/boxcli/compare/v2.1.0...v2.2.0) [2019-04-30]

- Added `--sort` and `--direction` flags to `box search` to control the sort order of the search results
- Fixed `box collections:add` to work correctly with `web_link` items
- Fixed an issue where some commands including `box folders:collaborations:add` could incorrectly interpret bulk
  input entries and produce unintended API requests
- Added `box folders:metadata:set` and `box files:metadata:set` commands to apply metadata keys and values, overwriting
  existing metadata under those keys
- Errors encountered during bulk input are now caught within the CLI, skipping that entry and continuing bulk input.
  The CLI should now run all bulk input entries to completion and report entries that produced errors after all entries
  have been processed.

## [2.1.0](https://github.com/box/boxcli/compare/v2.0.0...v2.1.0) [2019-03-28]

- Fixed an issue where the `--fields` flag was not always requesting additional fields from the API
- Fixed the `--event-types` flag for the `box events` and `box events:poll` commands
- Updated to`lodash@4.17.11` to address a potential prototype pollution vulnerability
- Fixed paging in both the `box events` and `box events:poll` commands:
	- The `box events` command now requires either a closed date range (defaults to last five days), or a stream
	  position.  If given a date range, all events in that range will be returned.  If given a stream position,
	  up to `limit` events will be returned along with the next stream position
	- `box events:poll` now correctly polls for new events

## [2.0.0](https://github.com/box/boxcli/compare/v1.1.1...v2.0.0) [2018-12-13]

### Features and Enhancements
- __Full API parity:__ The new version of the CLI supports all available API endpoints and parameters
- __Recursive folder upload and download:__ Uploading or downloading a folder now preserves the entire deep folder
  structure
- __Expanded human-readable output:__ All object fields returned by the API are now displayed by default, and can be
  controlled with `--fields`.  All commands that output collections of objects no longer require interactive key presses
  to view all objects.
- __More output options for bulk commands:__ Bulk commands no longer require output to be written to disk, and can
  output JSON, CSV, or human-readable output directly to stdout or to any file.
- __More flexible date/time input:__ Date-times can now be specified in UNIX epoch format (e.g. `1535336043`), with a
  year offset shorthand (e.g. `-1y` for "one year ago"), and as a combination of offset shorthands (e.g. `-5h30m` for
  "5 minutes and 30 seconds ago")
- __All commands now accept bulk input:__ Every command can now accept its arguments and flags from a file input in
  either CSV or JSON format!  There is also no more need for CSV templates, since the column names are the same as the
  CLI's own args and flags (case-insensitive).  Looking at the help for a command should tell you everything you need
  to know to run the command in bulk
- __All commands can now save output to disk:__ Every command now allows passing the `--save` and `--save-to-file-path`
  flags to save the output to disk.  The output written will respect the `--json` and `--csv` flags for specifying
  output format, otherwise it will use the file format in the CLI settings.
- __Custom API calls:__ The new `box request` command allows making any API call against the Box API, and can be used
  to pass arbitrary URLs and parameters
- __Per-environment token caching enabled by default:__ To improve performance when running multiple commands, each
  environment now caches the primary Service Account tokens by default.  This can be disabled by running
  `box configure:environments:update --no-cache-tokens`
- __Command correction and autocomplete:__ If you mis-type a command, you will now be prompted if there is an available
  correction; selecting "yes" at the prompt will run the corrected command for you.  There is also now a
  `box autocomplete` command, which will help you set up autocompletion (currently available only in bash and zsh
  shells)
- __User-friendly prompts:__ Some commands (e.g. `box configure:environments:select`) can now be called without
  providing the necessary arguments; in this case, the command will display a helpful prompt to allow selecting the
  argument value.
- __Re-organized command hierarchy:__ We've renamed and reorganized many of the commands in the CLI to clarify the
  inputs they take and reduce unnecessary subcommand nesting.  In some cases, this drastically reduces the length of
  the command.  For example, `box files:shared-links:create` is now `box files:share` — 14 characters shorter!  Most
  commands that were previously available as `xyzs:list` are now just `xyzs`; for example,
  `box folders collaborations list` is now `box folders:collaborations`
- __Download commands can download to a specified location on disk:__ Pass the `--destination` flag to have the files or
  folders download to any location

### ⚠ BREAKING CHANGES

- The `box files:metadata:*`, `box folders:metadata:*`, and `box metadata-templates:*` command interfaces have changed;
  please run the commands with `--help` for more details
- All `box sessions` commands have been removed; use `box configure:environments:switch-user [USER_ID]` to switch
  between users.
- All `box configure settings` subcommands have been removed; these settings can be set by passing the appropriate
  flag(s) to `box configure:settings`
- `box files shared-links get [fileID]` is replaced by `box files:get [fileID] --fields=shared_link`
  (output format differs)
- `box folders shared-links get [folderID]` is replaced by `box folders:get [folderID] --fields=shared_link`
  (output format differs)
- `box folders change-upload-email [folderID] [access]` is replaced by
  `box folders:update [folderID] --upload-email-access=[access]` (output format differs)
- `box storage-policies assignments add [userID] [policyID]` is replaced by
  `box storage-policies:assign [policyID] [userID]` (same functionality, may make more API calls)
- `box storage-policies assignments update [assignmentID] [policyID]` is deprecated in favor of
  `box storage-policies:assign [policyID] [userID]`
- `box users change-primary-email [userID] [email]` is replaced by `box users:update [userID] --login=[email]`
  (output format differs)
- The `--list-members flag` has been removed from the `box groups:membership:list` command; this is now the default
  behavior of the command and does not need to be specified via flag.
- The `--list-groups` flag on `box groups:membership:list` has been removed; this functionality is now found in
  the `box users:groups` command.
- The `--list-collaborations` flag on `box groups:membership:list` has been removed; this functionality is now found
  in the `box groups:collaborations` command.
- Multi-word collaboration roles specified via the `-r|--role` flag in `box collaborations:add` and similar commands
  are now separated by an underscore (e.g `viewer_uploader`) instead of a space.  This should make it easier to work
  with these commands without needing to quote the flag value.
- The `-y|--yes` flag has been removed from some commands; deletions of users, folders, files, etc will no longer
  prompt to confirm that the item should be deleted.
- The `-m|--multi` flag has been removed from `box files:download` and `box folders:download` since these commands
  now accept bulk input via CSV.
- The `--id-only` flag has been removed from `box folders:move`, since a folder move within a user's account should
  not change the folder ID.
- The `--parent-folder-id` flag has been removed from the `box folders:update` command; users should use
  `box folders:move` instead.
- The `--shared-link-*` flags have been removed from the `box folders:update` command; users should use
  `box folders:share` instead.
- The `--sync-disable` flag on `box users:create` and `box users:update` is now called `--no-sync-enable`
- The `--is-exempt-from-device-limits` flag on `box users:create` and `box users:update` is now called
  `--exempt-from-device-limits`
- The `--not-exempt-from-device-limits` flag on `box users:create` and `box users:update` is now called
  `--no-exempt-from-device-limits`
- The `--is-exempt-login-verification` flag on `box users:create` and `box users:update` is now called
  `--exempt-from-2fa`
- The `--not-exempt-login-verification` flag on `box users:create` and `box users:update` is now called
  `--no-exempt-from-2fa`
- The `--parent-folder` flag on `box files:upload` is now called `--parent-id` for consistency with other commands
- The `box storage-policies:assign` command no longer takes two arguments (a type and ID), and instead now takes
  one argument (the ID) and has a `--type` flag with default value "user" to make the command easier to run for common
  use cases
- The `box webhooks:create` command no longer takes four arguments (target type, target ID, triggers, and URL), but
  instead now takes two arguments (the target type and ID) and has two new flags: `--triggers` and `--address` to make
  it easier to specify without needing to remember the argument order
- The `--limit` flag on `box users:list` and `box collaborations:list-for-group` has been removed; all results will
  be returned by default
- The short code for the `box users:create --status` flag was changed from `-s` to `-S` to disambiguate from the
  global `--save` flag
- The short code for the `box webhooks:update --triggers` flag was changed from `-t` to `-T` to disambiguate from
  the global `--token` flag
- The bulk input file format for `box collaborations:add` has changed; see `--help` for more details

### Bug Fixes
- The `--json` flag in the search command works correctly now
- Windows absolute paths without the drive letter (e.g. `\MyFolder\file.pdf`) now work correctly
- Uploading files over 4 GB in size now works correctly
- Listing the items in a folder with more than 300,000 items should no longer fail with an invalid offset error

## [1.1.1](https://github.com/box/boxcli/compare/v1.1.0...v1.1.1)

- Fixed bug preventing removal of a user from an Enterprise and conversion to a free user account.
- Fixed bug that returned incorrect total count when using `box list users -m` to only list managed users.
- Added CreatedAt field to CSV output for events.
- Removed SyncState from CSV for creating folders.
- Enabled setting a description for a folder when creating the folder.

## [1.1.0](https://github.com/box/boxcli/compare/v1.0.2...v1.1.0)

- Added new feature on all commands for using an individual token. Add the `--token` option to perform an individual command with the Box CLI using a specific token you provide. The feature is most useful when paired with the Developer Token you can generate through the Box Developer Console. When working with an application you create in the Box Developer Console, you will not need to authorize the application into a Box Enterprise before working with the Developer Token. For example usage: `box users get me --token <token_string>`. Certain commands may fail based on the permissions of the user to which the token you use belongs.
- Fixed a bug preventing `previewer` being used when adding or updating a collaboration.
- Added the following commands: `box collaborations delete`, `box folders collaborations delete`, `box files collaborations delete`.
- Improved error messaging for failure on registering a configuration file and private key file with the Box CLI when creating a new CLI `environment`.
- Added `--disable-file-path-translation` to the following commands: `box configure environments add`, `box configure environments update-config-file-path`, `box configure environments update-private-key-path`. This option ignores any additional processing on trying to resolve the file paths you provide when creating and updating Box CLI `environments`.
- Fixed visual bug with upload progress tracker.
- Updated Box .Net SDK to v3.3.0.
- Changed Box CLI output to JSON by default with no existing `.box` directory.

## [1.0.2](https://github.com/box/boxcli/compare/v1.0.1...v1.0.2)
- Added shared link commands for Create, Get, Update, and Delete. Located as standalone commands under `box shared-links` as well as under `box folders shared-links` and `box files shared-links`.
- Fixed UTF-8 issue obscuring characters when saving CSV reports.
- Added autopaging for events and fixed faulty event Get command.
- Added date options `w` for weeks and `now` when using date options with commands.

## [1.0.1](https://github.com/box/boxcli/compare/v1.0.0...v1.0.1)

- Fixed minor bug preventing --name, --description, and --etag options from working on the `box folders update` command
- Added a `box folders rename` command.

## [1.0.0](https://github.com/box/boxcli/compare/v1.0.0...v1.0.0)

- Welcome to the Box CLI!
