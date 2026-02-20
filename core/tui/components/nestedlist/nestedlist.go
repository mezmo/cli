package nestedlist

import (
	"fmt"
	"strings"

	"mzm/core/tui/components/nestedlist/internal/domain/model"
	"mzm/core/tui/components/nestedlist/internal/domain/value"
	"mzm/core/tui/keyboard"

	"github.com/phoenix-tui/phoenix/style"
	tea "github.com/phoenix-tui/phoenix/tea"
)

// Options configures the nested list behavior and appearance
type Options struct {
	// Appearance
	GroupIcon     string // Icon for collapsed groups (default: "» ")
	GroupOpenIcon string // Icon for expanded groups (default: "« ")

	// Behavior
	Title       string                      // Optional title to display
	ShowHelp    bool                        // Whether to show help text (default: true)
	AllowCancel bool                        // Whether user can cancel/exit (default: true)
	SortFn      func(i, j CategoryItem) int // Custom sorting function for categories (default: alphabetical with "Uncategorized" last)
}

// DefaultOptions returns sensible default options
func DefaultOptions() Options {
	return Options{
		GroupIcon:     "\u00BB",
		GroupOpenIcon: "\u00AB",
		ShowHelp:      true,
		AllowCancel:   true,
		SortFn:        nil, // nil means use the nil sorting logic
	}
}

// NestedListSelector provides a high-level interface for resource selection
type NestedListSelector struct {
	model   *NestedListModel
	options Options
}

// NewSelector creates a new nested list selector with the given resources and options
func NewSelector(resources []CategorizedResource, opts Options) *NestedListSelector {
	model := NewModelWithOptions(resources, opts.GroupIcon, opts.GroupOpenIcon, opts.SortFn)

	return &NestedListSelector{
		model:   &model,
		options: opts,
	}
}

// Run executes the selector and returns the selected resource using Bubble Tea
func (component *NestedListSelector) Run() (CategorizedResource, error) {
	p := tea.New(component.model)

	err := p.Run()
	if err != nil {
		return nil, err
	}

	// If the program is exiting, and nothing was selected, return nil
	if component.model.domain.ShouldExit() && component.model.domain.SelectedResource() == nil {
		return nil, nil
	}

	return component.model.domain.SelectedResource(), nil
}

// NavigationLevel represents the current level in the nested list
type NavigationLevel = value.NavigationLevel

// CategoryItem represents a category with its resource count
// this is intentionally exposed to facilitate the sort handler with out
// having to expose the internal domain values
type CategoryItem struct {
	Name      string
	Count     int
	Resources []CategorizedResource
}

// NestedListModel represents the nested list component with configurable group icons
type NestedListModel struct {
	domain        *model.NestedList
	keymap        KeyMap
	selectedStyle style.Style
	normalStyle   style.Style
	categoryStyle style.Style
	countStyle    style.Style
}

// NewModel creates a new nested list model with default group icons
func NewModel(resources []CategorizedResource) NestedListModel {
	return NewModelWithIcons(resources, "\u00BB", "\u00AB")
}

// NewModelWithIcons creates a new nested list model with custom group icons
func NewModelWithIcons(resources []CategorizedResource, groupIcon, groupOpenIcon string) NestedListModel {
	return NewModelWithOptions(resources, groupIcon, groupOpenIcon, nil)
}

