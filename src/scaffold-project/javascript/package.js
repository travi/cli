export default function ({projectName, visibility, scope, packageType, license}) {
  return {
    name: `${scope ? `@${scope}/` : ''}${projectName}`,
    ...('Package' === packageType) && {version: '0.0.0-semantically-released'},
    license: license || 'UNLICENSED',
    ...('Application' === packageType) && {private: true},
    scripts: {
      ...('Application' === packageType) && {start: './lib/index.js'}
    },
    ...('Package' === packageType) && {publishConfig: {access: 'Public' === visibility ? 'public' : 'restricted'}}
  };
}
