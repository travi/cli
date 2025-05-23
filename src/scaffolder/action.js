import {scaffold as scaffoldProject} from '@form8ion/project';
import {defineScaffoldProjectOptions} from '../common/project-options.js';

export default function scaffoldAction(decisions) {
  return () => scaffoldProject(defineScaffoldProjectOptions(decisions));
}
