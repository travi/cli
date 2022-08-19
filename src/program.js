import scaffolderCommand from './scaffolder';
import liftCommand from './lift';
import skiPatrolCommand from './ski-patrol';
import shuttleCommand from './shuttle';
import snoCatCommand from './sno-cat';
import addPackageCommand from './add-package';

export default function (program, {version}) {
  program.version(version);

  scaffolderCommand(program);
  liftCommand(program);
  skiPatrolCommand(program);
  shuttleCommand(program);
  snoCatCommand(program);
  addPackageCommand(program);
}
