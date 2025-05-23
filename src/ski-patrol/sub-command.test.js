import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';

import skiPatrolCommand from './sub-command.js';
import skiPatrolAction from './action.js';

describe('add-package action', () => {
  it('that the ski-patrol command is available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('ski-patrol').thenReturn({description});
    when(description).calledWith('Assess an existing project for issues to fix').thenReturn({action});

    skiPatrolCommand({command});

    expect(action).toHaveBeenCalledWith(skiPatrolAction);
  });
});
