# mzm create

Create resources in the Mezmo platform from files or interactive templates.

![mzm create demo](../../assets/mzm-create.gif)

## Table of Contents

- [Overview](#overview)
- [Main Command: `mzm create -f`](#main-command-mzm-create--f)
- [Subcommand: `mzm create category`](#subcommand-mzm-create-category)
- [Subcommand: `mzm create view`](#subcommand-mzm-create-view)
- [Resource Specifications](#resource-specifications)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Overview

The `mzm create` command provides three ways to create resources in the Mezmo platform:

1. **File-based creation** (`mzm create -f <file>`) - Create one resource from a YAML or JSON file
2. **Interactive category creation** (`mzm create category`) - Create a category using a text editor
3. **Interactive view creation** (`mzm create view`) - Create a view using a text editor

All resource creation operations require authentication via the `MZM_ACCESS_KEY` environment variable.

---

## Main Command: `mzm create -f`

Create a single resource from a file or stdin. Both JSON and YAML formats are accepted.

### Syntax

```bash
mzm create -f <file>
mzm create --file <file>
```

### Options

| Option | Alias | Required | Description |
|--------|-------|----------|-------------|
| `--file` | `-f` | Yes | Path to a resource definition file (YAML or JSON) |

### Supported Formats

- **YAML** - Human-readable format (recommended)
- **JSON** - Machine-readable format
- **JSONC** - JSON with comments

The parser attempts YAML first, then falls back to JSON if YAML parsing fails.

### How It Works

1. Reads the file content from the specified path (absolute or relative)
2. Parses the content as a resource template
3. Validates the resource version and type
4. Applies the template using the appropriate API version module
5. Creates the resource and returns its primary key identifier

### Basic Examples

**Create a view from a YAML file:**
```bash
mzm create -f view.yaml
```

**Create a category from a JSON file:**
```bash
mzm create -f category.json
```

**Create from stdin:**
```bash
cat view.yaml | mzm create -f -
```

---

## Subcommand: `mzm create category`

Create a single category resource from a template using an interactive text editor.

### Syntax

```bash
mzm create category [options]
```

### Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--output` | `-o` | `yaml` | Output format for editing (`yaml` or `json`) |

### Editor Configuration

The command opens a text editor based on the following priority:

1. `$EDITOR` environment variable
2. Default: `vi` (Unix/Linux/macOS) or `notepad.exe` (Windows)

**Set your preferred editor:**
```bash
export EDITOR=vim
export EDITOR=nano
export EDITOR=code  # VS Code
export EDITOR=subl  # Sublime Text
```

### Template Structure

When you run `mzm create category`, the editor opens with this template:

**YAML format (default):**
```yaml
---
version: v1
resource: category
metadata: {}
spec:
  # START required fields
  name: string  # The name of the category - Production
  # Categories cannot be shared between types
  type: string  # the type of category - one of: boards | views | screens
  # END required fields
```

**JSON format (`-o json`):**
```json
{
  "version": "v1",
  "resource": "category",
  "metadata": {},
  "spec": {
    "name": "string",
    "type": "string"
  }
}
```

### Required Fields

| Field | Type | Description | Valid Values |
|-------|------|-------------|--------------|
| `name` | string | The name of the category | Any non-empty string |
| `type` | string | The type of category | `views`, `boards`, or `screens` |

> **Important:** Categories cannot be shared between types. A category of type `views` cannot be used with boards or screens.

### Interactive Workflow

1. Run `mzm create category`
2. Your editor opens with the template
3. Replace placeholder values with actual data
4. Save and close the editor
5. The CLI validates and creates the category
6. The category's primary key is displayed

### Examples

**Create a category with default YAML editor:**
```bash
mzm create category
```

**Create a category with JSON editor:**
```bash
mzm create category -o json
```

**Example: Creating a "Production" category**

```bash
$ mzm create category
# Editor opens with template, edit to:
```

```yaml
---
version: v1
resource: category
metadata: {}
spec:
  name: Production
  type: views
```

```bash
# Save and close editor
# Output: a3d194f2
```

**Example: Creating a "Debug" category**

```yaml
---
version: v1
resource: category
metadata: {}
spec:
  name: Debug
  type: views
```

**Example: Creating a "Dashboards" category**

```yaml
---
version: v1
resource: category
metadata: {}
spec:
  name: Dashboards
  type: boards
```

### Verifying Category Creation

```bash
# List all categories
mzm get category

# Get specific category
mzm get category Production
```

---

## Subcommand: `mzm create view`

Create a single view resource from a template using an interactive text editor.

### Syntax

```bash
mzm create view [options]
```

### Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--output` | `-o` | `yaml` | Output format for editing (`yaml` or `json`) |

### Editor Configuration

Same as `mzm create category` - uses `$EDITOR` environment variable or system default.

### Template Structure

When you run `mzm create view`, the editor opens with this template:

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  # START required fields
  name: string  # name of the view - My New View
  # END required fields

  # One of query, hosts, apps, level or tags is required
  query: string  # search query to apply to log lines - (foobar AND widgets) OR namespace:secret

  hosts:
    - string  # additional hosts to filter the results by, in addition to `query`
  apps:
    - string  # additional applications to filter the results by, in addition to `query`
  levels:
    - string  # additional log levels to filter the results by, in addition to `query`
  tags:
    - string  # additional tags to filter the results by, in addition to `query`

  presetid: string  # identifiers of an existing preset alert

  # Use mzm create, get and edit to manage categories
  category:
    - string  # Name of categories to group the view in. These must already exist

  channels: []  # alert configurations
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the view |

### Conditional Requirements

**At least ONE of the following must be provided:**

- `query` - Search query string
- `hosts` - Array of host filters
- `apps` - Array of application filters
- `levels` - Array of log level filters
- `tags` - Array of tag filters

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | Search query using Mezmo query syntax |
| `hosts` | array | Host names to filter by |
| `apps` | array | Application names to filter by |
| `levels` | array | Log levels to filter by (`debug`, `info`, `warning`, `error`, `critical`) |
| `tags` | array | Tags to filter by |
| `category` | array | Category names (must already exist) |
| `presetid` | string | Preset alert identifier |
| `channels` | array | Alert channel configurations |

### Query Syntax

Views support powerful query syntax for filtering logs:

**Boolean Operators:**
- `AND` - Both conditions must match
- `OR` - Either condition must match
- `-` (minus) - NOT operator, excludes matches

**Field-based queries:**
- `field:value` - Match specific field
- `app:myapp` - Filter by application
- `level:error` - Filter by log level
- `host:server1` - Filter by host

**Examples:**
```
level:error AND app:production
(foobar AND widgets) OR namespace:secret
message AND -widgets
status:500 OR status:502
```

### Interactive Workflow

1. Run `mzm create view`
2. Your editor opens with the template
3. Fill in the required fields and desired filters
4. Save and close the editor
5. The CLI validates and creates the view
6. The view's primary key is displayed

### Examples

**Create a view with default YAML editor:**
```bash
mzm create view
```

**Create a view with JSON editor:**
```bash
mzm create view -o json
```

**Example 1: Production Errors View**

```bash
$ mzm create view
# Editor opens, edit to:
```

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  name: production-errors
  query: level:error AND app:production
  category:
    - Production
    - Errors
```

**Example 2: Application Debug View**

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  name: app-debug-logs
  apps:
    - python-test
    - node-service
  levels:
    - debug
    - info
  category:
    - Debug
```

**Example 3: Multi-Filter View**

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  name: critical-services
  query: "status:500 OR status:502"
  apps:
    - api-gateway
    - auth-service
  levels:
    - error
    - critical
  hosts:
    - prod-server-1
    - prod-server-2
  category:
    - Production
    - Monitoring
  tags:
    - critical
```

**Example 4: Simple Query View**

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  name: widget-logs
  query: "message AND -widgets"
  category:
    - Application
```

### Verifying View Creation

```bash
# List all views
mzm get view

# Get specific view
mzm get view production-errors

# Test the view with log search
mzm log search --with-view "production-errors"

# Tail logs using the view
mzm log tail --with-view "production-errors"
```

---

## Resource Specifications

### View Resource Specification

#### Complete Structure

```yaml
version: v1
resource: view
metadata:
  pk: string           # View ID (auto-generated, used for updates)
  account: string      # Account ID (auto-populated)
spec:
  name: string         # Required: View name
  query: string        # Conditional: Search query
  hosts: [string]      # Optional: Host filters
  apps: [string]       # Optional: Application filters
  levels: [string]     # Optional: Log level filters
  tags: [string]       # Optional: Tag filters
  category: [string]   # Optional: Category names
  presetid: string     # Optional: Preset alert ID
  channels: []         # Optional: Alert configurations
```

#### Field Details

**name** (required)
- Type: `string`
- Description: Display name for the view
- Example: `"production-errors"`, `"My First View"`

**query** (conditional)
- Type: `string`
- Description: Search query using Mezmo query syntax
- Example: `"level:error AND app:production"`
- Note: At least one of query, hosts, apps, levels, or tags is required

**hosts** (optional)
- Type: `array of strings`
- Description: Additional host names to filter by
- Example: `["server1", "server2", "prod-*"]`

**apps** (optional)
- Type: `array of strings`
- Description: Additional application names to filter by
- Example: `["python-test", "node-service"]`

**levels** (optional)
- Type: `array of strings`
- Description: Log levels to filter by
- Valid values: `debug`, `info`, `warning`, `error`, `critical`
- Example: `["error", "critical"]`

**tags** (optional)
- Type: `array of strings`
- Description: Additional tags to filter by
- Example: `["production", "monitoring"]`

**category** (optional)
- Type: `array of strings`
- Description: Names of categories to group the view in
- **Important:** Categories must already exist
- Example: `["Production", "Errors"]`

**presetid** (optional)
- Type: `string`
- Description: Identifier of an existing preset alert
- Example: `"preset-123abc"`

**channels** (optional)
- Type: `array`
- Description: Alert channel configurations
- Example: `[]`

### Category Resource Specification

#### Complete Structure

```yaml
version: v1
resource: category
metadata:
  pk: string           # Category ID (auto-generated, used for updates)
  type: string         # Category type (mirrors spec.type)
spec:
  name: string         # Required: Category name
  type: string         # Required: Category type
```

#### Field Details

**name** (required)
- Type: `string`
- Description: Display name for the category
- Example: `"Production"`, `"Debug"`, `"Dashboards"`

**type** (required)
- Type: `string`
- Description: Type of category
- Valid values: `views`, `boards`, `screens`
- **Important:** Categories cannot be shared between types

#### Valid Category Types

| Type | Description | Usage |
|------|-------------|-------|
| `views` | For log views | Assign to views created with `mzm create view` |
| `boards` | For dashboards | Assign to dashboard resources |
| `screens` | For screens | Assign to screen resources |

### Resource Template Common Structure

All resource templates follow this structure:

```yaml
version: v1                    # API version (required)
resource: view | category      # Resource type (required)
metadata:                      # Metadata object (required)
  pk: string                   # Primary key (optional, for updates)
  # Additional metadata fields vary by resource type
spec:                          # Resource specification (required)
  # Resource-specific fields
```

---

## Examples

### Complete Workflow: Category → View → Test

```bash
# Step 1: Create a category
$ mzm create category
# Edit template:
```

```yaml
---
version: v1
resource: category
metadata: {}
spec:
  name: Production
  type: views
```

```bash
# Output: a3d194f2

# Step 2: Verify category
$ mzm get category
NAME        TYPE   ID
Production  views  a3d194f2

# Step 3: Create a view using the category
$ mzm create view
# Edit template:
```

```yaml
---
version: v1
resource: view
metadata: {}
spec:
  name: prod-errors
  query: level:error AND env:production
  levels:
    - error
    - critical
  category:
    - Production
```

```bash
# Output: 7fb51dc261

# Step 4: Verify view
$ mzm get view prod-errors
CATEGORY    NAME         ID
Production  prod-errors  7fb51dc261

# Step 5: Test the view
$ mzm log search --from "1h ago" --with-view "prod-errors"
```

### Batch Creation from Files

**Directory structure:**
```
resources/
├── categories/
│   ├── production.yaml
│   ├── development.yaml
│   └── monitoring.yaml
└── views/
    ├── prod-errors.yaml
    └── dev-logs.yaml
```


**Create all resources:**
```bash
# Create categories first (one file at a time)
mzm create -f resources/categories/production.yaml
mzm create -f resources/categories/development.yaml
mzm create -f resources/categories/monitoring.yaml

# Then create views
mzm create -f resources/views/prod-errors.yaml
mzm create -f resources/views/dev-logs.yaml

# Or use a loop to create all categories, then all views
for file in resources/categories/*.yaml; do
  mzm create -f "$file"
done

for file in resources/views/*.yaml; do
  mzm create -f "$file"
done
```

### Advanced Query Examples

**Example 1: Complex boolean query**
```yaml
spec:
  name: api-issues
  query: "(status:500 OR status:502) AND app:api-gateway AND -health-check"
  category:
    - Production
```

**Example 2: Namespace filtering**
```yaml
spec:
  name: kubernetes-errors
  query: "namespace:production AND level:error"
  apps:
    - kube-proxy
    - kube-controller
  category:
    - Kubernetes
```

**Example 3: Multi-app monitoring**
```yaml
spec:
  name: microservices-errors
  query: "level:error OR level:critical"
  apps:
    - auth-service
    - payment-service
    - notification-service
  category:
    - Production
    - Microservices
```

### JSON Format Examples

**Category in JSON:**
```json
{
  "version": "v1",
  "resource": "category",
  "metadata": {},
  "spec": {
    "name": "Production",
    "type": "views"
  }
}
```

**View in JSON:**
```json
{
  "version": "v1",
  "resource": "view",
  "metadata": {},
  "spec": {
    "name": "production-errors",
    "query": "level:error AND app:production",
    "levels": ["error", "critical"],
    "category": ["Production", "Errors"]
  }
}
```

**Create from JSON file:**
```bash
mzm create -f view.json
```

---

### Validation Tips

**Before creating a view:**
1. Verify categories exist:
   ```bash
   mzm get category
   ```

2. Test your query syntax:
   ```bash
   mzm log search "your-query-here"
   ```

3. Validate your YAML/JSON:
   ```bash
   # YAML validation
   python -c "import yaml; yaml.safe_load(open('view.yaml'))"

   # JSON validation
   jq . view.json
   ```

---

## Best Practices

### 1. Category Management

**Create categories first:**
```bash
# Always create categories before views that reference them
mzm create category  # Create "Production"
mzm create view      # Then reference "Production"
```

**Use descriptive category names:**
```yaml
# Good
name: Production-Critical
name: Development-Debug
name: Security-Alerts

# Avoid
name: Cat1
name: Misc
name: Stuff
```

**Choose the correct type:**
```yaml
# For log views
type: views

# For dashboards
type: boards

# For screens
type: screens
```

### 2. View Design

**Use meaningful view names:**
```yaml
# Good
name: production-errors
name: api-gateway-500-errors
name: kubernetes-pod-failures

# Avoid
name: view1
name: test
name: my-view
```

**Combine filters effectively:**
```yaml
# Good: Specific and focused
spec:
  name: critical-api-errors
  query: "level:error AND status:500"
  apps:
    - api-gateway
  levels:
    - error
    - critical

# Avoid: Too broad
spec:
  name: all-logs
  query: "*"
```

**Use query syntax efficiently:**
```yaml
# Good: Clear boolean logic
query: "(status:500 OR status:502) AND app:api"

# Good: Exclusions
query: "level:error AND -health-check"

# Good: Field-specific
query: "namespace:production AND pod:api-*"
```

### 3. File-Based Workflows

**Version control your resources:**
```bash
# Store in git
git add resources/*.yaml
git commit -m "Add production monitoring views"
```

**Organize by resource type:**
```
resources/
├── categories/
│   ├── production.yaml
│   ├── development.yaml
│   └── monitoring.yaml
└── views/
    ├── prod-errors.yaml
    ├── dev-logs.yaml
    └── api-monitoring.yaml
```

**Organize by environment:**
```
resources/
├── production/
│   ├── categories/
│   │   ├── critical.yaml
│   │   └── monitoring.yaml
│   └── views/
│       ├── errors.yaml
│       └── performance.yaml
├── staging/
│   ├── categories/
│   │   └── testing.yaml
│   └── views/
│       └── debug.yaml
└── development/
    ├── categories/
    │   └── dev.yaml
    └── views/
        └── all-logs.yaml
```

### 4. Testing and Validation

**Test views after creation:**
```bash
# Create view
mzm create -f view.yaml

# Test immediately
mzm log search --with-view "view-name" --from "1h ago"
```

**Verify before batch operations:**
```bash
# List existing resources
mzm get category
mzm get view

# Then create new ones
mzm create -f new-resources.yaml
```

### 5. Editor Configuration

**Set a comfortable editor:**
```bash
# In your shell profile (.bashrc, .zshrc, etc.)
export EDITOR=vim
export EDITOR=nano
export EDITOR="code --wait"  # VS Code
export EDITOR="subl --wait"  # Sublime Text
```

**Use editor features:**
- Syntax highlighting for YAML/JSON
- Auto-indentation
- Validation plugins
- Snippets for common patterns

### 6. Query Optimization

**Start simple, then refine:**
```yaml
# Step 1: Basic query
query: "level:error"

# Step 2: Add application filter
query: "level:error AND app:api"

# Step 3: Add exclusions
query: "level:error AND app:api AND -health-check"

# Step 4: Add status codes
query: "level:error AND app:api AND -health-check AND (status:500 OR status:502)"
```

**Test queries before saving:**
```bash
# Test query directly
mzm log search "level:error AND app:api" --from "1 hour ago"

# If results look good, add to view
mzm create view
```

### 7. Maintenance

**Regular review:**
```bash
# List all views
mzm get view -o json > views-backup.json

# Review and clean up unused views
mzm delete view <unused-view-id>
```

**Update views as needed:**
```bash
# Edit existing view
mzm edit view production-errors

# Or update from file
mzm create -f view.yaml  # If metadata.pk is present, it updates
```

### 8. Documentation

**Document your resources:**
```yaml
# Add comments in YAML files
---
version: v1
resource: view
metadata: {}
spec:
  # Production error monitoring view
  # Captures all 500/502 errors from API gateway
  # Excludes health check endpoints
  # Alerts sent to #ops-alerts Slack channel
  name: production-api-errors
  query: "(status:500 OR status:502) AND app:api-gateway AND -/health"
  category:
    - Production
    - Monitoring
```

**Maintain a resource catalog:**
```markdown
# Resource Catalog

## Categories
- **Production**: Production environment resources
- **Development**: Development environment resources
- **Monitoring**: System monitoring and alerts

## Views
- **production-errors**: All production error logs
- **api-gateway-500**: API 500 errors only
- **kubernetes-failures**: Pod and container failures
```

### 9. Security

**Protect sensitive data:**
```yaml
# Don't include sensitive data in queries
# Bad
query: "password:secret123"

# Good
query: "auth-failure AND user:*"
```

**Use appropriate access controls:**
- Use Personal Access Keys instead of shared keys
- Rotate access keys regularly
- Limit access key permissions

### 10. Performance

**Optimize view filters:**
```yaml
# Good: Specific filters reduce data processed
spec:
  name: specific-errors
  query: "level:error AND app:api"
  apps:
    - api-gateway
  levels: [error]
  hosts:
    - prod-server-1
    - prod-server-2

# Avoid: Too broad
spec:
  name: all-logs
  query: "*"
```

**Use time ranges when testing:**
```bash
# Good: Limited time range
mzm log search --with-view "my-view" --from "1h ago"

# Avoid: No time limit (may be slow)
mzm log search --with-view "my-view"
```

---

## Related Commands

- [`mzm get view`](get.md#view) - List and retrieve views
- [`mzm get category`](get.md#category) - List and retrieve categories
- [`mzm edit view`](edit.md#view) - Edit existing views
- [`mzm edit category`](edit.md#category) - Edit existing categories
- [`mzm delete view`](delete.md#view) - Delete views
- [`mzm delete category`](delete.md#category) - Delete categories
- [`mzm log search`](log.md#search) - Search logs using views
- [`mzm log tail`](log.md#tail) - Tail logs using views

---

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `MZM_ACCESS_KEY` | **Yes** | Mezmo platform access key for authentication | None |
| `EDITOR` | No | Text editor for interactive resource creation | `vi` (Unix) / `notepad.exe` (Windows) |

---

## See Also

- [README.md](../../README.md) - Main documentation
