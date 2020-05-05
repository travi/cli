import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import liftAction from './action';

suite('lift action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(lifter, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the lift command is defined', async () => {
    const liftingResults = any.simpleObject();
    lifter.lift
      .withArgs({
        scaffolders: {
          Renovate: scaffoldRenovate,
          'Remove Greenkeeper': removeGreenkeeper,
          Cucumber: scaffoldCucumber
        }
      })
      .resolves(liftingResults);

    assert.equal(await liftAction(), liftingResults);
  });
});
