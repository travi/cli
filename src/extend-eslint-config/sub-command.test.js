import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import extendAction from './action';
import liftCommand from './sub-command';

describe('extend-eslint-config sub-command', () => {
  it('should make the extend-eslint-config command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('extend-eslint-config').mockReturnValue({description});
    when(description).calledWith('Extend a @form8ion shareable ESLint config').mockReturnValue({action});

    liftCommand({command});

    expect(action).toHaveBeenCalledWith(extendAction);
  });
});
