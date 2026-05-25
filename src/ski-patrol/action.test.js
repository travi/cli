import * as skiPatrol from '@form8ion/ski-patrol';

import {describe, it, vi, expect} from 'vitest';

import skiPatrolAction from './action.js';

vi.mock('@form8ion/ski-patrol');

describe('ski-patrol action', () => {
  it('should assess the project with ski-patrol', async () => {
    await skiPatrolAction();

    expect(skiPatrol.patrol).toHaveBeenCalledOnce();
  });
});
