import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import addPackageAction from './action.js';
import addPackageCommand from './sub-command.js';

describe('add-package sub-command', () => {
  it('should make the add-package command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('add-package').mockReturnValue({description});
    when(description).calledWith('Add a JavaScript package to an existing monorepo').mockReturnValue({action});

    addPackageCommand({command});

    expect(action).toHaveBeenCalledWith(addPackageAction);
  });
});
