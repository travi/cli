import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {project} from './plugins.js';
import {defineScaffoldProjectOptions} from './project-options.js';

vi.mock('./enhanced-plugins.js');
vi.mock('./plugins.js');

describe('common config', () => {
  const decisions = any.simpleObject();

  it('should define scaffold-project options', () => {
    const plugins = any.simpleObject();
    when(project).calledWith(decisions).mockReturnValue(plugins);

    expect(defineScaffoldProjectOptions(decisions)).toEqual({plugins, decisions});
  });
});
