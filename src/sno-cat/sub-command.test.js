import {describe, it, vi, expect} from 'vitest';
import {when} from 'jest-when';

import snoCatAction from './action';
import snoCatCommand from './sub-command';

describe('sno-cat sub-command', () => {
  it('should make the sno-cat command available', async () => {
    const command = vi.fn();
    const description = vi.fn();
    const action = vi.fn();
    when(command).calledWith('sno-cat').mockReturnValue({description});
    when(description).calledWith('Groom the GitHub notification list').mockReturnValue({action});

    snoCatCommand({command});

    expect(action).toHaveBeenCalledWith(snoCatAction);
  });
});
