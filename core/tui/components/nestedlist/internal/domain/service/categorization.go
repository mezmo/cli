// Package service contains domain services for the nested list component.
package service

import (
	"slices"

	"mzm/core/tui/components/nestedlist/internal/domain/value"
)

// CategorizationService handles grouping items by category.
type CategorizationService struct{}

// NewCategorizationService creates a new categorization service.
func NewCategorizationService() *CategorizationService {
	return &CategorizationService{}
}

// GroupByCategory groups items by their category.
func (c *CategorizationService) GroupByCategory(items []*value.Item, sortFn func(i, j *value.CategoryItem) int) []*value.CategoryItem {
	// Group items by category
	categoryMap := make(map[string][]*value.Item)
	for _, item := range items {
		category := item.Category()
		categoryMap[category] = append(categoryMap[category], item)
	}

	// Create category items
	var categories []*value.CategoryItem
	for name, categoryItems := range categoryMap {
		categories = append(categories, value.NewCategoryItem(name, categoryItems))
	}

	// Sort categories using custom function or default logic
	if sortFn != nil {
		slices.SortFunc(categories, sortFn)
	}

	return categories
}
