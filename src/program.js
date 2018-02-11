import scaffoldProject from './scaffold-project';

export default function (program, {version}) {
  program.version(version);

  scaffoldProject(program);
}
