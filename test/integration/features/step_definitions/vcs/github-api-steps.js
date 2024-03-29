import {StatusCodes} from 'http-status-codes';
import deepEqual from 'deep-equal';

import {AfterAll, BeforeAll, Given} from '@cucumber/cucumber';
import any from '@travi/any';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

export const githubToken = any.word();

const server = setupServer();

server.events.on('request:start', ({request}) => {
  // eslint-disable-next-line no-console
  console.log('Outgoing:', request.method, request.url);
});

function authorizationHeaderIncludesToken(request) {
  return request.headers.get('authorization') === `token ${githubToken}`;
}

BeforeAll(async () => {
  server.listen();
});

AfterAll(() => {
  server.close();
});

Given(/^the GitHub token is valid$/, async function () {
  this.repoSshUrl = any.url();

  server.use(
    http.get(`https://api.github.com/repos/${this.githubUser}/${this.projectName}`, ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return new HttpResponse(null, {status: StatusCodes.NOT_FOUND});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
  server.use(
    http.post('https://api.github.com/user/repos', async ({request}) => {
      if (
        authorizationHeaderIncludesToken(request)
          && deepEqual(await request.json(), {name: this.projectName, private: 'Private' === this.visibility})
      ) {
        return HttpResponse.json({
          ssh_url: this.repoSshUrl,
          html_url: any.url()
        });
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
  server.use(
    http.post(`https://api.github.com/repos/${this.githubUser}/${this.projectName}/issues`, ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({
          ssh_url: any.url(),
          html_url: any.url()
        });
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
  server.use(
    http.get('https://api.github.com/user', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({login: this.githubUser});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
  server.use(
    http.get('https://api.github.com/user/orgs', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([]);
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
});
