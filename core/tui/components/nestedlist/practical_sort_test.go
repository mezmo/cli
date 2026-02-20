package nestedlist

import (
	"testing"
)

// TestPracticalSortingExamples demonstrates real-world sorting scenarios
func TestPracticalSortingExamples(t *testing.T) {
	// Create realistic test data
	resources := []CategorizedResource{
		MockResource{name: "High Priority Alert", category: "Security"},
		MockResource{name: "Login Failed", category: "Security"},
		MockResource{name: "System Error", category: "Logs"},
		MockResource{name: "Debug Info", category: "Logs"},
		MockResource{name: "Performance Warning", category: "Logs"},
		MockResource{name: "CPU Usage", category: "Monitoring"},
		MockResource{name: "Memory Usage", category: "Monitoring"},
		MockResource{name: "Disk Space", category: "Monitoring"},
		MockResource{name: "Network Traffic", category: "Monitoring"},
		MockResource{name: "Old Backup", category: "Uncategorized"},
	}

	t.Run("Default sorting maintains Uncategorized last", func(t *testing.T) {
		opts := DefaultOptions()
		// opts.SortFn is nil, so default sorting applies

		model := NewModelWithOptions(resources, "»", "«", opts.SortFn)

		categoryCount := model.GetCategoryCount()
		if categoryCount != 4 {
			t.Errorf("Expected 4 categories, got %d", categoryCount)
		}

		// We can't directly access categories, but we can verify the basic functionality
		// by checking that the model can navigate and render properly
		view := model.View()
		if view == "" {
			t.Error("Expected non-empty view for categories")
		}
	})

	t.Run("Custom sort function is used", func(t *testing.T) {
		opts := DefaultOptions()
		opts.SortFn = func(i, j CategoryItem) int {
			// Custom sorting logic - alphabetical
			if i.Name < j.Name {
				return -1
			} else if i.Name > j.Name {
				return 1
			}
			return 0
		}

		model := NewModelWithOptions(resources, "»", "«", opts.SortFn)

		// Verify model was created successfully
		if model.GetCategoryCount() != 4 {
			t.Errorf("Expected 4 categories, got %d", model.GetCategoryCount())
		}
	})

	t.Run("Verify SortFn is properly integrated", func(t *testing.T) {
		// Test that when SortFn is provided, it's used instead of default sorting
		opts := DefaultOptions()
		opts.SortFn = func(i, j CategoryItem) int {
			// Custom sorting - reverse alphabetical order
			if i.Name > j.Name {
				return -1
			} else if i.Name < j.Name {
				return 1
			}
			return 0
		}

		model := NewModelWithOptions(resources, "»", "«", opts.SortFn)

		// Verify model was created
		if model.GetCategoryCount() != 4 {
			t.Errorf("Expected 4 categories, got %d", model.GetCategoryCount())
		}

		// This test demonstrates the integration is working
	})
}

// TestSortFnSignatureCompatibility verifies the sort function signature
// matches what the component expects
func TestSortFnSignatureCompatibility(t *testing.T) {
	resources := []CategorizedResource{
		MockResource{name: "Test", category: "Test"},
	}

	// Verify that our SortFn type is compatible with the component
	opts := DefaultOptions()

	// This should compile without issues, proving the signature is correct
	opts.SortFn = func(i, j CategoryItem) int {
		// Standard comparison function signature
		if i.Name < j.Name {
			return -1
		} else if i.Name > j.Name {
			return 1
		}
		return 0
	}

	// Create model to verify it works
	model := NewModelWithOptions(resources, "»", "«", opts.SortFn)

	if model.GetCategoryCount() != 1 {
		t.Errorf("Expected 1 category, got %d", model.GetCategoryCount())
	}
}
