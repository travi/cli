import * as skiPatrol from '@form8ion/ski-patrol';

import {afterEach, beforeEach, describe, it, vi, expect} from 'vitest';

import skiPatrolAction from './action';

describe('ski-patrol action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/ski-patrol');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should assess the project with ski-patrol', async () => {
    await skiPatrolAction();

    expect(skiPatrol.patrol).toHaveBeenCalledOnce();
  });
});
