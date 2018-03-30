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

      test('that the license badge is shown when provided', async () => {
        const licenseText = any.sentence();
        const licenseBadge = any.url();
        const licenseLink = any.url();

        await scaffoldReadme({
          projectName,
          projectRoot,
          description,
          license,
          badges: {consumer: {license: {img: licenseBadge, text: licenseText, link: licenseLink}}, status: {}}
        }).then(() => {
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${licenseText}][license-badge]][license-link]
`)
          );
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-badge]: ${licenseBadge}
`)
          );
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[license-link]: ${licenseLink}
`)
          );
        });
      });

      test('the license badge is not shown when not provided', async () => {
        await scaffoldReadme({
          projectName, projectRoot, description, badges: {consumer: {}, status: {}}
        }).then(() => {
          assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match('[license-badge]][license-link]')
          );
          assert.neverCalledWith(fs.writeFile, `${projectRoot}/README.md`, sinon.match('[license-link]:'));
          assert.neverCalledWith(fs.writeFile, `${projectRoot}/README.md`, sinon.match('[license-badge]:'));
        });
      });

      test('that the ci badge is shown when provided', async () => {
        const ciText = any.sentence();
        const ciBadge = any.url();
        const ciLink = any.url();

        await scaffoldReadme({
          projectName,
          projectRoot,
          description,
          license,
          badges: {consumer: {}, status: {ci: {img: ciBadge, text: ciText, link: ciLink}}}
        }).then(() => {
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[![${ciText}][ci-badge]][ci-link]
`)
          );
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[ci-badge]: ${ciBadge}
`)
          );
          assert.calledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match(`
[ci-link]: ${ciLink}
`)
          );
        });
      });

      test('the ci badge is not shown when not provided', async () => {
        await scaffoldReadme({
          projectName, projectRoot, description, badges: {consumer: {}, status: {}}
        }).then(() => {
          assert.neverCalledWith(
            fs.writeFile,
            `${projectRoot}/README.md`,
            sinon.match('[ci-badge]][build]')
          );
          assert.neverCalledWith(fs.writeFile, `${projectRoot}/README.md`, sinon.match('[ci-link]:'));
          assert.neverCalledWith(fs.writeFile, `${projectRoot}/README.md`, sinon.match('[ci-badge]:'));
        });
      });
    });

    suite('grouping', () => {
      test('that badges are separated into consumer, status, and contribution groups', async () => {
        const licenseText = any.sentence();
        const ciText = any.sentence();

        await scaffoldReadme({
          projectName,
          projectRoot,
          description,
          badges: {
            consumer: {license: {img: any.url(), text: licenseText}},
            status: {ci: {img: any.url(), text: ciText}}
          }
        }).then(() => assert.calledWith(
          fs.writeFile,
          `${projectRoot}/README.md`,
          sinon.match(`
<!-- consumer badges -->
[![${licenseText}][license-badge]][license-link]

<!-- status badges -->
[![${ciText}][ci-badge]][ci-link]

<!-- contribution badges -->
`)
        ));
      });
    });
  });
});
