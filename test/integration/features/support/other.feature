Feature: Other Project Type

  Scenario: simple
    Given the project should be versioned in git
    And the project language should be Other
    When the project is scaffolded
    Then JavaScript ignores are defined
