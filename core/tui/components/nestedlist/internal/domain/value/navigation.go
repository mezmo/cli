// Package value contains value objects for the nested list component.
package value

// NavigationLevel represents the current level in the nested list.
type NavigationLevel string

const (
	CategoryLevel NavigationLevel = "categories"
	ResourceLevel NavigationLevel = "resources"
)

// String returns the string representation of the navigation level.
func (n NavigationLevel) String() string {
	return string(n)
}

// IsCategoryLevel returns true if the current level is category level.
func (n NavigationLevel) IsCategoryLevel() bool {
	return n == CategoryLevel
}

// IsResourceLevel returns true if the current level is resource level.
func (n NavigationLevel) IsResourceLevel() bool {
	return n == ResourceLevel
}