// NewModelWithOptions creates a new nested list model with custom group icons and sorting function
func NewModelWithOptions(resources []CategorizedResource, groupIcon, groupOpenIcon string, sortFn func(i, j CategoryItem) int) NestedListModel {
	selectedStyle := style.New()

	normalStyle := style.New().
		Foreground(style.Gray)

	categoryStyle := style.New().Bold(true).
		Foreground(style.RGB(255, 255, 255))

	countStyle := style.New().
		Foreground(style.RGB(136, 136, 136))

	// Convert resources to domain interface
	domainResources := make([]value.CategorizedResource, len(resources))
	for i, resource := range resources {
		domainResources[i] = resource
	}

	domain := model.NewNestedList(domainResources).
		WithGroupIcons(groupIcon, groupOpenIcon)

	if sortFn != nil {
		domainSortFn := func(i, j *value.CategoryItem) int {
			// Convert domain CategoryItem to public CategoryItem for the callback
			publicI := CategoryItem{
				Name:      i.Name(),
				Count:     i.Count(),
				Resources: convertDomainItemsToResources(i.Resources()),
			}
			publicJ := CategoryItem{
				Name:      j.Name(),
				Count:     j.Count(),
				Resources: convertDomainItemsToResources(j.Resources()),
			}
			return sortFn(publicI, publicJ)
		}
		domain = domain.WithSortFunction(domainSortFn)
	}

	return NestedListModel{
		domain:        domain,
		keymap:        NewKeyMap(),
		selectedStyle: selectedStyle,
		normalStyle:   normalStyle,
		categoryStyle: categoryStyle,
		countStyle:    countStyle,
	}
}

// convertDomainItemsToResources converts domain items back to CategorizedResource interface
func convertDomainItemsToResources(items []*value.Item) []CategorizedResource {
	result := make([]CategorizedResource, len(items))
	for i, item := range items {
		result[i] = item.Value()
	}
	return result
}

// Init implements tea.Model interface
func (m *NestedListModel) Init() tea.Cmd {
	return nil
}

// Update implements tea.Model interface
func (m *NestedListModel) Update(msg tea.Msg) (*NestedListModel, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		newModel, cmd := m.handleKeyMsg(msg)
		// Update the current model in-place with the new state
		*m = *newModel
		return m, cmd
	}
	return m, nil
}

// handleKeyMsg processes keyboard input using Phoenix clone pattern
func (m *NestedListModel) handleKeyMsg(msg tea.KeyMsg) (*NestedListModel, tea.Cmd) {
	action := m.keymap.GetAction(msg)

	newModel := m.clone()

	switch action {
	case keyboard.ActionQuit:
		newModel.domain = newModel.domain.Exit()
		return newModel, tea.Quit()
	case keyboard.ActionMoveUp:
		newModel.domain = newModel.domain.MoveUp()
	case keyboard.ActionMoveDown:
		newModel.domain = newModel.domain.MoveDown()
	case keyboard.ActionSelect:
		if newModel.domain.CurrentLevel().IsCategoryLevel() {
			// Navigate to category
			newModel.domain = newModel.domain.NavigateToCategory()
		} else {
			// Select resource and quit
			newModel.domain = newModel.domain.SelectResource()
			if newModel.domain.SelectedResource() != nil {
				return newModel, tea.Quit()
			}
		}
	case keyboard.ActionMoveBack:
		newModel.domain = newModel.domain.NavigateBack()
	case keyboard.ActionMoveForward:
		if newModel.domain.CurrentLevel().IsCategoryLevel() {
			newModel.domain = newModel.domain.NavigateToCategory()
		}
	case keyboard.ActionMoveLeft:
		newModel.domain = newModel.domain.NavigateBack()
	case keyboard.ActionMoveRight:
		if newModel.domain.CurrentLevel().IsCategoryLevel() {
			newModel.domain = newModel.domain.NavigateToCategory()
		}
	}
	return newModel, nil
}

// clone creates a shallow copy of the model for immutability
func (m *NestedListModel) clone() *NestedListModel {
	return &NestedListModel{
		domain:        m.domain,
		keymap:        m.keymap,
		selectedStyle: m.selectedStyle,
		normalStyle:   m.normalStyle,
		categoryStyle: m.categoryStyle,
		countStyle:    m.countStyle,
	}
}

// View renders the current state
func (m NestedListModel) View() string {
	// Return empty view when exiting to clear the screen
	if m.domain.ShouldExit() {
		return ""
	}

	switch m.domain.CurrentLevel() {
	case value.CategoryLevel:
		return m.renderCategories()
	case value.ResourceLevel:
		return m.renderResources()
	default:
		return ""
	}
}

