import {describe, it, vi, expect} from 'vitest';
import {when} from 'jest-when';

import shuttleAction from './action.js';
import shuttleCommand from './sub-command.js';

describe('shuttle sub-command', () => {
  it('should make the shuttle command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('shuttle').mockReturnValue({description});
    when(description).calledWith('Shuttle a project to a different organization').mockReturnValue({action});

    shuttleCommand({command});

    expect(action).toHaveBeenCalledWith(shuttleAction);
  });
});
