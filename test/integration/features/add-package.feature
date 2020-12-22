Feature: Add a package to an existing monorepo

  @wip
  Scenario: Simple JavaScript package
    Given a lerna monorepo exists
    And nvm is properly configured
    When a package is added to the monorepo
    Then the package will have repository details defined