// renderCategories renders the category list with group icons
func (m NestedListModel) renderCategories() string {
	categories := m.domain.Categories()
	selectedIndex := m.domain.SelectedIndex()
	groupIcon := m.domain.GroupIcon()

	var content strings.Builder

	// Add categories
	for i, category := range categories {
		var text string

		// Pointer before groupIcon
		if i == selectedIndex {
			text = fmt.Sprintf("> %s %s (%d)", groupIcon, category.Name(), category.Count())
		} else {
			text = fmt.Sprintf("  %s %s (%d)", groupIcon, category.Name(), category.Count())
		}

		// Apply styles
		var item string
		if i == selectedIndex {
			item = style.Render(m.selectedStyle, text)
		} else {
			item = style.Render(m.normalStyle, text)
		}

		content.WriteString(item + "\n")
	}

	return content.String()
}

// renderResources renders the resource list for the selected category
func (m NestedListModel) renderResources() string {
	selectedIndex := m.domain.SelectedIndex()
	groupOpenIcon := m.domain.GroupOpenIcon()
	selectedCategory := m.domain.SelectedCategory()

	// Get resources for the selected category
	var resources []*value.Item
	categories := m.domain.Categories()
	for _, category := range categories {
		if category.Name() == selectedCategory {
			resources = category.Resources()
			break
		}
	}

	var content strings.Builder

	// Add parent category as header with groupOpenIcon to indicate it's open
	categoryHeaderText := fmt.Sprintf("%s %s", groupOpenIcon, selectedCategory)

	// Apply styles to category header
	categoryHeader := style.Render(m.categoryStyle, categoryHeaderText)
	content.WriteString(categoryHeader + "\n")

	// Add resources - leaf items with pointer before name
	for i, resource := range resources {
		var text string

		if i == selectedIndex {
			text = fmt.Sprintf("> %s", resource.Value().GetName())
		} else {
			text = fmt.Sprintf("  %s", resource.Value().GetName())
		}

		// Apply styles
		var item string
		if i == selectedIndex {
			item = style.Render(m.selectedStyle, text)
		} else {
			item = style.Render(m.normalStyle, text)
		}

		content.WriteString(item + "\n")
	}

	return content.String()
}

// GetSelectedResource returns the selected resource
func (m NestedListModel) GetSelectedResource() CategorizedResource {
	return m.domain.SelectedResource()
}

// ShouldExit returns whether the user wants to exit
func (m NestedListModel) ShouldExit() bool {
	return m.domain.ShouldExit()
}

// GetCurrentLevel returns the current navigation level
func (m NestedListModel) GetCurrentLevel() NavigationLevel {
	return m.domain.CurrentLevel()
}

// GetSelectedIndex returns the current selected index
func (m NestedListModel) GetSelectedIndex() int {
	return m.domain.SelectedIndex()
}

// GetCategoryCount returns the number of categories
func (m NestedListModel) GetCategoryCount() int {
	return len(m.domain.Categories())
}

// GetGroupIcon returns the group icon
func (m NestedListModel) GetGroupIcon() string {
	return m.domain.GroupIcon()
}

// GetGroupOpenIcon returns the group open icon
func (m NestedListModel) GetGroupOpenIcon() string {
	return m.domain.GroupOpenIcon()
}

// New creates a new nested list selector with default options
// using default group icons for indicating parent/child relationships
func New(resources []CategorizedResource) (*NestedListSelector, error) {
	return NewWithOptions(resources, DefaultOptions())
}

// NewWithIcons creates a new nested list selector with custom group icons
func NewWithIcons(resources []CategorizedResource, groupIcon, groupOpenIcon string) (*NestedListSelector, error) {
	opts := DefaultOptions()
	opts.GroupIcon = groupIcon
	opts.GroupOpenIcon = groupOpenIcon
	return NewWithOptions(resources, opts)
}

// NewWithOptions creates a new nested list selector with custom options
func NewWithOptions(resources []CategorizedResource, opts Options) (*NestedListSelector, error) {
	if len(resources) == 0 {
		return nil, fmt.Errorf("no resources provided")
	}

	selector := NewSelector(resources, opts)
	return selector, nil
}
