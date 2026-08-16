import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';
import {promptConstants as javascriptPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

const {
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames
} = githubPromptConstants.questionNames;
const {
  [javascriptPromptConstants.ids.JAVASCRIPT_BASE_DETAILS]: baseDetailsPromptQuestionNames
} = javascriptPromptConstants.questionNames;

export function getGithubPrompt(decisions) {
  const prompt = getPrompt(decisions);

  return async promptDetails => {
    const {id} = promptDetails;

    switch (id) {
      case githubPromptConstants.ids.GITHUB_DETAILS:
      case githubPromptConstants.ids.REQUIRED_CHECK_BYPASS:
        return prompt(promptDetails);
      case githubPromptConstants.ids.ADMIN_SETTINGS:
        return {[repositoryAdminSettingsPromptQuestionNames.SETTINGS_MANAGED_AS_CODE]: true};
      default:
        throw new Error(`Unknown prompt ID: ${id}`);
    }
  };
}

export function getJavascriptPrompt(decisions) {
  const prompt = getPrompt(decisions);
  const promptWithPackageManagerDecided = getPrompt({
    ...decisions,
    [baseDetailsPromptQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
  });

  return async promptDetails => {
    const {id} = promptDetails;

    switch (id) {
      case javascriptPromptConstants.ids.JAVASCRIPT_BASE_DETAILS:
        return promptWithPackageManagerDecided(promptDetails);
      case javascriptPromptConstants.ids.PROJECT_TYPE_PLUGIN:
      case javascriptPromptConstants.ids.PACKAGE_BUNDLER:
      case javascriptPromptConstants.ids.UNIT_TESTING:
      case javascriptPromptConstants.ids.INTEGRATION_TESTING:
        return prompt(promptDetails);
      default:
        throw new Error(`Unknown prompt ID: ${id}`);
    }
  };
}
