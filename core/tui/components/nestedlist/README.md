# Nested List Component

This document describes the nested list component that provides an interactive interface for selecting resources organized by categories, with configurable group icons similar to the Deno Select prompt.

## Overview

The nested list component is designed to be embedded in larger bubble tea applications. It provides a clean, reusable model for managing nested resource selection without taking over the terminal. The component handles only its own rendering and state management, allowing parent programs to manage overall screen real estate.

## Key Features

- **Generic Design**: Works with any resource type that implements the `CategorizedResource` interface
- **Configurable Icons**: Similar to Deno's Select prompt, use `groupIcon` for closed groups and `groupOpenIcon` for open groups
- **Nested Navigation**: Intuitive navigation between category and resource levels
- **Type Safety**: Maintains type safety while allowing casting back to concrete resource types
- **Backward Compatibility**: Provides adapters for existing view-specific code
- **Professional UI**: Styled lists with proper navigation, help text, and visual feedback
- **Embeddable**: Designed to be used within larger bubble tea programs without managing the terminal itself

## Architecture

### Core Components

1. **CategorizedResource Interface**: Generic interface for any resource that can be categorized
2. **CategoryItem**: Represents a category with its resources
3. **NestedListModel**: Main component that manages navigation between categories and resources

### Interface Definition

```go
type CategorizedResource interface {
    GetName() string        // Display name
    GetCategory() string    // Category for grouping
}
```

## Usage Examples

### Embedding in a Larger Application (Recommended)

```go
// Define your custom resource type
type AlertResource struct {
    Name     string
    Category string
}

func (a AlertResource) GetName() string     { return a.Name }
func (a AlertResource) GetCategory() string { return a.Category }

// Create the model
alerts := []nestedlist.CategorizedResource{
    AlertResource{Name: "High CPU", Category: "System"},
    AlertResource{Name: "Low Memory", Category: "System"},
}

model := nestedlist.NewModel(alerts, 80, 25)

// Use in your own bubble tea program
program := tea.NewProgram(myParentModel)
// The parent model can embed the nestedlist model and manage it
```

### Standalone Usage (Convenience Functions)

```go
// For quick, standalone selection without embedding
alerts := []nestedlist.CategorizedResource{
    AlertResource{Name: "High CPU", Category: "System"},
    AlertResource{Name: "Low Memory", Category: "System"},
}

selectedResource, err := nestedlist.New(alerts)
if err != nil {
    log.Fatal(err)
}

if alert, ok := selectedResource.(AlertResource); ok {
    fmt.Printf("Selected alert: %s\n", alert.Name)
}
```

### Custom Icons

```go
// Use custom group icons
selectedResource, err := nestedlist.NewWithIcons(
    alerts,
    "► ",  // groupIcon for closed groups
    "◄ ",  // groupOpenIcon for open groups
)

if err != nil {
    log.Fatal(err)
}
```

### Using with Views (Direct Interface Implementation)

```go
// Simplified approach - view.View implements CategorizedResource directly
views := []*view.View{
    {Name: "Error Logs", Category: []string{"Monitoring"}, Query: "level:error"},
    {Name: "User Activity", Category: []string{"Analytics"}, Query: "event:user"},
}

// Convert to interface
resources := make([]nestedlist.CategorizedResource, len(views))
for i, v := range views {
    resources[i] = v
}

// Select using nestedlist
selectedResource, err := nestedlist.New(resources)
if err != nil {
    log.Fatal(err)
}

if selectedResource != nil {
    // Cast back to concrete type
    selectedView := selectedResource.(*view.View)
    fmt.Printf("Selected: %s\n", selectedView.Name)
}
```

### Embedded in a Parent Program

```go
// Parent model that embeds the nested list
type MyApp struct {
    nestedList nestedlist.NestedListModel
    // ... other fields
}

func (m MyApp) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    // Handle messages for your app
    
    // Delegate to nested list if it's active
    if m.showNestedList {
        updatedModel, cmd := m.nestedList.Update(msg)
        if nestedListModel, ok := updatedModel.(nestedlist.NestedListModel); ok {
            m.nestedList = nestedListModel
            
            // Check if selection was made
            if nestedListModel.GetSelectedResource() != nil {
                // Handle selection
                m.showNestedList = false
            }
        }
        return m, cmd
    }
    
    // ... rest of your app logic
}

func (m MyApp) View() string {
    var content strings.Builder
    
    // Render your app header/layout
    content.WriteString("My App\n\n")
    
    if m.showNestedList {
        // Render nested list within your layout
        content.WriteString(m.nestedList.View())
    } else {
        // Render other content
        content.WriteString("Main view\n")
    }
    
    return content.String()
}
```

## Visual Representation

### Category Level (Closed Groups)

```
> » Category A (3)
  » Category B (2)
  » Category C (1)

↑↓: Navigate, →: Open, Enter: Select, Esc: Exit
```

### Resource Level (Open Groups)

```
« Category A
> Resource 1
  Resource 2
  Resource 3

↑↓: Navigate, ←: Back, Enter: Select, Esc: Exit
```

## API Reference

### Core Functions

#### `New(resources []CategorizedResource) (CategorizedResource, error)`
Convenience function for standalone interactive resource selection with default icons ("» " and "« "). 
**Note**: This takes over the terminal for the duration of the selection. For embedding in larger programs, use `NewModel()` instead.

#### `NewWithIcons(resources []CategorizedResource, groupIcon, groupOpenIcon string) (CategorizedResource, error)`
Convenience function for standalone resource selection with custom group icons.
**Note**: This takes over the terminal for the duration of the selection. For embedding in larger programs, use `NewModelWithIcons()` instead.

