import writeYaml from '../../../third-party-wrappers/write-yaml';

export default async function ({projectRoot, projectType, vcs, visibility}) {
  if ('JavaScript' !== projectType) return Promise.resolve({});

  await writeYaml(`${projectRoot}/.travis.yml`, {language: 'node_js', notifications: {email: false}});

  return {
    ...'Public' === visibility && {
      badge: {
        img: `https://img.shields.io/travis/${vcs.owner}/${vcs.name}.svg?branch=master`,
        link: `https://travis-ci.org/${vcs.owner}/${vcs.name}`,
        text: 'Build Status'
      }
    }
  };
}
