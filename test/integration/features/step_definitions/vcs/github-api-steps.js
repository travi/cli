import {After, Before, Given} from '@cucumber/cucumber';
import any from '@travi/any';
import nock from 'nock';
import {OK} from 'http-status-codes';

let githubScope;
export const githubToken = any.word();

Before(async () => {
  nock.disableNetConnect();

  githubScope = nock('https://api.github.com/');
});

After(() => {
  nock.enableNetConnect();
  nock.cleanAll();
});

Given(/^the GitHub token is valid$/, async function () {
  this.repoSshUrl = any.url();

  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post('/user/repos', {name: this.projectName, private: 'Private' === this.projectVisibility})
    .reply(OK, {
      ssh_url: this.repoSshUrl,
      html_url: any.url()
    });
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .get(`/users/${this.githubUser}/repos`)
    .reply(OK, []);
  githubScope
    .persist()    // really only want to persist POST calls to this endpoint, but this persists all calls to the scope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post(`/repos/${this.githubUser}/${this.projectName}/issues`)
    .reply(OK, {
      ssh_url: any.url(),
      html_url: any.url()
    });
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .get('/user')
    .reply(OK, {login: this.githubUser});
});