#### `NewModel(resources []CategorizedResource) NestedListModel`
Creates a new model with default icons for embedding in larger bubble tea applications. Use this when you want to manage the program yourself.

#### `NewModelWithIcons(resources []CategorizedResource, groupIcon, groupOpenIcon string) NestedListModel`
Creates a new model with custom icons for embedding in larger bubble tea applications.

### NestedListModel Methods

#### `Init() tea.Cmd`
Initializes the model (implements bubble tea Model interface).

#### `Update(msg tea.Msg) (tea.Model, tea.Cmd)`
Processes messages and updates state (implements bubble tea Model interface).

#### `View() string`
Renders the current state (implements bubble tea Model interface). Returns only the component's content without managing the terminal.

#### `GetSelectedResource() CategorizedResource`
Returns the selected resource, or nil if nothing was selected.

#### `ShouldExit() bool`
Returns whether the user exited without selecting (via Esc, q, or Ctrl+C).

#### `GetCurrentLevel() NavigationLevel`
Returns current navigation level (CategoryLevel or ResourceLevel).

#### `GetSelectedIndex() int`
Returns the currently selected index at the current level.

#### `GetCategoryCount() int`
Returns the total number of categories.

#### `GetGroupIcon() string`
Returns the current group icon.

#### `GetGroupOpenIcon() string`
Returns the current group open icon.

#### `SetGroupIcons(groupIcon, groupOpenIcon string)`
Updates the group icons after creation.

#### `Reset() NestedListModel`
Resets the model to initial state.

### Working with Concrete Resource Types

Since resource types (like `view.View`) implement the `CategorizedResource` interface directly, you can cast them to the interface and cast back to the concrete type:

```go
// Convert views to CategorizedResource interface
resources := make([]nestedlist.CategorizedResource, len(views))
for i, v := range views {
    resources[i] = v // Direct cast since view.View implements CategorizedResource
}

// Use the nested list
selectedResource, err := nestedlist.New(resources)
if err != nil {
    return err
}

// Cast back to concrete type
selectedView := selectedResource.(*view.View)
```

## Navigation

### At Category Level
- **↑/↓** or **k/j**: Navigate up/down
- **→**: Open selected category
- **Enter**: Open selected category
- **Esc/q/Ctrl+C**: Exit

### At Resource Level
- **↑/↓** or **k/j**: Navigate up/down
- **←**: Go back to categories
- **Backspace/h**: Go back to categories
- **Enter**: Select resource and exit
- **Esc/q/Ctrl+C**: Exit without selection

## Design Philosophy

This component is designed with the following principles:

1. **Single Responsibility**: The component manages only its own state and rendering
2. **Composability**: Can be easily embedded in larger bubble tea applications
3. **Non-Invasive**: Does not take over the terminal or manage screen real estate
4. **Flexibility**: Works with any resource type through the CategorizedResource interface
5. **Testability**: State management is separate from terminal control

## Icon Guidelines

Choose icons that clearly indicate the state of groups:

### Common Icon Pairs

| Closed | Open | Use Case |
|--------|------|----------|
| `» ` | `« ` | Default (most readable) |
| `▶ ` | `▼ ` | Arrow indicators |
| `▸ ` | `▾ ` | Triangle indicators |
| `+ ` | `- ` | Expand/collapse style |
| `→ ` | `↓ ` | Direction indicators |

## Benefits

### For Developers

1. **Reusability**: One component works with any resource type
2. **Type Safety**: Generic interface with concrete type casting
3. **Customizable**: Configure icons to match your UI
4. **Easy Integration**: Drop-in component for larger applications
5. **Flexible**: Can be embedded or used standalone
6. **Non-Invasive**: Doesn't interfere with parent program's screen management

### For Users

1. **Consistent Experience**: Same navigation across all resource types
2. **Clear Hierarchy**: Icons show parent/child relationships
3. **Intuitive Navigation**: Familiar keyboard shortcuts
4. **Visual Feedback**: Clear indication of current state
5. **Accessibility**: Standard keyboard navigation patterns

## Implementation Details

### State Management

The component uses a single `selectedIndex` that works across both levels:
- At CategoryLevel: index maps to categories
- At ResourceLevel: index maps to resources within the selected category

### Rendering Strategy

- **Categories**: Display with pointer before groupIcon to indicate selection
- **Resources**: Display with pointer before name to indicate selection
- **Open Category Header**: Displayed with groupOpenIcon to show it's expanded
- **Screen Management**: Component only renders its content; parent program manages screen

### Memory Efficiency

- **Lazy Initialization**: Categories and resources are grouped on model creation
- **Minimal State**: Only current level, index, and category name stored
- **Efficient Updates**: Only component's view is rendered

## Migration Guide

### From Original ViewSelector

```go
// Old way
selectedView, err := components.ViewSelector(views)

// New simplified approach - view.View implements CategorizedResource directly
resources := make([]nestedlist.CategorizedResource, len(views))
for i, v := range views {
    resources[i] = v
}

selectedResource, err := nestedlist.New(resources)
selectedView := selectedResource.(*view.View)

// Or with custom icons
selectedResource, err := nestedlist.NewWithIcons(
    resources,
    "▶ ",  // groupIcon
    "▼ ",  // groupOpenIcon
)
selectedView := selectedResource.(*view.View)
```

### Adding New Resource Types

1. Implement `CategorizedResource` interface
2. Use `nestedlist.New()` or `nestedlist.NewWithIcons()` for standalone use
3. Use `nestedlist.NewModel()` or `nestedlist.NewModelWithIcons()` for embedding
4. Cast result back to your concrete type

## Examples

See `cmd/demo_generic/main.go` for complete working examples of:

- View resources (backward compatibility)
- Custom alert resources
- Custom icon configuration
- Type casting and handling
