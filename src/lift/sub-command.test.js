import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import liftAction from './action.js';
import liftCommand from './sub-command.js';

describe('lift sub-command', () => {
  it('should make the lift command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('lift').thenReturn({description});
    when(description).calledWith('Lift an existing project with additional functionality').thenReturn({action});

    liftCommand({command});

    expect(action).toHaveBeenCalledWith(liftAction);
  });
});
