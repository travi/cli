import scaffoldGithub from './github';

export default async function ({host, projectName, projectRoot}) {
  if ('GitHub' === host) await scaffoldGithub(projectRoot);

  return {host, name: projectName, owner: 'travi'};
}
