import * as snoCat from '@form8ion/sno-cat-ink';

import {afterEach, beforeEach, describe, it, vi, expect} from 'vitest';

import snoCatAction from './action.js';

describe('sno-cat action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/sno-cat-ink');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should groom the notifications with sno-cat', async () => {
    await snoCatAction();

    expect(snoCat.groom).toHaveBeenCalledOnce();
  });
});
