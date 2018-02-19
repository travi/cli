import fs from 'mz/fs';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldReadme from '../../../src/scaffold-project/readme';

suite('scaffold readme', () => {
  let sandbox;
  const projectName = any.word();
  const projectRoot = any.word();
  const description = any.word();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');

    fs.writeFile.resolves();
  });

  teardown(() => sandbox.restore());

  test('that the README has a top-level heading of the project name and includes the description', async () => {
    await scaffoldReadme({projectName, projectRoot, description}).then(() => assert.calledWith(
      fs.writeFile,
      `${projectRoot}/README.md`,
      sinon.match(`# ${projectName}

${description}`)
    ));
  });

  suite('badges', () => {
    suite('license', () => {
      const license = any.word();

      suite('references', () => {
        test('the license file reference is defined for a licensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description, license}).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license]: LICENSE
`)
          ));
        });

        test('the license file reference is not defined for an unlicensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description}).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license]: LICENSE
`)
          ));
        });

        test('the license badge reference is defined for a licensed, GitHub-hosted project', async () => {
          const vcs = {host: 'GitHub'};

          await scaffoldReadme({projectName, projectRoot, description, license, vcs}).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-badge]: https://img.shields.io/github/license/travi/cli.svg
`)
          ));
        });

        test('the license badge reference is not defined for an unlicensed project', async () => {
          const vcs = {host: 'github'};

          await scaffoldReadme({projectName, projectRoot, description, vcs}).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-badge]: https://img.shields.io/github/license/travi/cli.svg
`)
          ));
        });

        test(
          'the license badge reference is not defined for a licensed project that is not Github hosted',
          async () => {
            await scaffoldReadme({projectName, projectRoot, description, license}).then(() => assert.neverCalledWith(
              fs.writeFile,
              `${projectRoot}/README.md`,
              sinon.match(`
[license-badge]: https://img.shields.io/github/license/travi/cli.svg
`)
            ));
          }
        );
      });

      suite('badge', () => {
        test('that the license badge is shown for licensed, GitHub hosted projects', async () => {
          const vcs = {host: 'GitHub'};

          await scaffoldReadme({projectName, projectRoot, description, license, vcs}).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });

        test('the license badge is not shown for an unlicensed project', async () => {
          const vcs = {host: 'github'};

          await scaffoldReadme({projectName, projectRoot, description, vcs}).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });

        test('the license badge is not shown for a licensed project that is not Github hosted', async () => {
          await scaffoldReadme({projectName, projectRoot, description, license}).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });
      });
    });

    suite('grouping', () => {
      test('that badges are separated into consumer, status, and contribution groups', async () => {
        const vcs = {host: 'GitHub'};
        const license = any.word();

        await scaffoldReadme({projectName, projectRoot, description, vcs, license}).then(() => assert.calledWith(
          fs.writeFile,
          `${projectRoot}/README.md`,
          sinon.match(`
<!-- consumer badges -->
[![${license} license][license-badge]][license]

<!-- status badges -->

<!-- contribution badges -->
`)
        ));
      });
    });
  });
});
