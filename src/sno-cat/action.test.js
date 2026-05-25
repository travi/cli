import * as snoCat from '@form8ion/sno-cat-ink';

import {describe, it, vi, expect} from 'vitest';

import snoCatAction from './action.js';

vi.mock('@form8ion/sno-cat-ink');

describe('sno-cat action', () => {
  it('should groom the notifications with sno-cat', async () => {
    await snoCatAction();

    expect(snoCat.groom).toHaveBeenCalledOnce();
  });
});
