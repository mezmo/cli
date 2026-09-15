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

## Enterprise Access Keys

Keys prefixed with `ste_` belong to an enterprise, not a single account. Every non-enterprise command runs as the
active account. Without one, API commands fail with `EAUTH`.

```bash
# list child accounts; the active account is marked with * in the ACTIVE column
mzm get account

# select the active account by id or company name.
# Prefer ids: an ambiguous name, or no argument, prompts and fails when there is no terminal
mzm set account <account-id-or-name>

# or target an account for a single command without changing the saved selection
mzm get view --account <account-id>
MZM_ACCOUNT_ID=<account-id> mzm log search "level:error"
```

Prefer `--account` or `MZM_ACCOUNT_ID` when working across several accounts so the user's saved selection is not changed.
These are enterprise-only: with any other key, `mzm set account`, `--account`, and `MZM_ACCOUNT_ID` fail with `EINVAL`.
The active account is the key's own account, marked with `*` in `mzm get account`.
Confirm with the user before running `mzm set account`, since it changes the account later commands run as.

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
