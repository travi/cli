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
    await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}}}).then(() => assert.calledWith(
      fs.writeFile,
      `${projectRoot}/README.md`,
      sinon.match(`# ${projectName}

${description}`)
    ));
  });

  suite('badges', () => {
    suite('license', () => {
      const license = any.word();
      const repoOwner = 'travi';
      const repoName = 'cli';

      suite('references', () => {
        test('the license file reference is defined for a licensed project', async () => {
          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license]: LICENSE
`)
          ));
        });

        test('the license file reference is not defined for an unlicensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}}}).then(() => {
            assert.neverCalledWith(
              fs.writeFile,
              `${projectRoot}/README.md`,
              sinon.match(`
[license]: LICENSE
`)
            );
          });
        });

        test('the license badge reference is defined when a license badge is provided', async () => {
          const licenceBadge = any.url();

          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {license: licenceBadge}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-badge]: ${licenceBadge}
`)
          ));
        });

        test('the license badge reference is not defined for an unlicensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}}}).then(() => {
            assert.neverCalledWith(
              fs.writeFile,
              `${projectRoot}/README.md`,
              sinon.match(`
[license-badge]: https://img.shields.io/github/license/${repoOwner}/${repoName}.svg
`)
            );
          });
        });

        test(
          'the license badge reference is not defined for a licensed project that is not Github hosted',
          async () => {
            await scaffoldReadme({projectName, projectRoot, description, license, badges: {consumer: {}}}).then(() => {
              assert.neverCalledWith(
                fs.writeFile,
                `${projectRoot}/README.md`,
                sinon.match(`
[license-badge]: `)
              );
            });
          }
        );
      });

      suite('badge', () => {
        test('that the license badge is shown for licensed, GitHub hosted projects', async () => {
          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {license: any.url()}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });

        test('the license badge is not shown for an unlicensed project', async () => {
          await scaffoldReadme({
            projectName, projectRoot, description, badges: {consumer: {license: any.string()}}
          }).then(() => assert.neverCalledWith(
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
        const license = any.word();

        await scaffoldReadme({projectName, projectRoot, description, license, badges: {consumer: {license: any.url()}}})
          .then(() => assert.calledWith(
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
