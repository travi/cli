# AGENTS.md: AI Agent Guide for `@travi/cli`

## Executive Summary

This package is a __thin CLI adapter__ over the form8ion project ecosystem.
It wires Matt Travi's personal/organization defaults into `@form8ion/project`,
`@form8ion/javascript`, and `@form8ion/lift`, and composes a large set of
form8ion and `@travi` ecosystem plugins so the `travi` command scaffolds,
lifts, and maintains projects with the conventions used across travi's repos.
Most behavior should stay in upstream packages.
This repository should primarily compose plugins, prompts, and reporting.

---

## Architecture Overview

### Command Flow

1. __Entry point__ (`src/index.js`) boots the CLI via `commander` +
   `inquander`, and configures the update notifier.
1. __CLI wiring__ (`src/program.js`) registers each command's `commander`
   sub-command against the shared `program` instance.
1. Each command lives in its own directory under `src/` with a consistent
   shape:
   * `index.js` — re-exports the sub-command as the directory's default
     export.
   * `sub-command.js` — registers the `commander` command (name,
     description, action).
   * `action.js` — the command's behavior, generally delegating to an
     upstream form8ion (or `@travi`) package.
1. __Shared command helpers__ under `src/common/` define the plugin graph,
   prompt behavior, and shared option-building that tailor upstream packages
   to travi's conventions.

### Commands

* `scaffold` delegates to `@form8ion/project` — scaffold a new project.
* `lift` delegates to `@form8ion/lift` — lift an existing project with
  additional functionality.
* `add-package` delegates to `@form8ion/add-package-to-monorepo` — add a
  JavaScript package to an existing monorepo.
* `extend-eslint-config` delegates to `@form8ion/eslint-config-extender` —
  extend a `@form8ion` shareable ESLint config.
* `ski-patrol` delegates to `@form8ion/ski-patrol` — assess an existing
  project for issues to fix.
* `shuttle` delegates to `@form8ion/shuttle` — shuttle a project to a
  different organization.
* `sno-cat` delegates to `@form8ion/sno-cat-ink` — groom the GitHub
  notification list.

`scaffold`, `lift`, `add-package`, and `extend-eslint-config` all pass
travi-specific plugin composition and/or pre-answered prompts (from
`src/common/`) into their upstream package. `ski-patrol`, `shuttle`, and
`sno-cat` are currently pure pass-throughs with no local customization — keep
them that way unless there's a concrete need for travi-specific behavior.

### Relationship to Upstream Packages

This repository sits above the core orchestration packages.

* `@form8ion/project` owns the primary scaffold flow, prompt registry, and
  most project-level orchestration semantics.
* `@form8ion/javascript` owns JavaScript-language scaffolding, testing, and
  package-level plugin composition.
* `@form8ion/lift` owns the lift orchestration flow (scaffolders vs.
  enhancers).
* This CLI should reuse those contracts rather than reimplementing them.
* When behavior belongs to project orchestration or language-plugin logic,
  prefer changing the upstream package instead of adding bespoke logic here.

### Repository Purpose and Boundaries

The main responsibilities here are:

* registering commands
* composing plugin collections (languages, VCS hosts, coverage services,
  dependency updaters, JS application/package types, test frameworks,
  bundlers, hosts, CI services)
* pre-answering travi-specific prompts (e.g. GitHub admin settings managed as
  code)
* enhancing upstream plugins with injected defaults or wrappers (e.g. travi's
  shared ESLint/commitlint/babel/remark configs)
* reporting results to the terminal

Avoid moving domain logic from `@form8ion/project`, `@form8ion/javascript`,
or `@form8ion/lift` into this package unless the behavior is truly
CLI-specific.

---

## File Structure and Composition Pattern

### Important Directories

* `src/index.js` boots the executable entry.
* `src/program.js` registers every command against the `commander` program.
* `src/scaffolder/`, `src/lift/`, `src/add-package/`,
  `src/extend-eslint-config/`, `src/ski-patrol/`, `src/shuttle/`,
  `src/sno-cat/` each contain a command's `index.js` / `sub-command.js` /
  `action.js`.
* `src/common/` contains shared plugin factories (`plugins.js`,
  `enhanced-plugins.js`, `enhanced-scaffolders.js`), prompt handlers
  (`prompts.js`), option builders (`project-options.js`,
  `javascript-options.js`), test framework maps (`test-frameworks.js`), and
  travi's shared tooling config (`javascript-configs.js`).
* `test/integration/features/` contains end-to-end Cucumber scenarios.

### Composition Pattern

Most files in this repository should do one of these things:

* delegate to an upstream package
* adapt dependency injection
* add travi-specific defaults
* combine multiple upstream plugins into a single CLI experience

Examples in the current codebase:

* `src/common/enhanced-plugins.js` wraps `@form8ion/javascript` and
  `@travi/shell-scaffolder`, swapping in the enhanced scaffolders from
  `src/common/enhanced-scaffolders.js`.
* `src/common/prompts.js` (`getGithubPrompt`) answers selected
  `@form8ion/github` prompts with travi's defaults and delegates the rest.
* `src/common/javascript-options.js` (`defineScaffoldJavascriptOptions`)
  injects travi's shared configs and pre-selects `npm` as the package
  manager.

