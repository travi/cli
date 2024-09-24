# @travi/cli

cli for my various tools

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Usage](#usage)
  * [Installation](#installation)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Executing Locally Without Bundling](#executing-locally-without-bundling)
  * [Verification](#verification)
* [Related Projects](#related-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

<!--consumer-badges start -->

[![license](https://img.shields.io/github/license/travi/cli.svg)](LICENSE)
![node][node-badge]
[![npm][npm-badge]][npm-link]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @travi/cli -g
```

## Contributing

<!--contribution-badges start -->

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Renovate][renovate-badge]][renovate-link]
[![semantic-release: angular][semantic-release-badge]][semantic-release-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Executing Locally Without Bundling

```sh
$ npx babel-node src/index.js
```

### Verification

```sh
$ npm test
```

## Related Projects

* [@form8ion/project](https://npm.im/@form8ion/project)
* [@form8ion/javascript](https://npm.im/@form8ion/javascript)

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/travi/cli/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/travi/cli/node-ci.yml.svg?branch=master&logo=github

[node-badge]: https://img.shields.io/node/v/@travi/cli?logo=node.js

[npm-link]: https://www.npmjs.com/package/@travi/cli

[npm-badge]: https://img.shields.io/npm/v/@travi/cli?logo=npm

[coverage-link]: https://codecov.io/github/travi/cli

[coverage-badge]: https://img.shields.io/codecov/c/github/travi/cli?logo=codecov

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release
