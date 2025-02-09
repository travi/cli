Feature: Scaffold an application

  Scenario: Hapi
    Given the project should be versioned in git
    And the GitHub token is valid
    And nvm is properly configured
    And the project language should be JavaScript
    And the project will use the "esm" dialect
    And the project is a Hapi application
    When the project is scaffolded
    Then the Hapi server is configured
    And cucumber is configured
