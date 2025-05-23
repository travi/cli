import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import * as scaffolderActionFactory from './action.js';
import scaffolderCommand from './sub-command.js';

describe('scaffold-project sub-command', () => {
  beforeEach(() => {
    vi.mock('./action');
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.exitCode = 0;
  });

  it('should provide the action to the sub-command', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    const scaffolderAction = () => undefined;
    when(command).calledWith('scaffold').thenReturn({description});
    when(description).calledWith('scaffold a new project').thenReturn({action});
    scaffolderActionFactory.default.mockReturnValue(scaffolderAction);

    scaffolderCommand({command});

    expect(action).toHaveBeenCalledWith(scaffolderAction);
  });
});
