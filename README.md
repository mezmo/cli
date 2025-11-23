# Mezmo CLI
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A powerful command-line interface for interacting with the Mezmo observability platform.
Manage logs, views, configurations, and leverage AI-powered assistance directly from your terminal.

## Features

- **Log Management**: Search, tail, and analyze logs in real-time
- **View Management**: Create, edit, delete, and manage log views
- **AI-Powered Assistant**: Ask questions and get intelligent assistance
- **Resource Management**: Manage various Mezmo platform resources via YAML/JSON definitions
- **Account Management**: View and manage account information
- **Configuration Management**: Customize CLI behavior and settings
- **Shell Completions**: Auto-completion support for enhanced productivity

## Available Commands

| Command | Description |
|---------|-------------|
| `mzm ask` | Interact with the Mezmo AI assistant |
| `mzm completions` | Generate shell completion scripts |
| `mzm config` | Manage CLI configuration |
| `mzm create` | Create resources from definitions |
| `mzm delete` | Delete resources |
| `mzm edit` | Edit existing resources |
| `mzm get` | Retrieve and display resources |
| `mzm log` | Interact with log data |

### Subcommands

#### Log Commands
- `mzm log search` - Search through historical logs
- `mzm log tail` - Stream logs in real-time

#### Get Commands
- `mzm get account` - Display account information
- `mzm get conversation` - List AI conversations
- `mzm get view` - List or get specific views

#### Config Commands
- `mzm config get <key>` - Display configuration values
- `mzm config set <key>` - Set configuration values

## Prerequisites

- **Mezmo Account**: Active account with API access

### Environment Variables

The Mezmo CLI uses the following environment variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `MZM_ACCESS_KEY` | **Yes** | Authentication key for accessing the Mezmo platform API. This is required for all API operations. | None |
| `EDITOR` | No | Specifies the text editor to use when editing resources with `mzm edit` command | `vi` (Unix/Linux/macOS) or `notepad.exe` (Windows) |

**Note**: The CLI also respects standard system environment variables like `HOME` for determining configuration file locations.

### System Access Requirements

The Mezmo CLI requires the following system permissions and access:

#### File System Access

| Operation | Location | Purpose |
|-----------|----------|---------|
| **Read/Write** | `~/.config/mezmo/mzm.cfg` | Store CLI configuration and local data |
| **Read/Write/Delete** | System temp directory | Temporary files for editing operations |
| **Read** | User-specified paths | Reading resource definition files |
| **Create Directory** | `~/.config/mezmo/` | Initial configuration setup |

#### Network Access

The CLI requires HTTPS access to the following Mezmo API endpoints:

- **API Host**: `https://api.mezmo.com` (configurable)
  - View management operations (GET, POST, PUT, DELETE)
  - Account information retrieval
  - AI assistant interactions
- **Stream Host**: `https://tail.mezmo.com` (configurable)
  - Real-time log streaming via WebSocket
  - Log search and retrieval

#### Process Permissions

- **Subprocess Spawning**: Required for launching external text editors (`$EDITOR`)
- **Standard I/O**: Access to stdin, stdout, and stderr for command interaction

#### Security Considerations

- All API communications require authentication via `MZM_ACCESS_KEY`
- The CLI uses Token Bearer authentication for API requests
- Network timeouts: 3 seconds for standard API calls, 10 minutes for AI operations
- No elevated system privileges (sudo/admin) required for normal operation

## Installation

### Option 1: Download Pre-compiled Binary (Recommended)

