import {getPrompt} from '@form8ion/cli-core';
import {promptConstants as githubPromptConstants} from '@form8ion/github';
import {promptConstants as javascriptPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

import {describe, expect, it, vi, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {getGithubPrompt, getJavascriptPrompt} from './prompts.js';

vi.mock('@form8ion/cli-core');

const {
  [githubPromptConstants.ids.ADMIN_SETTINGS]: repositoryAdminSettingsPromptQuestionNames
} = githubPromptConstants.questionNames;
const {
  [javascriptPromptConstants.ids.BASE_DETAILS]: baseDetailsPromptQuestionNames
} = javascriptPromptConstants.questionNames;

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

  describe('javascript prompt factory', () => {
    let prompt, promptWithPackageManagerDecided;
    const decisions = any.simpleObject();

    beforeEach(() => {
      prompt = vi.fn();
      promptWithPackageManagerDecided = vi.fn();

      when(getPrompt).calledWith(decisions).thenReturn(prompt);
      when(getPrompt)
        .calledWith({...decisions, [baseDetailsPromptQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM})
        .thenReturn(promptWithPackageManagerDecided);
    });

    it('should decide the package manager for the base-details prompt', async () => {
      const promptDetails = {id: javascriptPromptConstants.ids.BASE_DETAILS, ...any.simpleObject()};
      const promptAnswers = any.simpleObject();
      when(promptWithPackageManagerDecided).calledWith(promptDetails).thenResolve(promptAnswers);

      expect(await getJavascriptPrompt(decisions)(promptDetails)).toEqual(promptAnswers);
    });

    it.each([
      ['PROJECT_TYPE_PLUGIN', javascriptPromptConstants.ids.PROJECT_TYPE_PLUGIN],
      ['PACKAGE_BUNDLER', javascriptPromptConstants.ids.PACKAGE_BUNDLER],
      ['UNIT_TESTING', javascriptPromptConstants.ids.UNIT_TESTING],
      ['INTEGRATION_TESTING', javascriptPromptConstants.ids.INTEGRATION_TESTING]
    ])('should enable input for the `%s` prompt', async (name, id) => {
      const promptDetails = {id, ...any.simpleObject()};
      const promptAnswers = any.simpleObject();
      when(prompt).calledWith(promptDetails).thenResolve(promptAnswers);

      expect(await getJavascriptPrompt(decisions)(promptDetails)).toEqual(promptAnswers);
    });

    it('should throw an error when processing an unknown prompt', async () => {
      const unknownPromptId = any.word();
      const javascriptPrompt = getJavascriptPrompt(decisions);

      await expect(() => javascriptPrompt({id: unknownPromptId})).rejects.toThrowError(
        `Unknown prompt ID: ${unknownPromptId}`
      );
    });
  });
});
