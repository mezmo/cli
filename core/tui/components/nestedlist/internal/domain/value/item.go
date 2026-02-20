// Package value contains value objects for the nested list component.
package value

// CategorizedResource represents an item that can be categorized.
// This interface is defined here to avoid circular imports but should match
// the public interface in the parent package.
type CategorizedResource interface {
	GetName() string
	GetCategory() string
}

// NewItem creates a new item with the given value.
func NewItem(value CategorizedResource) *Item {
	return &Item{
		value:    value,
		category: value.GetCategory(),
	}
}

// Item represents a single item in the nested list.
type Item struct {
	value    CategorizedResource
	category string
}

// Value returns the underlying value.
func (i *Item) Value() CategorizedResource {
	return i.value
}

// Name returns the display name of the item.
func (i *Item) Name() string {
	return i.value.GetName()
}

// Category returns the category of the item.
func (i *Item) Category() string {
	return i.category
}
