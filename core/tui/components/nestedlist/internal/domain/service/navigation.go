// Package service contains domain services for the nested list component.
package service

// NavigationService provides navigation logic for the nested list.
type NavigationService struct{}

// NewNavigationService creates a new navigation service.
func NewNavigationService() *NavigationService {
	return &NavigationService{}
}

// MoveUp moves the selection up by one, wrapping to the bottom if at the top.
func (n *NavigationService) MoveUp(currentIndex, maxIndex int) int {
	if currentIndex > 0 {
		return currentIndex - 1
	}

	return maxIndex - 1
}

// MoveDown moves the selection down by one, wrapping to the top if at the bottom.
func (n *NavigationService) MoveDown(currentIndex, maxIndex int) int {
	if currentIndex < maxIndex-1 {
		return currentIndex + 1
	}
	return 0
}

// FindCategoryIndex finds the index of a category by name.
func (n *NavigationService) FindCategoryIndex(categoryName string, categories []string) int {
	for i, name := range categories {
		if name == categoryName {
			return i
		}
	}
	return 0
}
