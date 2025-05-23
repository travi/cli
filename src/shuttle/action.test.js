import * as shuttle from '@form8ion/shuttle';

import {describe, it, expect, afterEach, vi, beforeEach} from 'vitest';

import shuttleAction from './action.js';

describe('ski-patrol action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/shuttle');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should move the project with shuttle', async () => {
    await shuttleAction();

    expect(shuttle.shuttle).toHaveBeenCalled();
  });
});
