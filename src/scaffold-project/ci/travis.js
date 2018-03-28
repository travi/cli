import writeYaml from '../../../third-party-wrappers/write-yaml';

export default function ({projectRoot, projectType}) {
  if ('JavaScript' !== projectType) return Promise.resolve();

  return writeYaml(`${projectRoot}/.travis.yml`, {language: 'node_js', notifications: {email: false}});
}
