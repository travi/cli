Feature: ESLint Config

  Scenario: High-level Scaffold
    Given the eslint config to be extended exists from the form8ion scope
    And the project should be versioned in git
    And the GitHub token is valid
    And the project language should be JavaScript
    And nvm is properly configured
    When the high-level eslint-config scaffolder is executed
    And core ignores are defined
    And the base git files should be present
    And the proper form8ion eslint config is extended
