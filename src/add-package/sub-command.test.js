import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import addPackageAction from './action.js';
import addPackageCommand from './sub-command.js';

describe('add-package sub-command', () => {
  it('should make the add-package command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('add-package').thenReturn({description});
    when(description).calledWith('Add a JavaScript package to an existing monorepo').thenReturn({action});

    addPackageCommand({command});

    expect(action).toHaveBeenCalledWith(addPackageAction);
  });
});
