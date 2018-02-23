import any from '@travi/any';
import {assert} from 'chai';
import buildPackageDetails from '../../../../src/scaffold-project/javascript/package';

suite('package details builder', () => {
  const projectName = any.string();
  const visibility = any.fromList(['Private', 'Public']);

  suite('name', () => {
    test('that the package name is defined', () => {
      const packageDetails = buildPackageDetails({projectName, visibility, tests: {}});

      assert.equal(packageDetails.name, projectName);
    });

    test('that the scope is included in the project name when provided', () => {
      const scope = any.word();

      const packageDetails = buildPackageDetails({projectName, visibility, scope, tests: {}});

      assert.equal(packageDetails.name, `@${scope}/${projectName}`);
    });
  });

  suite('private', () => {
    test('that the package is marked as private for an application', () => {
      const packageDetails = buildPackageDetails({visibility, packageType: 'Application', tests: {}});

      assert.isTrue(packageDetails.private);
    });

    test('that the package is not marked as private for a package', () => {
      const packageDetails = buildPackageDetails({visibility, packageType: 'Package', tests: {}});

      assert.isUndefined(packageDetails.private);
    });
  });

  suite('license', () => {
    test('that the license is defined as provided', () => {
      const license = any.word();

      const packageDetails = buildPackageDetails({license, tests: {}});

      assert.equal(packageDetails.license, license);
    });

    test('that the license is defined as `UNLICENSED` when not provided', () => {
      const packageDetails = buildPackageDetails({tests: {}});

      assert.equal(packageDetails.license, 'UNLICENSED');
    });
  });

  suite('publish config', () => {
    test('that access is marked as restricted for private projects', () => {
      const packageDetails = buildPackageDetails({visibility: 'Private', packageType: 'Package', tests: {}});

      assert.deepEqual(packageDetails.publishConfig, {access: 'restricted'});
    });

    test('that access is marked as public for public projects', () => {
      const packageDetails = buildPackageDetails({visibility: 'Public', packageType: 'Package', tests: {}});

      assert.deepEqual(packageDetails.publishConfig, {access: 'public'});
    });

    test('that access is marked as restricted when visibility is omitted for some reason', () => {
      const packageDetails = buildPackageDetails({packageType: 'Package', tests: {}});

      assert.deepEqual(packageDetails.publishConfig, {access: 'restricted'});
    });
  });

  suite('version', () => {
    test('that `version` is not set for applications', () => {
      const packageDetails = buildPackageDetails({packageType: 'Application', tests: {}});

      assert.isUndefined(packageDetails.version);
    });

    test('that the `version` makes it clear that versioning is handled by semantic-release', () => {
      const packageDetails = buildPackageDetails({packageType: 'Package', tests: {}});

      assert.equal(packageDetails.version, '0.0.0-semantically-released');
    });
  });

  suite('scripts', () => {
    suite('start', () => {
      test('that the `start` script is not defined for a package', () => {
        const packageDetails = buildPackageDetails({packageType: 'Package', tests: {}});

        assert.isUndefined(packageDetails.scripts.start);
      });

      test('that the `start` script runs the built version of the app with the `node` executable', () => {
        const packageDetails = buildPackageDetails({packageType: 'Application', tests: {}});

        assert.equal(packageDetails.scripts.start, './lib/index.js');
      });

      suite('tests', () => {
        suite('unit', () => {
          test('that the script is included if the project will be unit tested', () => {
            const packageDetails = buildPackageDetails({tests: {unit: true}});

            assert.equal(packageDetails.scripts['test:unit'], 'mocha --recursive test/unit');
          });

          test('that the script is not included if the project will not be unit tested', () => {
            const packageDetails = buildPackageDetails({tests: {unit: false}});

            assert.isUndefined(packageDetails.scripts['test:unit']);
          });
        });

        suite('integratin', () => {
          test('that the script is included if the project will be integration tested', () => {
            const packageDetails = buildPackageDetails({tests: {integration: true}});

            assert.equal(
              packageDetails.scripts['test:integration'],
              'cucumber-js test/integration --require-module babel-register --format-options \'{\\"snippetInterface\\": \\"async-await\\"}\''     // eslint-disable-line max-len
            );
          });

          test('that the script is not included if the project will not be integration tested', () => {
            const packageDetails = buildPackageDetails({tests: {integration: false}});

            assert.isUndefined(packageDetails.scripts['integration:unit']);
          });
        });
      });
    });
  });
});
