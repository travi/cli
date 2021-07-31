Feature: JavaScript Project

  Scenario: simple
    Given the project should be versioned in git
    And the project language should be JavaScript
    And the project will use the "babel" dialect
    And the GitHub token is valid
    And nvm is properly configured
    When the project is scaffolded
    Then the core JavaScript files are present
    And core ignores are defined
    And the base git files should be present
    And the project will have repository details defined
#    And JavaScript ignores are defined

  Scenario: presentation
    Given the project should be versioned in git
    And the project language should be JavaScript
    And the project will use the "babel" dialect
    And the GitHub token is valid
    And the project is a presentation
    And nvm is properly configured
    When the project is scaffolded
    Then the core JavaScript files are present

  Scenario: Scaffold new Lerna repo
    Given the project should be versioned in git
    And the project is a monorepo
    And the project language should be JavaScript
    And the project will use the "common-js" dialect
    And nvm is properly configured
    When the project is scaffolded
    Then the project will have repository details defined
    And the lerna details are configured
