---
name: mezmo-cli
description: Investigates Mezmo logs, streams live Mezmo data, inspects accounts, views, and categories, manages view/category resources, and uses the Mezmo assistant via the mzm CLI. Use when the user wants Mezmo platform work done from the terminal.
---

# Mezmo CLI

Use `mzm` for Mezmo platform workflows from the terminal.

## Prerequisites

- Confirm `mzm` is installed before attempting Mezmo work: `mzm version`
- Confirm `MZM_ACCESS_KEY` is set before any API call: `printenv MZM_ACCESS_KEY`
- If either prerequisite is missing, tell the user what is missing and stop. Do not invent an unsupported fallback transport.

## Quick Start

```bash
# inspect current Mezmo resources
mzm get account
mzm get category
mzm get view

# investigate historical logs
mzm log search "level:error" --from "1h ago" --to "now"

# stream live logs
mzm log tail --app production --level error

# reuse a saved view
mzm log search --with-view "production-errors" --from "1h ago"

# ask the Mezmo assistant
mzm ask "How do I filter logs by timestamp?"
```

## Working Style

1. Start read-only. Prefer `mzm get ...`, `mzm log search`, and `mzm log tail` before any mutation.
2. Inspect the current state before editing or deleting views/categories. Resolve names to IDs first when the change is high-risk.
3. Prefer structured output when another command or script will consume the result:
   - `mzm get view -o json`
   - `mzm get view -q`
   - `mzm get account -q`
4. Use saved views for repeat investigations instead of retyping the same filters.
5. Use `mzm ask` when the user wants Mezmo product guidance or wants to continue an existing Mezmo assistant thread with `mzm ask --continue`.

## Reference Files

- Read [references/setup.md](references/setup.md) for setup checks, installation expectations, and output-format choices.
- Read [references/logs.md](references/logs.md) for log search, tailing, saved views, and pagination.
- Read [references/resources.md](references/resources.md) for view/category lookup and safe CRUD workflows.
