## Changelog

## [2.0.5](https://github.com/mezmo/cli/compare/v2.0.4...v2.0.5) (2025-12-12)


### Bug Fixes

* **upgrade**: account for versions strings sans v [a64f1c7](https://github.com/mezmo/cli/commit/a64f1c782b299b20f4fa1754fc6b4ee19de762a9) - Eric Satterwhite
* **upgrade**: correctly handle removal of running program on windows [d168be3](https://github.com/mezmo/cli/commit/d168be3f13e95359fc01a051433af41852d3b38b) - Eric Satterwhite, closes: [#36](https://github.com/mezmo/cli/issues/36)

## [2.0.4](https://github.com/mezmo/cli/compare/v2.0.3...v2.0.4) (2025-12-11)


### Chores

* **pkg**: include logo for command entrypoint [98364e3](https://github.com/mezmo/cli/commit/98364e319c3ac04a95e5a715eaf379aa42325abd) - Eric Satterwhite

## [2.0.3](https://github.com/mezmo/cli/compare/v2.0.2...v2.0.3) (2025-12-11)


### Bug Fixes

* **command-create**: update create command to handle new spec format [8bc753e](https://github.com/mezmo/cli/commit/8bc753ece42a1c5f339557ae4148628b93826b23) - Eric Satterwhite


### Documentation

* **wiki**: Include a security policy [3c6587d](https://github.com/mezmo/cli/commit/3c6587db991b82959bf112bcafd60468dbb5b457) - GitHub
* **wiki**: Update issue templates [42faaba](https://github.com/mezmo/cli/commit/42faaba85f179860ed50c987fb848d24fc799319) - GitHub


### Miscellaneous

* update .all-contributorsrc [skip ci] [3573545](https://github.com/mezmo/cli/commit/357354597e50850dcca08352bc2ed181637d5f60) - Eric Satterwhite
* update README.md [skip ci] [876c8da](https://github.com/mezmo/cli/commit/876c8da5a067b9c14dc792659601b68208e9c080) - Eric Satterwhite

## [2.0.2](https://github.com/mezmo/cli/compare/v2.0.1...v2.0.2) (2025-12-05)


### Bug Fixes

* **core**: make sure version object can be translated to a string [0b1c131](https://github.com/mezmo/cli/commit/0b1c13125497c481fede62cf5c79ad38efb85b4b) - Eric Satterwhite, closes: [#32](https://github.com/mezmo/cli/issues/32)


### Miscellaneous

* update .all-contributorsrc [skip ci] [924f40e](https://github.com/mezmo/cli/commit/924f40ed7f694f77e0c7ad7ea8d80bf525c93f4a) - Eric Satterwhite
* update .all-contributorsrc [skip ci] [ff78724](https://github.com/mezmo/cli/commit/ff787248e00142378e92a7ed9a6bdd94f66a106e) - Eric Satterwhite
* update README.md [skip ci] [d54d5cb](https://github.com/mezmo/cli/commit/d54d5cb76245170cb5b551368da7ed1728f81fb4) - Eric Satterwhite
* update README.md [skip ci] [607c2aa](https://github.com/mezmo/cli/commit/607c2aaccc766d2135a5e11fb12e0e118256e9c7) - Eric Satterwhite

## [2.0.1](https://github.com/mezmo/cli/compare/v2.0.0...v2.0.1) (2025-12-04)


### Bug Fixes

* **command-log**: fix windows signal handling [ad22ded](https://github.com/mezmo/cli/commit/ad22ded00d5c943c580435ccdbcb3e5e415952db) - Eric Satterwhite, closes: [#28](https://github.com/mezmo/cli/issues/28)

# [2.0.0](https://github.com/mezmo/cli/compare/v1.3.0...v2.0.0) (2025-12-02)


### Bug Fixes

* **ci**: fix commit transform function in release [eb16c36](https://github.com/mezmo/cli/commit/eb16c366c567bacff30f626a90d80a6733ee4b46) - Eric Satterwhite
* **remote**: make sure to transform string input into requested format [13e29a1](https://github.com/mezmo/cli/commit/13e29a1e0a3244b17e736b2bc20b31ff1816d5c0) - Eric Satterwhite


### Chores

* **core**: move resource templates into a single directory [3df2620](https://github.com/mezmo/cli/commit/3df26207f000d6167ec7245fbf05706d62a34359) - Eric Satterwhite
* **core**: update the category resource module to utilize spec files [f02f020](https://github.com/mezmo/cli/commit/f02f020620e0a16ec9cbc6b2eaab79ffa7020e28) - Eric Satterwhite
* **lint**: update files to pass basic lint [ee93451](https://github.com/mezmo/cli/commit/ee9345195db9fe6d73ee29646cfc5b45a29da624) - Eric Satterwhite


### Documentation

* **wiki**: include recording for using create + edit together [864a5a5](https://github.com/mezmo/cli/commit/864a5a529884e3b08cf601df467bfb294e06f747) - Eric Satterwhite


### Features

* **command-create**: category sub command to create a category [ad437e5](https://github.com/mezmo/cli/commit/ad437e591f488d41191c8641c5addb6f11a0411a) - Eric Satterwhite
* **core**: adds ability to create from a resource spec template [a33818d](https://github.com/mezmo/cli/commit/a33818d139152e61c97a0afd1e8bf4308bbee18a) - Eric Satterwhite
* **core**: replace file embending [b6a8ac6](https://github.com/mezmo/cli/commit/b6a8ac6eda29e1d6f80b33d2198efefdca9f5934) - Eric Satterwhite


### Miscellaneous

* fix(resource) Fix the create logic for categories [affce4f](https://github.com/mezmo/cli/commit/affce4f7861ca501ee3c6c89308ec65347e37a48) - Eric Satterwhite


### **BREAKING CHANGES**

* **core:** the release file is renamed to release.json
* **core:** Format of resource spec changed from previous format

# [1.3.0](https://github.com/mezmo/cli/compare/v1.2.0...v1.3.0) (2025-11-26)


### Bug Fixes

* **core**: remove the extraneous aura request client [6265787](https://github.com/mezmo/cli/commit/6265787827a14552eac8a9a7696d4ee5dbb14812) - Eric Satterwhite
* **resource**: moving some stray view types in to the right module [8b8cdbe](https://github.com/mezmo/cli/commit/8b8cdbeb1f9f3e48670c79e251dc4eeb48164beb) - Eric Satterwhite


### Chores

* **deps**: update and stream line dependencies. [8c9a7ad](https://github.com/mezmo/cli/commit/8c9a7adbe9b9208ce54cd02ed19035bbc053bd18) - Eric Satterwhite


### Features

* **category**: adds ability to interact with categories [c7ed909](https://github.com/mezmo/cli/commit/c7ed90983ab31093c8311873683b0669b21cfa16) - Eric Satterwhite


### Miscellaneous

* update .all-contributorsrc [skip ci] [ca2ce28](https://github.com/mezmo/cli/commit/ca2ce28a4f4975f298efae16817fafe50ce1ac76) - Eric Satterwhite
* update README.md [skip ci] [3b89ef0](https://github.com/mezmo/cli/commit/3b89ef0800dc755fa402cc2114262a5f06a6fd36) - Eric Satterwhite

# [1.2.0](https://github.com/mezmo/cli/compare/v1.1.1...v1.2.0) (2025-11-25)


### Bug Fixes

* **command-log**: fixes a couple typos in the search command [74bb51d](https://github.com/mezmo/cli/commit/74bb51d38ec4617902d29994ca7d099bae04691d) - Eric Satterwhite
* **command**: fix file closing on edit command [2906811](https://github.com/mezmo/cli/commit/2906811001910fd1d5b66e25287df1fcea34adb7) - Eric Satterwhite


### Chores

* **command-version**: use release module to pull version info [e51db19](https://github.com/mezmo/cli/commit/e51db197e0128cfb22a7b0f6eb041c5bd38ecfd5) - Eric Satterwhite


### Documentation

* **wiki**: add beta banner to readme [82fbe25](https://github.com/mezmo/cli/commit/82fbe25cc4bb9c27eeeab3ac26602f7150877b70) - Eric Satterwhite


### Features

* **command-upgrade**: add a command to update the cli in place [6ff2763](https://github.com/mezmo/cli/commit/6ff27638ffa16adeb500e86493def3ac441fd425) - Eric Satterwhite

## [1.1.1](https://github.com/mezmo/cli/compare/v1.1.0...v1.1.1) (2025-11-24)


### Bug Fixes

* **command**: fix version command age [8439449](https://github.com/mezmo/cli/commit/84394495cbb3ada9aa8830e4d508b2935f8bbbc3) - Eric Satterwhite

# [1.1.0](https://github.com/mezmo/cli/compare/v1.0.1...v1.1.0) (2025-11-23)


### Documentation

* **wiki**: fix some formatting issues in the README [f50d68b](https://github.com/mezmo/cli/commit/f50d68b04c9975918e1da1c5f81792deb23978b5) - Eric Satterwhite
* **wiki**: fix the contributor section of readme [c313ff2](https://github.com/mezmo/cli/commit/c313ff26fc4490dd1628679498be2bd1f00e12b5) - Eric Satterwhite


### Features

* **command**: include a version command [24957e1](https://github.com/mezmo/cli/commit/24957e140427da1ded7ac324f7169a3a982937e7) - Eric Satterwhite


### Miscellaneous

* create .all-contributorsrc [skip ci] [e8e3c6f](https://github.com/mezmo/cli/commit/e8e3c6f24afbe27e4baedb0bcf59f5bdf180edbe) - Eric Satterwhite
* update .all-contributorsrc [skip ci] [982038e](https://github.com/mezmo/cli/commit/982038e9d264f4a3393c43a81c39931808999dbd) - Eric Satterwhite
* update README.md [skip ci] [241a942](https://github.com/mezmo/cli/commit/241a942a1a98a3ac231d58b9c295bce6e79864ec) - Eric Satterwhite
* update README.md [skip ci] [817dbfd](https://github.com/mezmo/cli/commit/817dbfd1dbc0d51ac3074215a19c12c355542143) - Eric Satterwhite

## [1.0.1](https://github.com/mezmo/cli/compare/v1.0.0...v1.0.1) (2025-11-22)


### Bug Fixes

* **ci**: fix release process and release rules [543a1f4](https://github.com/mezmo/cli/commit/543a1f4a90e069fdccb9b99b41f5c71793648e33) - Eric Satterwhite
* **command**: fix a problem with the edit view command [4f1320b](https://github.com/mezmo/cli/commit/4f1320b4450216a33358afea7108bb45429207a0) - Eric Satterwhite


### Documentation

* **wiki**: update the vhs recording names [0b58be2](https://github.com/mezmo/cli/commit/0b58be2df7dab5506480553160e1ac0bbcb564ad) - Eric Satterwhite


### Miscellaneous

* doc(wiki) update the readme with something useful [b3956bc](https://github.com/mezmo/cli/commit/b3956bc2bf1e68633e2d5c1af0ca6512fdd8bc57) - Eric Satterwhite

# 1.0.0 (2025-11-22)


### Bug Fixes

* **command-log**: fix the handling of for the default to flag [5257f2f](https://github.com/mezmo/cli/commit/5257f2f2239c2ad155982acc0980506702d180d8) - Eric Satterwhite
* **command-log**: fix the pagination and default query [96c734f](https://github.com/mezmo/cli/commit/96c734fac8ef5c07fa1ddbb71fdc86ba1e9b966a) - Eric Satterwhite
* **command**: print the value back from config:set [6988879](https://github.com/mezmo/cli/commit/69888799f1b8b55a080dbbaafbce6edff6079110) - Eric Satterwhite
* corrects a mis typed file name [324743a](https://github.com/mezmo/cli/commit/324743adc1feabe0e125c4df3b67dd4c9b248d48) - Eric Satterwhite
* **resource**: include types for the conversation resources [390e620](https://github.com/mezmo/cli/commit/390e620b3ab436d4fbad360ebadff5b0c70ef0d3) - Eric Satterwhite


### Chores

* **ci**: clean up checksum script [91024f4](https://github.com/mezmo/cli/commit/91024f432b01ed32fd6c285598a461cfd38d1a3d) - Eric Satterwhite
* **ci**: include semantic release setup for build step [e7db6db](https://github.com/mezmo/cli/commit/e7db6db7b4b84c189b25424e6eec05f70af16bf0) - Eric Satterwhite
* **command-get**: emphasise table headers [2390029](https://github.com/mezmo/cli/commit/23900290dd0026798f69fd01357aebd6757e973e) - Eric Satterwhite
* **command-log**: add support to match views by name or id [8fe0ec7](https://github.com/mezmo/cli/commit/8fe0ec73e3885c0c703516f133297f77aaa3329d) - Eric Satterwhite
* **command**: intiial working delete command [e046339](https://github.com/mezmo/cli/commit/e046339a352a464dc41ba113ff861153a5a9b7a7) - Eric Satterwhite
* **core**: move the resources into a version namespace [66b11b8](https://github.com/mezmo/cli/commit/66b11b84e3e89f0f8a5778fda1fb5abb2ba5fca5) - Eric Satterwhite
* **delete**: add a delete subcommand to delete a view [13b0dd5](https://github.com/mezmo/cli/commit/13b0dd5727466a176a3e41f75c5eca3b6ded0348) - Eric Satterwhite
* **doc**: add attribution doc for clig.dev [22ed84f](https://github.com/mezmo/cli/commit/22ed84f47c72ab7806e2f9d16453cfb5d15ff487) - Eric Satterwhite
* **doc**: include docs around guiding philosophy [1961288](https://github.com/mezmo/cli/commit/1961288d344061bcc4a257ca84b077b273be8a75) - Eric Satterwhite
* **doc**: include standard oss documents [dbb6c8d](https://github.com/mezmo/cli/commit/dbb6c8deb4a1adc124196f9d077fec5617fb46d8) - Eric Satterwhite
* **docs**: Include more help docs and examples [54bd191](https://github.com/mezmo/cli/commit/54bd191d38417ac7039dcc9a5e55ffa3ffbe861d) - Eric Satterwhite
* **log**: update logging handler to write to stderr [d5cd776](https://github.com/mezmo/cli/commit/d5cd776454c1ef4c2eaa87da1570aac6f801878d) - Eric Satterwhite
* **pkg**: add deno type definitions [e8c498e](https://github.com/mezmo/cli/commit/e8c498e2bc3c74e4f93a7e86a70a5cb17ec95b8d) - Eric Satterwhite
* **pkg**: include compile tasks [c999382](https://github.com/mezmo/cli/commit/c999382ee22e2921104e69dc0952039f8f23d49e) - Eric Satterwhite
* **recording**: includeing crud workflow vhs recording [cb873a8](https://github.com/mezmo/cli/commit/cb873a838d2cc8003335926108f8ef45f53a8ff4) - Eric Satterwhite
* **search**: better handling of the next and all flags [35af17e](https://github.com/mezmo/cli/commit/35af17e850930d13244ff937c5df255d9244556d) - Eric Satterwhite
* **storage**: include a direct sqlite interface and tagged template [d9a7c8c](https://github.com/mezmo/cli/commit/d9a7c8ce7d3bb9b9b1aef2fb85859c60ba63043e) - Eric Satterwhite
* **test**: remove dummy generated test files [b761724](https://github.com/mezmo/cli/commit/b761724615944c1f54aeea17158ca263455ed008) - Eric Satterwhite


### Features

* **ci**: include a Jenkinsfile for publishing cli [9e80d8c](https://github.com/mezmo/cli/commit/9e80d8c3e264552b4fc3199dc21787e06eb48e48) - Eric Satterwhite
* **command-create**: Initial pass at command to create resources [761eedb](https://github.com/mezmo/cli/commit/761eedb25dcabc4ae282353d39436bdf48047412) - Eric Satterwhite
* **command-delete**: Adds a subcommand to delete conversations [0409520](https://github.com/mezmo/cli/commit/0409520f0fd7c3624edb3e44e7d6fc639c5d09ed) - Eric Satterwhite
* **command-edit**: adds view sub command to edit handler [080047d](https://github.com/mezmo/cli/commit/080047db772321d861bf5faabe4d47ab4918eb22) - Eric Satterwhite
* **command-get**: adds account sub command for introspecting accounts [b6e6951](https://github.com/mezmo/cli/commit/b6e695104595d136f7d8f7369c241d807876a844) - Eric Satterwhite
* **command-get**: start of basic get command [5b4e8e5](https://github.com/mezmo/cli/commit/5b4e8e500b6f3a032268e97f9b64ad913cbbe2f3) - Eric Satterwhite
* **command-log**: add support for auto paging and json output [5b06da2](https://github.com/mezmo/cli/commit/5b06da24573925f55a7655e227ef773307c8e96a) - Eric Satterwhite
* **command-log**: adds initial port of the search command [6dc8cdd](https://github.com/mezmo/cli/commit/6dc8cdddac97ee9e4fd7c5f4dc4a2ab4112dbebe) - Eric Satterwhite
* **command-log**: read host names from configuration [74fb2ad](https://github.com/mezmo/cli/commit/74fb2adad69001d30cf4c7f4688c2228735267cc) - Eric Satterwhite
* **command**: ability to use natural language to search time windows [a80d9ad](https://github.com/mezmo/cli/commit/a80d9ad2b3e8787927fdf43f797d35421026dfc5) - Eric Satterwhite
* **command**: add support for views in search and livetail [6b43dba](https://github.com/mezmo/cli/commit/6b43dba7c30513ee6a93fb2a1ef82945c6e4d39d) - Eric Satterwhite
* **command**: adds a conversation sub command to comment-get [259ad7d](https://github.com/mezmo/cli/commit/259ad7d77fb4a1528122022b772c54646023e49d) - Eric Satterwhite
* **command**: ask command to interface with LLM/MCP [631d7c7](https://github.com/mezmo/cli/commit/631d7c7c1901b564d908cec66c18d5cfec75eec9) - Eric Satterwhite
* **config**: initial configuration storge and command [2d6866f](https://github.com/mezmo/cli/commit/2d6866f3508f320de823c4ca540970a25116502e) - Eric Satterwhite
* **edit**: adds edit command allowing editing a resource on the fly [f0ebc06](https://github.com/mezmo/cli/commit/f0ebc0656f64f8e73aa9fe963431c656eec1423c) - Eric Satterwhite
* **error**: Better error handling for commands [26cb631](https://github.com/mezmo/cli/commit/26cb631a893e3189433e9fdbc2bc4ecdc5d7c3fd) - Eric Satterwhite
* **log**: make it possible to set the internal log level [c7cdddd](https://github.com/mezmo/cli/commit/c7cdddd0cf5491b697d6a7f44707b6206d86c2db) - Eric Satterwhite
* **migration**: adds db migrations into the storage module [95bc88e](https://github.com/mezmo/cli/commit/95bc88e25e2a24d12405a3bd517fbc0186cbc0a9) - Eric Satterwhite
* **pkg**: first pass at a working live tail command [316843b](https://github.com/mezmo/cli/commit/316843be680647a01f41c72e50962a4a2c99e142) - Eric Satterwhite
* **tail**: add support for iam tokens [808f0fc](https://github.com/mezmo/cli/commit/808f0fc2ceba00db863158482da9f9bdcffe706d) - Eric Satterwhite


### Miscellaneous

* Initial commit [8990f36](https://github.com/mezmo/cli/commit/8990f36f0b739683a2afa1acbc00670efa32716b) - GitHub
* **setup**: add vhs recording files [2830910](https://github.com/mezmo/cli/commit/28309108ec5d7baae0364bf474b195bd07136de5) - Eric Satterwhite
* **setup**: set the project name in package manifest [736d78e](https://github.com/mezmo/cli/commit/736d78efe296cd5d6ece107401921a178c91bf06) - Eric Satterwhite
