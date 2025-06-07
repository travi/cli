import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

import {describe, expect, it, vi, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {getGithubPrompt} from './prompts.js';

vi.mock('@form8ion/cli-core');

const {
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames
} = githubPromptConstants.questionNames;

const anyQuestion = () => ({type: any.word()});

describe('prompts', () => {
  describe('github prompt factory', () => {
    let prompt;
    const decisions = any.simpleObject();

    beforeEach(() => {
      prompt = vi.fn();

      when(getPrompt).calledWith(decisions).thenReturn(prompt);
    });

    it('should enable choosing the github account', async () => {
      const promptDetails = {id: githubPromptConstants.ids.GITHUB_DETAILS, ...any.simpleObject()};
      const promptAnswers = any.simpleObject();
      when(prompt).calledWith(promptDetails).thenResolve(promptAnswers);

      expect(await getGithubPrompt(decisions)(promptDetails)).toEqual(promptAnswers);
    });

    it('should enable defining required check bypass', async () => {
      const promptDetails = {id: githubPromptConstants.ids.REQUIRED_CHECK_BYPASS, ...any.simpleObject()};
      const promptAnswers = any.simpleObject();
      when(prompt).calledWith(promptDetails).thenResolve(promptAnswers);

      expect(await getGithubPrompt(decisions)(promptDetails)).toEqual(promptAnswers);
    });

    it('should confirm that repository admin settings should be managed as code', async () => {
      expect(await getGithubPrompt(decisions)({
        id: githubPromptConstants.ids.ADMIN_SETTINGS,
        questions: any.listOf(anyQuestion)
      })).toEqual({[repositoryAdminSettingsPromptQuestionNames.SETTINGS_MANAGED_AS_CODE]: true});
    });

    it('should throw an error when processing an unknown prompt', async () => {
      const unknownPromptId = any.word();
      const githubPrompt = getGithubPrompt(decisions);

      await expect(() => githubPrompt({id: unknownPromptId})).rejects.toThrowError(
        `Unknown prompt ID: ${unknownPromptId}`
      );
    });
  });
});
