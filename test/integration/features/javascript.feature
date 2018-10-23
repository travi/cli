Feature: JavaScript Project

  @wip
  Scenario: simple
    Given the project should be versioned in git
    And the project language should be JavaScript
    When the project is scaffolded
    Then core ignores are defined
    And JavaScript ignores are defined
