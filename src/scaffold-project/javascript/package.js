export default function ({projectName, visibility, scope, packageType, license, tests, vcs}) {
  return {
    name: `${scope ? `@${scope}/` : ''}${projectName}`,
    ...('Package' === packageType) && {version: '0.0.0-semantically-released'},
    license: license || 'UNLICENSED',
    ...('Application' === packageType) && {private: true},
    ...('GitHub' === vcs.host) && {
      repository: `${vcs.owner}/${vcs.name}`,
      bugs: `https://github.com/${vcs.owner}/${vcs.name}/issues`,
      homepage: `https://github.com/${vcs.owner}/${vcs.name}#readme`
    },
    scripts: {
      ...('Application' === packageType) && {start: './lib/index.js'},
      ...tests.unit && {'test:unit': 'mocha --recursive test/unit'},
      ...tests.integration && {'test:integration': 'cucumber-js test/integration --require-module babel-register --format-options \'{"snippetInterface": "async-await"}\''}     // eslint-disable-line max-len
    },
    ...('Package' === packageType) && {publishConfig: {access: 'Public' === visibility ? 'public' : 'restricted'}}
  };
}
