import {After, Before, Given} from 'cucumber';
import any from '@travi/any';
import nock from 'nock';
import {OK} from 'http-status-codes';

let githubScope;
export const githubToken = any.string();
const debug = require('debug')('test');

Before(async () => {
  nock.disableNetConnect();

  githubScope = nock('https://api.github.com/').log(debug);
});

After(() => {
  nock.enableNetConnect();
  nock.cleanAll();
});

Given(/^the GitHub token is valid$/, async function () {
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post('/user/repos')
    .reply(OK);
});
