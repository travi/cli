import * as shuttle from '@form8ion/shuttle';

import {describe, it, expect, vi} from 'vitest';

import shuttleAction from './action.js';

vi.mock('@form8ion/shuttle');

describe('ski-patrol action', () => {
  it('should move the project with shuttle', async () => {
    await shuttleAction();

    expect(shuttle.shuttle).toHaveBeenCalled();
  });
});
