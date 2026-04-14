# Setup

## Preconditions

- `mzm` must already be installed and available on `PATH`.
- `MZM_ACCESS_KEY` must be set for Mezmo API operations.
- `EDITOR` should be set when using interactive `mzm create ...` or `mzm edit ...` flows.

Check the environment before starting:

```bash
mzm version
printenv MZM_ACCESS_KEY
printenv EDITOR
```

If `mzm` or `MZM_ACCESS_KEY` is missing, surface the missing prerequisite and stop. This skill does not assume a hidden fallback.

## Installation Expectations

- This skill is installable from the repository with `npx skills add <repo> --skill mezmo-cli`.
- Installing the skill does not install the Mezmo CLI binary for the user.
- If the user needs CLI installation help, point them to the repository's existing Mezmo CLI installation guidance.

## Output Selection

Use human-friendly table output for exploration and JSON/YAML output for chaining.

Common patterns:

```bash
# inspect resources in a readable table
mzm get account
mzm get category
mzm get view

# hand results to jq or another command
mzm get view -o json
mzm get category -o json

# emit identifiers only
mzm get account -q
mzm get view -q
```

For log commands:

```bash
# pretty output for direct reading
mzm log search "level:error"
mzm log tail --app production

# JSON when another command will consume the stream
mzm log search "level:error" -o json
mzm log tail --app production -o json
```

## Assistant Workflows

Use `mzm ask` when the user wants Mezmo assistant help inside the CLI.

```bash
mzm ask "How do I filter logs by timestamp?"
mzm ask --continue
mzm ask --continue <conversation-id>
```

Prefer direct `mzm` resource and log commands when the task is operational and deterministic. Use `mzm ask` when the user wants product guidance, analysis, or an existing Mezmo conversation continued.
