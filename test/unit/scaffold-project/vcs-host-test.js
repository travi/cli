import {assert} from 'chai';
import any from '@travi/any';
import scaffoldVcsHost from '../../../src/scaffold-project/vcs-host';

suite('vcs host scaffolder', () => {
  test('that hosting details are returned', () => {
    const host = any.string();
    const projectName = any.string();

    return assert.becomes(scaffoldVcsHost({host, projectName}), {host, owner: 'travi', name: projectName});
  });
});
