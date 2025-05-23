import {promises as fs} from 'node:fs';
import {assert} from 'chai';
import {load} from 'js-yaml';
import {Then} from '@cucumber/cucumber';

Then('GitHub is configured', async function () {
  const ADMIN_ROLE = 5;
  const repositorySettings = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`));
  const bypassActor = repositorySettings.rulesets.find(rule => 'verification must pass' === rule.name).bypass_actors[0];

  assert.equal(
    repositorySettings.repository.homepage,
    `https://npm.im/${this.scope ? `@${this.scope}/` : ''}${this.projectName}`
  );
  assert.equal(bypassActor.actor_type, 'RepositoryRole');
  assert.equal(bypassActor.actor_id, ADMIN_ROLE);
});
