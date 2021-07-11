import {scaffold as scaffoldProject} from '@form8ion/project';
import {defineScaffoldProjectOptions} from '../common/project-options';

export default function (decisions) {
  return () => scaffoldProject(defineScaffoldProjectOptions(decisions))
    .catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    });
}
