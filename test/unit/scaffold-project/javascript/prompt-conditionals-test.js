import any from '@travi/any';
import {assert} from 'chai';
import {scopePromptShouldBePresented} from '../../../../src/scaffold-project/javascript/prompt-condiftionals';
import {questionNames} from '../../../../src/scaffold-project/javascript/scaffolder';

suite('javascript prompt conditionals', () => {
  suite('scope', () => {
    test('that a scope is presented for packages', () => {
      assert.isTrue(scopePromptShouldBePresented({[questionNames.PACKAGE_TYPE]: 'Package'}));
    });

    test('that a scope is not presented for non-packages', () => {
      assert.isFalse(scopePromptShouldBePresented({[questionNames.PACKAGE_TYPE]: any.string()}));
    });
  });
});
