import scaffoldGithub from './github';

export default async function ({host, projectName}) {
  if ('GitHub' === host) await scaffoldGithub();

  return {host, name: projectName, owner: 'travi'};
}
