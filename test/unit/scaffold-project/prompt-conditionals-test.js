import {assert} from 'chai';
import {questionNames} from '../../../src/scaffold-project/scaffolder';
import {
  vcsHostPromptShouldBePresented,
  unlicensedConfirmationShouldBePresented
} from '../../../src/scaffold-project/prompt-conditionals';

suite('prompt conditionals', () => {
  suite('vcs host', () => {
    test('that the prompt is shown when a repository is initialized', () => {
      assert.isTrue(vcsHostPromptShouldBePresented({[questionNames.GIT_REPO]: true}));
    });

    test('that the prompt is not shown when a repository is not initialized', () => {
      assert.isFalse(vcsHostPromptShouldBePresented({[questionNames.GIT_REPO]: false}));
    });
  });

  suite('unlicensed confirmation', () => {
    test('that the unlicensed confirmation is shown for a private project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'Private'}));
    });

    test('that the unlicensed confirmation is not shown for a public project', () => {
      assert.isFalse(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'Public'}));
    });
  });
});