Download the appropriate binary for your platform from the [releases page](https://github.com/mezmo/cli/releases):

```bash
# macOS (Apple Silicon)
curl -LO https://github.com/mezmo/cli/releases/latest/download/mzm-darwin-aarch64
chmod +x mzm-darwin-aarch64
sudo mv mzm-darwin-aarch64 /usr/local/bin/mzm

# macOS (Intel)
curl -LO https://github.com/mezmo/cli/releases/latest/download/mzm-darwin-x86_64
chmod +x mzm-darwin-x86_64
sudo mv mzm-darwin-x86_64 /usr/local/bin/mzm

# Linux (x86_64)
curl -LO https://github.com/mezmo/cli/releases/latest/download/mzm-linux-x86_64
chmod +x mzm-linux-x86_64
sudo mv mzm-linux-x86_64 /usr/local/bin/mzm

# Linux (ARM64)
curl -LO https://github.com/mezmo/cli/releases/latest/download/mzm-linux-aarch64
chmod +x mzm-linux-aarch64
sudo mv mzm-linux-aarch64 /usr/local/bin/mzm

# Windows
# Download mzm-windows-x86_64.exe and add to PATH
```

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/mezmo/cli.git
cd cli

# Install Deno if not already installed
curl -fsSL https://deno.land/install.sh | sh

# Compile the CLI for your platform
deno task compile:local

# Move binary to PATH
sudo mv mzm /usr/local/bin/
```

### Option 3: Run with Deno (Development)

```bash
# Clone the repository
git clone https://github.com/mezmo/cli.git
cd cli

# Run directly with Deno
deno task local <command> [options]
```

## Configuration

### Initial Setup

**Set up Authentication**:

The Mezmo CLI requires a Mezmo platform access key to authenticate API requests. You must set the `MZM_ACCESS_KEY` environment variable with your access key.

```bash
# Set the access key for your current session
export MZM_ACCESS_KEY="your-access-key-here"

```
**Getting an Access Key:**
- It is recommended to use a Personal Access Key for better security and control
- Visit the [Mezmo documentation on IAM Service Keys](https://docs.mezmo.com/docs/ingestion-key#iam-service-keys) for detailed instructions on creating and managing access keys
- Personal Access Keys can be created and managed through your Mezmo User Preferences

### Shell Completions

Enable auto-completion for your shell:

```bash
# Bash
source <(mzm completions bash)

# Zsh
source <(mzm completions zsh)

# Fish
source (mzm completions fish | psub)
```

## Usage

### Getting Help

All commands and sub commands support the `-h` / `--help` flag for outputing
detailed instruction and examples for that specific command

```bash
# display help text for the main command
mzm

# display help for the log command
mzm log --help

# display help text for the log search command
mzm log search --help
```

### Working with Logs

**Search Logs**

```bash
# Basic search
mzm log search "error"

# Search with time range
mzm log search "database connection" --from "1h ago" --to "now"

# Search with filters
mzm log search "error" --app myapp --level error

# Export results
mzm log search "critical" --format json > results.json
```

**Stream Logs in Real-time**

```bash
# Tail all logs
mzm log tail

# Tail with filters
mzm log tail --app production --level warn --leve error

# Tail specific hosts
mzm log tail --host server1 --host server2

# Tail with custom query
mzm log tail "status:500"
```

### Managing Views

Views are sets of predefined search queries and filters that help you better interact
with your data. They are an essential part of leveraging the mezmo platform. As such, we have
tried to make it exceptionally easy to manage and use them.

**List Views**
```bash
# List all views
mzm get view

# Get specific view details
mzm get view <view-id>

# Output as JSON
mzm get view --output json
```

**Create Views**
```bash
# Create from YAML file
cat > view.yaml << EOF
type: v1/view
spec:
    name: production-errors
    query: level:error AND app:production
    categories:
      - production
      - errors
EOF

mzm create -f view.yaml
```

**Edit Views**
```bash
# Edit view interactively
mzm edit view <view-id>

mzm edit view "name of a view"
```

**Delete Views**
```bash
# Delete a view
mzm delete view <view-id>
```

### AI Assistant

Interact with the Mezmo AI assistant for help with queries, troubleshooting, and platform guidance:

```bash
# Ask a question
mzm ask "How do I filter logs by timestamp?"

# Continue a previous conversation
mzm ask --continue

# Continue specific conversation
mzm ask --continue <conversation-id>

# Interactive mode
mzm ask
# Then type your questions interactively
```

### Resource Management

Manage resources using declarative YAML or JSON definitions:

```bash
# Create resources from file
mzm create -f resource.yaml

# Delete resources from spec file (experimental)
mzm delete -f resource.yaml

# Delete a view by id
mzm delete view a41febfd

# Delete a view name
mzm delete view "my view name"

```

Example resource definition:
```yaml
---
type: v1/view
spec:
    name: application-logs
    query: app:myapp
    categories:
      - application
---
```

## Examples

### Complex Log Queries
```bash
# Search for errors in production from the last hour
mzm log search "level:error AND env:production" --from "1h ago"

# Tail logs with multiple filters
mzm log tail --app api --level error --level warn --host prod-* "level:error AND env:production"

```

### Batch Operations
```bash
# Create multiple views from a directory
for file in views/*.yaml; do
  mzm create -f "$file"
done

# Export all views
mzm get view --output json > all-views.json
```

### Automation Scripts
```bash
#!/bin/bash
# Monitor for critical errors

mzm log tail --level critical --format json | while read -r line; do
  # Process each critical log
  echo "Critical error detected: $line"
  # Send alert, create ticket, etc.
done
```

## Development

### Prerequisites
- Deno 2.0+
- Node.js 18+ (for release management)

### Setup Development Environment
```bash
# Clone repository
git clone https://github.com/mezmo/cli.git
cd cli

# Install dependencies (Deno downloads automatically)
deno cache main.ts

# Run tests
deno task test

# Generate coverage reports
deno task reports

# Run locally with environment variables
deno task local <command>
```

### Building

```bash
# Build all platforms
deno task compile

# Build specific platform
deno task compile:linux:x86
deno task compile:osx:arm
deno task compile:windows

# Build for local testing
deno task compile:local
```

```bash
# Run all tests
deno task test

# Run with coverage
deno task reports

# Run specific test file
deno test @mzm/core/error.test.ts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/mezmo/cli/issues)
- **Email**: support@mezmo.com


---

© 2025 Mezmo. All rights reserved.


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://codedependant.net"><img src="https://avatars.githubusercontent.com/u/148561?v=4?s=100" width="100px;" alt="Eric Satterwhite"/><br /><sub><b>Eric Satterwhite</b></sub></a><br /><a href="https://github.com/mezmo/cli/commits?author=esatterwhite" title="Code">💻</a> <a href="https://github.com/mezmo/cli/commits?author=esatterwhite" title="Tests">⚠️</a> <a href="https://github.com/mezmo/cli/commits?author=esatterwhite" title="Documentation">📖</a> <a href="https://github.com/mezmo/cli/issues?q=author%3Aesatterwhite" title="Bug reports">🐛</a> <a href="#video-esatterwhite" title="Videos">📹</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://mdel.io"><img src="https://avatars.githubusercontent.com/u/69520?v=4?s=100" width="100px;" alt="Mike Del Tito"/><br /><sub><b>Mike Del Tito</b></sub></a><br /><a href="https://github.com/mezmo/cli/pulls?q=is%3Apr+reviewed-by%3Amdeltito" title="Reviewed Pull Requests">👀</a> <a href="#ideas-mdeltito" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!