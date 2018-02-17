import {assert} from 'chai';
import {questionNames} from '../../../src/scaffold-project/scaffolder';
import {vcsHostPromptShouldBePresented} from '../../../src/scaffold-project/prompt-conditionals';

suite('prompt conditionals', () => {
  suite('vcs host', () => {
    test('that the prompt is shown when a repository is initialized', () => {
      assert.isTrue(vcsHostPromptShouldBePresented({[questionNames.GIT_REPO]: true}));
    });

    test('that the prompt is not shown when a repository is not initialized', () => {
      assert.isFalse(vcsHostPromptShouldBePresented({[questionNames.GIT_REPO]: false}));
    });
  });
});
