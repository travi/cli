import {scaffold as scaffoldProject} from '@travi/project-scaffolder';
import {defineScaffoldOptions} from '../common/options';

export default function (decisions) {
  return () => scaffoldProject(defineScaffoldOptions(decisions))
    .catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    });
}
