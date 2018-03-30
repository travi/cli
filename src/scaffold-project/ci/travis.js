import writeYaml from '../../../third-party-wrappers/write-yaml';

export default async function ({projectRoot, projectType, vcs}) {
  if ('JavaScript' !== projectType) return Promise.resolve();

  await writeYaml(`${projectRoot}/.travis.yml`, {language: 'node_js', notifications: {email: false}});

  return {badge: `https://img.shields.io/travis/${vcs.owner}/${vcs.name}.svg?branch=master`};
}
