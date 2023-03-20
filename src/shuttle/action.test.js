import * as shuttle from '@form8ion/shuttle';

import {describe, it, expect, afterEach, vi, beforeEach} from 'vitest';

import shuttleAction from './action';

describe('ski-patrol action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/shuttle');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should assess the project with ski-patrol', async () => {
    await shuttleAction();

    expect(shuttle.shuttle).toHaveBeenCalled();
  });
});
