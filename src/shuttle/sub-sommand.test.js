import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';

import shuttleAction from './action.js';
import shuttleCommand from './sub-command.js';

describe('shuttle sub-command', () => {
  it('should make the shuttle command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('shuttle').thenReturn({description});
    when(description).calledWith('Shuttle a project to a different organization').thenReturn({action});

    shuttleCommand({command});

    expect(action).toHaveBeenCalledWith(shuttleAction);
  });
});
