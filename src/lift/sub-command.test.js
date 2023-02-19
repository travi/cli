import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import liftAction from './action';
import liftCommand from './sub-command';

describe('lift sub-command', () => {
  it('should make the lift command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('lift').mockReturnValue({description});
    when(description).calledWith('Lift an existing project with additional functionality').mockReturnValue({action});

    liftCommand({command});

    expect(action).toHaveBeenCalledWith(liftAction);
  });
});
