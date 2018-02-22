import any from '@travi/any';
import {assert} from 'chai';
import buildPackageDetails from '../../../../src/scaffold-project/javascript/package';

suite('package details builder', () => {
  const projectName = any.string();
  const visibility = any.fromList(['Private', 'Public']);

  suite('name', () => {
    test('that the package name is defined', () => {
      const packageDetails = buildPackageDetails({projectName, visibility});

      assert.equal(packageDetails.name, projectName);
    });

    test('that the scope is included in the project name when provided', () => {
      const scope = any.word();

      const packageDetails = buildPackageDetails({projectName, visibility, scope});

      assert.equal(packageDetails.name, `@${scope}/${projectName}`);
    });
  });

  suite('private', () => {
    test('that the package is marked as private for an application', () => {
      const packageDetails = buildPackageDetails({visibility, packageType: 'Application'});

      assert.isTrue(packageDetails.private);
    });

    test('that the package is not marked as private for a package', () => {
      const packageDetails = buildPackageDetails({visibility, packageType: 'Package'});

      assert.isUndefined(packageDetails.private);
    });
  });

  suite('license', () => {
    test('that the license is defined as provided', () => {
      const license = any.word();

      const packageDetails = buildPackageDetails({license});

      assert.equal(packageDetails.license, license);
    });

    test('that the license is defined as `UNLICENSED` when not provided', () => {
      const packageDetails = buildPackageDetails({});

      assert.equal(packageDetails.license, 'UNLICENSED');
    });
  });

  suite('publish config', () => {
    test('that access is marked as restricted for private projects', () => {
      const packageDetails = buildPackageDetails({visibility: 'Private', packageType: 'Package'});

      assert.deepEqual(packageDetails.publishConfig, {access: 'restricted'});
    });

    test('that access is marked as public for public projects', () => {
      const packageDetails = buildPackageDetails({visibility: 'Public', packageType: 'Package'});

      assert.deepEqual(packageDetails.publishConfig, {access: 'public'});
    });

    test('that access is marked as restricted when visibility is omitted for some reason', () => {
      const packageDetails = buildPackageDetails({packageType: 'Package'});

      assert.deepEqual(packageDetails.publishConfig, {access: 'restricted'});
    });
  });

  suite('version', () => {
    test('that `version` is not set for applications', () => {
      const packageDetails = buildPackageDetails({packageType: 'Application'});

      assert.isUndefined(packageDetails.version);
    });

    test('that the `version` makes it clear that versioning is handled by semantic-release', () => {
      const packageDetails = buildPackageDetails({packageType: 'Package'});

      assert.equal(packageDetails.version, '0.0.0-semantically-released');
    });
  });
});
