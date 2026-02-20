package nestedlist

// CategorizedResource is an interface for resources that can be categorized and selected
// in the nested list component.
type CategorizedResource interface {
	// GetName returns the display name of the resource
	GetName() string
	// GetCategory returns the category name for grouping
	GetCategory() string
}
