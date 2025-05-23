import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import * as scaffoldSubCommand from './scaffolder/sub-command.js';
import * as lift from './lift/sub-command.js';
import * as skiPatrol from './ski-patrol/sub-command.js';
import * as shuttle from './shuttle/sub-command.js';
import * as snoCat from './sno-cat/sub-command.js';
import * as addPackage from './add-package/sub-command.js';
import configureProgram from './program.js';

describe('cli', () => {
  beforeEach(() => {
    vi.mock('./scaffolder/sub-command');
    vi.mock('./lift/sub-command');
    vi.mock('./ski-patrol/sub-command');
    vi.mock('./shuttle/sub-command');
    vi.mock('./sno-cat/sub-command');
    vi.mock('./add-package/sub-command');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the version based on the package file', () => {
    const version = any.string();
    const versionStub = vi.fn();
    const program = {...any.simpleObject(), version: versionStub};

    configureProgram(program, {version});

    expect(versionStub).toHaveBeenCalledWith(version);
    expect(scaffoldSubCommand.default).toHaveBeenCalledWith(program);
    expect(lift.default).toHaveBeenCalledWith(program);
    expect(skiPatrol.default).toHaveBeenCalledWith(program);
    expect(shuttle.default).toHaveBeenCalledWith(program);
    expect(snoCat.default).toHaveBeenCalledWith(program);
    expect(addPackage.default).toHaveBeenCalledWith(program);
  });
});
