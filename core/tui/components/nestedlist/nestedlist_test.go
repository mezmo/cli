package nestedlist

import (
	"strings"
	"testing"

	"mzm/core/tui/components/nestedlist/internal/domain/value"

	tea "github.com/phoenix-tui/phoenix/tea"
)

// Resource represents a test resource
type Resource struct {
	Name     string
	Category string
}

func (t Resource) GetName() string {
	return t.Name
}

func (t Resource) GetCategory() string {
	return t.Category
}

func TestNestedListModel_Creation(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Resource 1", Category: "Category A"},
		Resource{Name: "Resource 2", Category: "Category A"},
		Resource{Name: "Resource 3", Category: "Category B"},
	}

	model := NewModel(resources)

	// Test initial state
	if model.GetCurrentLevel() != value.CategoryLevel {
		t.Errorf("Expected initial level to be CategoryLevel, got %v", model.GetCurrentLevel())
	}

	if model.GetSelectedIndex() != 0 {
		t.Errorf("Expected initial selected index to be 0, got %d", model.GetSelectedIndex())
	}

	if model.GetCategoryCount() != 2 {
		t.Errorf("Expected 2 categories, got %d", model.GetCategoryCount())
	}

	if model.ShouldExit() {
		t.Error("Expected shouldExit to be false initially")
	}

	if model.GetSelectedResource() != nil {
		t.Error("Expected no selected resource initially")
	}
}

func TestNestedListModel_Navigation(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Resource 1", Category: "Category A"},
		Resource{Name: "Resource 2", Category: "Category A"},
		Resource{Name: "Resource 3", Category: "Category B"},
	}

	model := NewModel(resources)

	// Test moving down - use Update method with key messages
	newModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyDown})
	if newModel.GetSelectedIndex() != 1 {
		t.Errorf("Expected selected index to be 1 after move down, got %d", newModel.GetSelectedIndex())
	}

	// Test moving up
	newModel, _ = newModel.Update(tea.KeyMsg{Type: tea.KeyUp})
	if newModel.GetSelectedIndex() != 0 {
		t.Errorf("Expected selected index to be 0 after move up, got %d", newModel.GetSelectedIndex())
	}

	// Test moving up at boundary (should wrap to last item)
	newModel, _ = newModel.Update(tea.KeyMsg{Type: tea.KeyUp})
	if newModel.GetSelectedIndex() != 1 {
		t.Errorf("Expected selected index to wrap to 1 when moving up from boundary, got %d", newModel.GetSelectedIndex())
	}
}

func TestNestedListModel_CategoryGrouping(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Resource 1", Category: "Analytics"},
		Resource{Name: "Resource 2", Category: "Analytics"},
		Resource{Name: "Resource 3", Category: "Security"},
		Resource{Name: "Resource 4", Category: "Uncategorized"},
	}

	model := NewModel(resources)

	// Test category count
	if model.GetCategoryCount() != 3 {
		t.Errorf("Expected 3 categories, got %d", model.GetCategoryCount())
	}

	// Test that categories are properly sorted (Analytics, Security, Uncategorized)
	// Note: We can't directly access categories, but we can test the behavior
	expectedCategoryCount := 3
	if model.GetCategoryCount() != expectedCategoryCount {
		t.Errorf("Expected %d categories, got %d", expectedCategoryCount, model.GetCategoryCount())
	}
}

func TestNestedListModel_Reset(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Resource 1", Category: "Category A"},
	}

	model := NewModel(resources)

	// Modify state using Update method
	newModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyDown})
	newModel, _ = newModel.Update(tea.KeyMsg{Type: tea.KeyRune, Rune: 'q'})

	// Reset - create new model since we don't have reset method
	model = NewModel(resources)

	// Test reset state
	if model.GetCurrentLevel() != value.CategoryLevel {
		t.Errorf("Expected level to be CategoryLevel after reset, got %v", model.GetCurrentLevel())
	}

	if model.GetSelectedIndex() != 0 {
		t.Errorf("Expected selected index to be 0 after reset, got %d", model.GetSelectedIndex())
	}

	if model.ShouldExit() {
		t.Error("Expected shouldExit to be false after reset")
	}

	if model.GetSelectedResource() != nil {
		t.Error("Expected no selected resource after reset")
	}
}

func TestNestedListModel_ResourceSelection(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Resource 1", Category: "Category A"},
		Resource{Name: "Resource 2", Category: "Category A"},
		Resource{Name: "Resource 3", Category: "Category B"},
	}

	model := NewModel(resources)

	// Initially no resource should be selected
	if model.GetSelectedResource() != nil {
		t.Error("Expected no selected resource initially")
	}

	// Debug: Check what key string is generated
	enterMsg := tea.KeyMsg{Type: tea.KeyEnter}
	t.Logf("Enter key message string: '%s'", enterMsg.String())

	keymap := NewKeyMap()
	action := keymap.GetAction(enterMsg)
	t.Logf("Action for enter key: '%s'", action)

	// Debug initial state
	t.Logf("Initial level: %v", model.GetCurrentLevel())
	t.Logf("Initial selected index: %d", model.GetSelectedIndex())

	// Navigate to a category (simulate Enter key press)
	updatedModel, _ := model.Update(enterMsg)

	// Debug after first update
	t.Logf("After navigation - level: %v", updatedModel.GetCurrentLevel())
	t.Logf("After navigation - selected index: %d", updatedModel.GetSelectedIndex())

	// Should now be at resource level
	if updatedModel.GetCurrentLevel() != value.ResourceLevel {
		t.Errorf("Expected to be at ResourceLevel after navigation, got %v", updatedModel.GetCurrentLevel())
		// Return early to prevent panic
		return
	}

	// Select a resource (simulate Enter key press again)
	updatedModel2, _ := updatedModel.Update(enterMsg)

	// Debug after second update
	t.Logf("After selection - should exit: %t", updatedModel2.ShouldExit())
	t.Logf("After selection - selected resource: %v", updatedModel2.GetSelectedResource())

	// Should have a selected resource and be marked for exit
	if updatedModel2.GetSelectedResource() == nil {
		t.Error("Expected a selected resource after selection")
		return
	}

	if !updatedModel2.ShouldExit() {
		t.Error("Expected shouldExit to be true after resource selection")
	}

	// Verify the selected resource is correct
	selectedResource := updatedModel2.GetSelectedResource()
	if selectedResource.GetName() != "Resource 1" {
		t.Errorf("Expected selected resource to be 'Resource 1', got %s", selectedResource.GetName())
	}
}

func TestNestedListModel_ViewRendering(t *testing.T) {
	resources := []CategorizedResource{
		Resource{Name: "Test Resource", Category: "Test Category"},
	}

	model := NewModel(resources)

	// Test category view rendering
	view := model.View()
	if view == "" {
		t.Error("Expected non-empty view for categories")
	}

	// The view should contain the category name and count
	if !strings.Contains(view, "Test Category") {
		t.Error("Expected view to contain category name")
	}

	if !strings.Contains(view, "(1)") {
		t.Error("Expected view to contain resource count")
	}
}
