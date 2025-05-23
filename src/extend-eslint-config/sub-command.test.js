import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import extendAction from './action.js';
import liftCommand from './sub-command.js';

describe('extend-eslint-config sub-command', () => {
  it('should make the extend-eslint-config command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('extend-eslint-config').thenReturn({description});
    when(description).calledWith('Extend a @form8ion shareable ESLint config').thenReturn({action});

    liftCommand({command});

    expect(action).toHaveBeenCalledWith(extendAction);
  });
});
