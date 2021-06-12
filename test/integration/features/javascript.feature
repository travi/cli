Feature: JavaScript Project

  Scenario: simple
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be JavaScript
    And nvm is properly configured
    When the project is scaffolded
    Then the core JavaScript files are present
    And core ignores are defined
    And the base git files should be present
    And the project will have repository details defined
#    And JavaScript ignores are defined

  Scenario: presentation
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be JavaScript
    And the project is a presentation
    And nvm is properly configured
    When the project is scaffolded
    Then the core JavaScript files are present
