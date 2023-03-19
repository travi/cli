import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import * as scaffolderActionFactory from './action';
import scaffolderCommand from './sub-command';

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
    when(command).calledWith('scaffold').mockReturnValue({description});
    when(description).calledWith('scaffold a new project').mockReturnValue({action});
    scaffolderActionFactory.default.mockReturnValue(scaffolderAction);

    scaffolderCommand({command});

    expect(action).toHaveBeenCalledWith(scaffolderAction);
  });
});
