import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';

import snoCatAction from './action.js';
import snoCatCommand from './sub-command.js';

describe('sno-cat sub-command', () => {
  it('should make the sno-cat command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('sno-cat').thenReturn({description});
    when(description).calledWith('Groom the GitHub notification list').thenReturn({action});

    snoCatCommand({command});

    expect(action).toHaveBeenCalledWith(snoCatAction);
  });
});