Keep these adapters small.
If they start owning workflow policy or feature logic, that is usually a sign
the change belongs upstream.

---

## Prompt and Plugin Wiring Patterns

### Prompt Ownership

Prompt IDs and question-name registries are owned by the upstream package
that defines the prompt.

* `@form8ion/project` owns project scaffold prompt IDs and question names.
* `@form8ion/github` owns GitHub-related prompt IDs and question names.
* `@form8ion/javascript` owns JavaScript prompt questions and answer keys.

This repository should consume those public contracts.
Do not duplicate prompt constants locally unless there is no upstream export.

### Prompt Consumer Pattern

When adapting prompt behavior (see `src/common/prompts.js`):

* destructure `ids` and `questionNames` from the upstream `promptConstants`
* switch on `id`
* answer only the prompts this CLI intentionally owns
* delegate other interactive prompts through the shared `getPrompt` utility
  (`@form8ion/cli-core`) when appropriate
* throw on unknown prompt IDs rather than silently swallowing them

### Plugin Composition Pattern

Plugin collections should stay aligned with upstream plugin contracts.

* project-level plugin groups should match what `@form8ion/project` expects
  (`languages`, `vcsHosts`, `coverageServices`, `dependencyUpdaters`, and
  similar upstream groupings) — see `src/common/plugins.js`
* JavaScript plugin groups should match what `@form8ion/javascript` expects
  (`applicationTypes`, `packageTypes`, `monorepoTypes`, `unitTestFrameworks`,
  `integrationTestFrameworks`, `packageBundlers`, `hosts`, `ciServices`, and
  similar) — see `src/common/javascript-options.js`
* lift enhancer/scaffolder groups should match what `@form8ion/lift` expects
  — see `src/lift/action.js`
* enhanced plugin factories should preserve upstream exports and only
  override the conventions intentionally customized by this CLI

For example, `javascriptPluginFactory()` in `src/common/enhanced-plugins.js`
preserves the upstream `@form8ion/javascript` plugin surface while injecting
the enhanced scaffolder from `src/common/enhanced-scaffolders.js`.

---

## Source Conventions

Follow the conventions already established by the upstream form8ion
packages.

* Use ESM only.
* Prefer named functions for default exports.
* Keep source files focused and compositional — one command, one
  responsibility per file (`sub-command.js` registers, `action.js`
  executes).
* Reuse upstream helpers and constants instead of duplicating strings.
* Keep imports in two groups for source files and three groups for test
  files, matching nearby files.

Because this package is composition-heavy, clarity of boundaries matters more
than clever abstractions.
Prefer direct object composition over indirection when wiring plugins.

---

## Testing and Verification

Behavior changes require tests.

1. define the integration scenario first when behavior changes externally
1. drive internal implementation with colocated unit tests
1. keep adapters thin and verify the exact upstream contract they are shaping

### Test Layout

* unit tests live beside implementation as `*.test.js` (Vitest)
* integration tests live under `test/integration/features/` (Cucumber,
  `.feature` files + step definitions)
* an end-to-end smoke test lives at `test/e2e/smoke-test.js` and runs against
  the built `bin/` output
* integration scenarios exercise the CLI flow directly against source files
  (no build step required)

### Useful Commands

Run `nvm use` before npm commands.

```bash
nvm use
npm run test:unit:base
npm run test:integration
npm test
```

`npm test` is the full verification entry point for this repository — it
runs all `lint:*` and `test:*` scripts in parallel via `npm-run-all2`.

---

## Change Guidance

### Prefer Upstream Changes When

* the project scaffold or lift flow itself is wrong
* a prompt ID, question map, or prompt contract needs to change
* JavaScript plugin behavior is broadly incorrect
* a plugin contract should change for all consumers

### Change This Repository When

* the CLI should expose a different combination of existing plugins
* travi-specific defaults should be preselected (configs, package manager,
  admin settings, etc.)
* result reporting or command wiring should change
* upstream plugins need CLI-local dependency injection or lightweight
  wrapping
* a new command needs to be added following the existing
  `index.js` / `sub-command.js` / `action.js` shape

### Avoid

* reimplementing upstream orchestration locally
* copying prompt constants or question keys into string literals
* introducing new architecture when existing composition patterns suffice
* moving domain logic into the CLI solely for convenience

---

## High-Value References

* `src/index.js`
* `src/program.js`
* `src/scaffolder/action.js`
* `src/lift/action.js`
* `src/common/plugins.js`
* `src/common/enhanced-plugins.js`
* `src/common/javascript-options.js`
* `src/common/prompts.js`
* `test/integration/features/javascript.feature`
* [form8ion/project `AGENTS.md`][project-agents] — `beta` branch (large
  refactor in progress there, not yet on `master`)
* [form8ion/project `copilot-instructions.md`][project-copilot] — `beta`
  branch
* [form8ion/javascript `copilot-instructions.md`][javascript-copilot] —
  `beta` branch

[project-agents]: https://github.com/form8ion/project/blob/beta/AGENTS.md

[project-copilot]: https://github.com/form8ion/project/blob/beta/.github/copilot-instructions.md

[javascript-copilot]: https://github.com/form8ion/javascript/blob/beta/.github/copilot-instructions.md
