import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

const {
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames
} = githubPromptConstants.questionNames;

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
