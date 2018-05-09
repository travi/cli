import {addSubCommand} from '@travi/scaffolder-sub-command';

export default function (program, {version}) {
  program.version(version);

  addSubCommand(program);
}
