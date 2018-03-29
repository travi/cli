import writeYaml from '../../../third-party-wrappers/write-yaml';

export default function scaffoldGithub({projectRoot, projectType}) {
  return writeYaml(`${projectRoot}/.github/settings.yml`, {
    repository: {
      has_wiki: false,
      has_projects: false,
      has_downloads: false,
      allow_squash_merge: false,
      allow_merge_commit: true,
      allow_rebase_merge: true
    },
    ...('JavaScript' === projectType) && {labels: [{name: 'greenkeeper', color: '00c775'}]}
  });
}
