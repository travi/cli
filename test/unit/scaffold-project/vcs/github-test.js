import scaffoldGithub from '../../../../src/scaffold-project/vcs/github';

suite('github', () => {
  test('that the settings file is produced', () => scaffoldGithub());
});
