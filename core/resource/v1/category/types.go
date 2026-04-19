package category

import (
	"fmt"
	"mzm/core/resource"
)

type CategoryType string

const (
	VIEW   CategoryType = "views"
	BOARD  CategoryType = "boards"
	SCREEN CategoryType = "screens"
)

var CATEGORY_TYPES = []CategoryType{VIEW, BOARD, SCREEN}

type Category struct {
	// API-only fields (not shown in templates)
	Account string `json:"account,omitempty" yaml:"account,omitempty,flow" template:"-"`

	// User-editable and identifier fields
	Name string       `json:"name" yaml:"name"`
	Id   string       `json:"id" yaml:"id"`
	Type CategoryType `json:"type" yaml:"type"`
}

func (category *Category) PK() string {
	return category.Id
}

func (category *Category) GetName() string {
	return category.Name
}

// ToUpdate returns the Category in the format needed for API update calls
// Only the Name field can be updated via the API
func (c *Category) ToUpdate() *Category {
	return &Category{
		Name: c.Name,
	}
}

// CategoryFromTemplate creates a Category from a strongly typed resource template
func CategoryFromTemplate(template *resource.IResourceTemplate[Category]) (*Category, error) {
	// Validate that name is provided
	if template.Spec.Name == "" {
		return nil, fmt.Errorf("name is required")
	}

	// Create category from template spec
	category := &Category{
		Name: template.Spec.Name,
		Type: template.Spec.Type,
	}

	return category, nil
}
