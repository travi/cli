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
    await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}, status: {}}})
      .then(() => assert.calledWith(
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
          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {}, status: {}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license]: LICENSE
`)
          ));
        });

        test('the license file reference is not defined for an unlicensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}, status: {}}}).then(() => {
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
            badges: {consumer: {license: licenceBadge}, status: {}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-badge]: ${licenceBadge}
`)
          ));
        });

        test('the license badge reference is not defined for an unlicensed project', async () => {
          await scaffoldReadme({projectName, projectRoot, description, badges: {consumer: {}, status: {}}}).then(() => {
            assert.neverCalledWith(
              fs.writeFile,
              `${projectRoot}/README.md`,
              sinon.match(`
[license-badge]:`)
            );
          });
        });

        test(
          'the license badge reference is not defined for a licensed project that is not Github hosted',
          async () => {
            await scaffoldReadme({projectName, projectRoot, description, license, badges: {consumer: {}, status: {}}})
              .then(() => {
                assert.neverCalledWith(
                  fs.writeFile,
                  `${projectRoot}/README.md`,
                  sinon.match(`
[license-badge]:`)
                );
              });
          }
        );
      });

      suite('badge', () => {
        test('that the license badge is shown when provided', async () => {
          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {license: any.url()}, status: {}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });

        test('the license badge is not shown when not provided', async () => {
          await scaffoldReadme({
            projectName, projectRoot, description, badges: {consumer: {license: any.string()}, status: {}}
          }).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${license} license][license-badge]][license]
`)
          ));
        });

        test('that the ci badge is shown when provided', async () => {
          await scaffoldReadme({
            projectName,
            projectRoot,
            description,
            license,
            badges: {consumer: {}, status: {ci: any.url()}}
          }).then(() => assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![Build Status][ci-badge]][build]
`)
          ));
        });

        test('the ci badge is not shown when not provided', async () => {
          await scaffoldReadme({
            projectName, projectRoot, description, badges: {consumer: {}, status: {}}
          }).then(() => assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![Build Status][ci-badge]][build]
`)
          ));
        });
      });
    });

    suite('grouping', () => {
      test('that badges are separated into consumer, status, and contribution groups', async () => {
        const license = any.word();

        await scaffoldReadme({
          projectName,
          projectRoot,
          description,
          license,
          badges: {consumer: {license: any.url()}, status: {ci: any.url()}}
        }).then(() => assert.calledWith(
          fs.writeFile,
          `${projectRoot}/README.md`,
          sinon.match(`
<!-- consumer badges -->
[![${license} license][license-badge]][license]

<!-- status badges -->
[![Build Status][ci-badge]][build]

<!-- contribution badges -->
`)
        ));
      });
    });
  });
});
