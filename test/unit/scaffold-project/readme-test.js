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
    const badgeFactory = () => ({img: any.url(), link: any.url(), text: any.sentence()});
    const consumerBadges = any.objectWithKeys(any.listOf(any.word), {factory: badgeFactory});
    const statusBadges = any.objectWithKeys(any.listOf(any.word), {factory: badgeFactory});
    const assertBadgeIncludedInMarkdown = badgeData => Object.entries(badgeData).forEach(([name, badge]) => {
      assert.calledWith(
        fs.writeFile,
        `${projectRoot}/README.md`,
        sinon.match(`
[![${badge.text}][${name}-badge]][${name}-link]
`)
      );
      assert.calledWith(
        fs.writeFile,
        `${projectRoot}/README.md`,
        sinon.match(`
[${name}-badge]: ${badge.img}
`)
      );
      assert.calledWith(
        fs.writeFile,
        `${projectRoot}/README.md`,
        sinon.match(`
[${name}-link]: ${badge.link}
`)
      );
    });
    const buildBadgeGroup = badgeData => Object.entries(badgeData)
      .map(([name, badge]) => `[![${badge.text}][${name}-badge]][${name}-link]`);

    test('that the badges and references are generated from the provided data', async () => {
      await scaffoldReadme({projectRoot, badges: {consumer: consumerBadges, status: statusBadges}});

      assertBadgeIncludedInMarkdown(consumerBadges);
      assertBadgeIncludedInMarkdown(statusBadges);
    });

    test('that badges are separated into consumer, status, and contribution groups', async () => {
      await scaffoldReadme({
        projectName,
        projectRoot,
        description,
        badges: {consumer: consumerBadges, status: statusBadges}
      }).then(() => assert.calledWith(
        fs.writeFile,
        `${projectRoot}/README.md`,
        sinon.match(`
<!-- consumer badges -->
${buildBadgeGroup(consumerBadges).join('\n')}

<!-- status badges -->
${buildBadgeGroup(statusBadges).join('\n')}

<!-- contribution badges -->
`)
      ));
    });
  });
});
