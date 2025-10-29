import {project as projectPlugins} from './plugins.js';

export function defineScaffoldProjectOptions(decisions) {
  return {plugins: projectPlugins(decisions)};
}
