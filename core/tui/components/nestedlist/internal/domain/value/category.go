// Package value contains value objects for the nested list component.
package value

// CategoryItem represents a category with its resource count.
type CategoryItem struct {
	name      string
	count     int
	resources []*Item
}

// NewCategoryItem creates a new category item.
func NewCategoryItem(name string, resources []*Item) *CategoryItem {
	return &CategoryItem{
		name:      name,
		count:     len(resources),
		resources: resources,
	}
}

// Name returns the category name.
func (c *CategoryItem) Name() string {
	return c.name
}

// Count returns the number of resources in the category.
func (c *CategoryItem) Count() int {
	return c.count
}

// Resources returns the resources in the category.
func (c *CategoryItem) Resources() []*Item {
	result := make([]*Item, len(c.resources))
	copy(result, c.resources)
	return result
}
