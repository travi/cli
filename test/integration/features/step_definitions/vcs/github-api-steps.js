import {After, Before, Given} from '@cucumber/cucumber';
import any from '@travi/any';
import nock from 'nock';
import {StatusCodes} from 'http-status-codes';

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
    .get(`/repos/${this.githubUser}/${this.projectName}`)
    .reply(StatusCodes.NOT_FOUND);
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post('/user/repos', {name: this.projectName, private: 'Private' === this.projectVisibility})
    .reply(StatusCodes.OK, {
      ssh_url: this.repoSshUrl,
      html_url: any.url()
    });
  githubScope
    .persist()    // really only want to persist POST calls to this endpoint, but this persists all calls to the scope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post(`/repos/${this.githubUser}/${this.projectName}/issues`)
    .reply(StatusCodes.OK, {
      ssh_url: any.url(),
      html_url: any.url()
    });
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .get('/user')
    .reply(StatusCodes.OK, {login: this.githubUser});
});
