// Package model contains the domain model for the nested list component.
package model

import (
	"mzm/core/tui/components/nestedlist/internal/domain/service"
	"mzm/core/tui/components/nestedlist/internal/domain/value"
)

// NestedList is the aggregate root for the nested list component.
type NestedList struct {
	currentLevel          value.NavigationLevel
	selectedIndex         int
	selectedCategory      string
	resources             []*value.Item
	categories            []*value.CategoryItem
	groupIcon             string
	groupOpenIcon         string
	sortFn                func(i, j *value.CategoryItem) int
	selectedResource      value.CategorizedResource
	shouldExit            bool
	navService            *service.NavigationService
	categorizationService *service.CategorizationService
}

// NewNestedList creates a new nested list with the given resources.
func NewNestedList(resources []value.CategorizedResource) *NestedList {
	// Convert to domain items
	items := make([]*value.Item, len(resources))
	for i, resource := range resources {
		items[i] = value.NewItem(resource)
	}

	return &NestedList{
		currentLevel:          value.CategoryLevel,
		selectedIndex:         0,
		selectedCategory:      "",
		resources:             items,
		categories:            nil,
		groupIcon:             "\u00BB",
		groupOpenIcon:         "\u00AB",
		sortFn:                nil,
		selectedResource:      nil,
		shouldExit:            false,
		navService:            service.NewNavigationService(),
		categorizationService: service.NewCategorizationService(),
	}
}


// WithGroupIcons returns a new NestedList with custom group icons.
func (nl *NestedList) WithGroupIcons(groupIcon, groupOpenIcon string) *NestedList {
	newList := nl.clone()
	newList.groupIcon = groupIcon
	newList.groupOpenIcon = groupOpenIcon
	return newList
}

// WithSortFunction returns a new NestedList with a custom sorting function.
func (nl *NestedList) WithSortFunction(sortFn func(i, j *value.CategoryItem) int) *NestedList {
	newList := nl.clone()
	newList.sortFn = sortFn
	newList.rebuildCategories()
	return newList
}

// MoveUp moves the selection up.
func (nl *NestedList) MoveUp() *NestedList {
	newList := nl.clone()
	maxIndex := newList.getMaxIndex()
	newList.selectedIndex = newList.navService.MoveUp(newList.selectedIndex, maxIndex+1)
	return newList
}

// MoveDown moves the selection down.
func (nl *NestedList) MoveDown() *NestedList {
	newList := nl.clone()
	maxIndex := newList.getMaxIndex()
	newList.selectedIndex = newList.navService.MoveDown(newList.selectedIndex, maxIndex+1)
	return newList
}

// NavigateToCategory navigates to the resource level for the selected category.
func (nl *NestedList) NavigateToCategory() *NestedList {
	if !nl.currentLevel.IsCategoryLevel() {
		return nl
	}

	// Ensure categories are built before checking bounds
	if nl.categories == nil {
		nl.rebuildCategories()
	}

	if nl.selectedIndex >= len(nl.categories) {
		return nl
	}

	newList := nl.clone()
	// Ensure categories are built in the new list too
	if newList.categories == nil {
		newList.rebuildCategories()
	}
	selectedCategory := newList.categories[newList.selectedIndex]
	newList.selectedCategory = selectedCategory.Name()
	newList.currentLevel = value.ResourceLevel
	newList.selectedIndex = 0
	return newList
}

// NavigateBack goes back to the category level.
func (nl *NestedList) NavigateBack() *NestedList {
	if !nl.currentLevel.IsResourceLevel() {
		return nl
	}

	newList := nl.clone()
	newList.currentLevel = value.CategoryLevel
	newList.selectedIndex = newList.findCategoryIndex(newList.selectedCategory)
	newList.selectedCategory = ""
	return newList
}

// SelectResource selects the currently focused resource and marks for exit.
func (nl *NestedList) SelectResource() *NestedList {
	if !nl.currentLevel.IsResourceLevel() {
		return nl
	}

	resources := nl.getCurrentCategoryResources()
	if nl.selectedIndex < 0 || nl.selectedIndex >= len(resources) {
		return nl
	}

	newList := nl.clone()
	newList.selectedResource = resources[newList.selectedIndex].Value()
	newList.shouldExit = true
	return newList
}

// Exit marks the list for exit without selection.
func (nl *NestedList) Exit() *NestedList {
	newList := nl.clone()
	newList.shouldExit = true
	return newList
}

// CurrentLevel returns the current navigation level.
func (nl *NestedList) CurrentLevel() value.NavigationLevel {
	return nl.currentLevel
}

// SelectedIndex returns the current selected index.
func (nl *NestedList) SelectedIndex() int {
	return nl.selectedIndex
}

// Categories returns the categories.
func (nl *NestedList) Categories() []*value.CategoryItem {
	if nl.categories == nil {
		nl.rebuildCategories()
	}
	result := make([]*value.CategoryItem, len(nl.categories))
	copy(result, nl.categories)
	return result
}

// SelectedResource returns the selected resource.
func (nl *NestedList) SelectedResource() value.CategorizedResource {
	return nl.selectedResource
}

// ShouldExit returns whether the user wants to exit.
func (nl *NestedList) ShouldExit() bool {
	return nl.shouldExit
}

// GroupIcon returns the group icon.
func (nl *NestedList) GroupIcon() string {
	return nl.groupIcon
}

// GroupOpenIcon returns the group open icon.
func (nl *NestedList) GroupOpenIcon() string {
	return nl.groupOpenIcon
}

// SelectedCategory returns the currently selected category name.
func (nl *NestedList) SelectedCategory() string {
	return nl.selectedCategory
}

// clone creates a shallow copy of the nested list for immutability.
func (nl *NestedList) clone() *NestedList {
	return &NestedList{
		currentLevel:          nl.currentLevel,
		selectedIndex:         nl.selectedIndex,
		selectedCategory:      nl.selectedCategory,
		resources:             nl.resources,
		categories:            nl.categories,
		groupIcon:             nl.groupIcon,
		groupOpenIcon:         nl.groupOpenIcon,
		sortFn:                nl.sortFn,
		selectedResource:      nl.selectedResource,
		shouldExit:            nl.shouldExit,
		navService:            nl.navService,
		categorizationService: nl.categorizationService,
	}
}

// getMaxIndex returns the maximum valid index for the current level.
func (nl *NestedList) getMaxIndex() int {
	switch nl.currentLevel {
	case value.CategoryLevel:
		if nl.categories == nil {
			nl.rebuildCategories()
		}
		return len(nl.categories) - 1
	case value.ResourceLevel:
		return len(nl.getCurrentCategoryResources()) - 1
	default:
		return 0
	}
}

// getCurrentCategoryResources returns the resources for the currently selected category.
func (nl *NestedList) getCurrentCategoryResources() []*value.Item {
	if nl.categories == nil {
		nl.rebuildCategories()
	}

	for _, category := range nl.categories {
		if category.Name() == nl.selectedCategory {
			return category.Resources()
		}
	}
	return []*value.Item{}
}

// findCategoryIndex finds the index of a category by name.
func (nl *NestedList) findCategoryIndex(categoryName string) int {
	if nl.categories == nil {
		nl.rebuildCategories()
	}

	for i, category := range nl.categories {
		if category.Name() == categoryName {
			return i
		}
	}
	return 0
}

// rebuildCategories rebuilds the categories using the categorization service.
func (nl *NestedList) rebuildCategories() {
	// This method mutates nl.categories but is only called from clone or initialization
	nl.categories = nl.categorizationService.GroupByCategory(nl.resources, nl.sortFn)
}
