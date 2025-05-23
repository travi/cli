import scaffolderCommand from './scaffolder/index.js';
import liftCommand from './lift/index.js';
import skiPatrolCommand from './ski-patrol/index.js';
import shuttleCommand from './shuttle/index.js';
import snoCatCommand from './sno-cat/index.js';
import addPackageCommand from './add-package/index.js';

export default function configureProgram(program, {version}) {
  program.version(version);

  scaffolderCommand(program);
  liftCommand(program);
  skiPatrolCommand(program);
  shuttleCommand(program);
  snoCatCommand(program);
  addPackageCommand(program);
}
