Feature: PHP Project

  Scenario: Scaffold
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be PHP
    When the project is scaffolded
    Then the core PHP files are present
