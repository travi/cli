Feature: Add a package to an existing monorepo

  Scenario: Simple JavaScript package
    Given a lerna monorepo exists
    When a package is added to the monorepo
    Then the package will have repository details defined
