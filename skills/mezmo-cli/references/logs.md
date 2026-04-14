# Logs

Use Mezmo log commands for both historical investigations and live streams.

## Historical Search

`mzm log search` is the main tool for historical log analysis. If `--from` and `--to` are omitted, the CLI searches the last two hours.

```bash
# basic search
mzm log search "error"

# explicit time range
mzm log search "database connection" --from "1h ago" --to "now"

# filters
mzm log search "error" --app api --level error --host prod-1

# machine-readable output
mzm log search "critical" -o json
```

Supported investigation patterns from the current CLI:

```bash
# search using a saved view
mzm log search --from "yesterday at 3pm" --to "now" --with-view "production-errors"

# search using a resolved view id
mzm log search --from "yesterday at 3pm" --to "now" --with-view "$(mzm get view \"only errors\" -q)"

# fetch all pages
mzm log search --from "one hour ago" --all pod:widget-server
```

## Pagination

Use pagination when the result set is larger than one page.

```bash
# start a search
mzm log search --from "1h ago" "level:error"

# continue the last search
mzm log search --next

# page through the remainder
mzm log search --next --all
```

When the task is iterative, run the initial search first, inspect the result shape, then continue paging only if needed.

## Live Tailing

Use `mzm log tail` for live incident response or ongoing observation.

```bash
# all live logs
mzm log tail

# app and level filters
mzm log tail --app production --level warn --level error

# host filters
mzm log tail --host server1 --host server2

# query-based tail
mzm log tail "status:500"
```

Saved views also work with tail:

```bash
mzm log tail --with-view "production-errors"
```

## Safe Investigation Pattern

1. Start with `mzm get view` if the user mentions an existing saved view.
2. Use `mzm log search` first for bounded historical analysis.
3. Switch to `mzm log tail` only when the task needs live data.
4. Prefer JSON output if the logs are feeding another tool; otherwise keep the default pretty output.
