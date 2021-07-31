Feature: Add a package to an existing monorepo

  Scenario: Simple JavaScript package
    Given a lerna monorepo exists
    And the project will use the "babel" dialect
    When a package is added to the monorepo
    Then the package will have repository details defined
