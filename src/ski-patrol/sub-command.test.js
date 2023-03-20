import {describe, it, vi, expect} from 'vitest';
import {when} from 'jest-when';

import skiPatrolCommand from './sub-command';
import skiPatrolAction from './action';

describe('add-package action', () => {
  it('that the ski-patrol command is available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('ski-patrol').mockReturnValue({description});
    when(description).calledWith('Assess an existing project for issues to fix').mockReturnValue({action});

    skiPatrolCommand({command});

    expect(action).toHaveBeenCalledWith(skiPatrolAction);
  });
});
