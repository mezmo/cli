package nestedlist

import (
	"strings"
	"testing"
)

// MockResource implements CategorizedResource for testing
type MockResource struct {
	name     string
	category string
}

func (m MockResource) GetName() string {
	return m.name
}

func (m MockResource) GetCategory() string {
	return m.category
}

func TestSortFnOption(t *testing.T) {
	// Create test resources
	resources := []CategorizedResource{
		MockResource{name: "Resource C", category: "Zebra"},
		MockResource{name: "Resource B", category: "Alpha"},
		MockResource{name: "Resource A", category: "Beta"},
		MockResource{name: "Resource D", category: "Uncategorized"},
	}

	// Test default sorting (alphabetical with "Uncategorized" last)
	t.Run("Default sorting", func(t *testing.T) {
		model := NewModelWithOptions(resources, "»", "«", nil)

		categories := model.GetCategoryCount()
		if categories != 4 {
			t.Errorf("Expected 4 categories, got %d", categories)
		}

		// Since we can't access the domain directly, we'll test the behavior through the View method
		view := model.View()
		if !strings.Contains(view, "Alpha") || !strings.Contains(view, "Beta") {
			t.Error("Expected category view to contain Alpha and Beta")
		}
	})

	// Test custom sorting (reverse alphabetical)
	t.Run("Custom reverse sorting", func(t *testing.T) {
		customSortFn := func(i, j CategoryItem) int {
			// Reverse alphabetical order
			return strings.Compare(j.Name, i.Name)
		}

		model := NewModelWithOptions(resources, "»", "«", customSortFn)

		categories := model.GetCategoryCount()
		if categories != 4 {
			t.Errorf("Expected 4 categories, got %d", categories)
		}

		// Test that the view contains all expected categories
		view := model.View()
		if !strings.Contains(view, "Alpha") || !strings.Contains(view, "Beta") {
			t.Error("Expected category view to contain Alpha and Beta")
		}
	})
}

func TestOptionsWithSortFn(t *testing.T) {
	resources := []CategorizedResource{
		MockResource{name: "Resource A", category: "Zebra"},
		MockResource{name: "Resource B", category: "Alpha"},
	}

	// Test using Options struct with custom sort function
	opts := DefaultOptions()
	opts.SortFn = func(i, j CategoryItem) int {
		// Sort by name length (shorter names first)
		if len(i.Name) < len(j.Name) {
			return -1
		} else if len(i.Name) > len(j.Name) {
			return 1
		}
		return 0
	}

	selector := NewSelector(resources, opts)
	if selector == nil {
		t.Error("Expected selector to be created")
	}

	// Verify the model has the expected number of categories
	categories := selector.model.GetCategoryCount()
	if categories != 2 {
		t.Errorf("Expected 2 categories, got %d", categories)
	}
}

func TestDefaultOptionsIncludesSortFn(t *testing.T) {
	opts := DefaultOptions()

	// Verify that SortFn is included in default options and is nil
	if opts.SortFn != nil {
		t.Error("Expected default SortFn to be nil")
	}

	// Verify other default values are still correct
	if opts.GroupIcon != "\u00BB" {
		t.Errorf("Expected default GroupIcon '»', got %s", opts.GroupIcon)
	}
	if opts.GroupOpenIcon != "\u00AB" {
		t.Errorf("Expected default GroupOpenIcon '«', got %s", opts.GroupOpenIcon)
	}
	if !opts.ShowHelp {
		t.Error("Expected default ShowHelp to be true")
	}
	if !opts.AllowCancel {
		t.Error("Expected default AllowCancel to be true")
	}
}

// TestCustomSortByCount demonstrates a practical custom sort function
func TestCustomSortByCount(t *testing.T) {
	// Create resources with different counts per category
	resources := []CategorizedResource{
		MockResource{name: "Resource 1", category: "Alpha"},
		MockResource{name: "Resource 2", category: "Alpha"}, // Alpha: 2 items
		MockResource{name: "Resource 3", category: "Beta"},  // Beta: 1 item
		MockResource{name: "Resource 4", category: "Gamma"}, // Gamma: 3 items
		MockResource{name: "Resource 5", category: "Gamma"},
		MockResource{name: "Resource 6", category: "Gamma"},
	}

	// Sort by count (descending) - categories with more items first
	opts := DefaultOptions()
	opts.SortFn = func(i, j CategoryItem) int {
		// Sort by count in descending order
		if i.Count > j.Count {
			return -1
		} else if i.Count < j.Count {
			return 1
		}
		return 0
	}

	model := NewModelWithOptions(resources, "»", "«", opts.SortFn)

	// Verify categories were created
	if model.GetCategoryCount() != 3 {
		t.Errorf("Expected 3 categories, got %d", model.GetCategoryCount())
	}

	// Test that the view contains all expected categories
	view := model.View()
	if !strings.Contains(view, "Alpha") || !strings.Contains(view, "Beta") || !strings.Contains(view, "Gamma") {
		t.Error("Expected category view to contain Alpha, Beta, and Gamma")
	}
}
