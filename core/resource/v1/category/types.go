package category

import (
	"fmt"
	"mzm/core/resource"
	"strings"
)

// JoiDetail represents a single validation error detail from Joi
type JoiDetail struct {
	Message string `json:"message"`
	Key     string `json:"key"`
}

// JoiResponse represents the error response from Joi validation
type JoiResponse struct {
	Details []JoiDetail `json:"details"`
	Error   string      `json:"error"`
	Code    string      `json:"code"`
	Status  string      `json:"status"`
}

// FormatJoiError formats Joi validation errors into a user-friendly message
func (j *JoiResponse) FormatJoiError() string {
	if len(j.Details) == 0 {
		return j.Error
	}

	var messages []string
	for _, detail := range j.Details {
		if detail.Message != "" {
			messages = append(messages, fmt.Sprintf("  - %s", detail.Message))
		}
	}

	if len(messages) == 0 {
		return j.Error
	}

	return fmt.Sprintf("\n%s", strings.Join(messages, "\n"))
}

type CategoryType string

const (
	VIEW   CategoryType = "views"
	BOARD  CategoryType = "boards"
	SCREEN CategoryType = "screens"
)

var CATEGORY_TYPES = []CategoryType{VIEW, BOARD, SCREEN}

type Category struct {
	// API-only fields (not shown in templates)
	Id string `json:"id,omitempty" yaml:"id,omitempty,flow" template:"-"`

	// User-editable fields
	Name string       `json:"name" yaml:"name"`
	Type CategoryType `json:"type" yaml:"type"`
}

func (category *Category) PK() string {
	return category.Id
}

func (category *Category) GetName() string {
	return category.Name
}

// Validate validates the Category fields
func (c Category) Validate() error {
	if c.Name == "" {
		return fmt.Errorf("name is required")
	}

	// Validate that type is one of the allowed values
	if c.Type == "" {
		return fmt.Errorf("type is required")
	}

	// Check if type is valid
	validType := false
	for _, catType := range CATEGORY_TYPES {
		if c.Type == catType {
			validType = true
			break
		}
	}

	if !validType {
		return fmt.Errorf("type must be one of: %s, %s, or %s", VIEW, BOARD, SCREEN)
	}

	return nil
}

// ToCreate returns the Category in the format needed for API creation calls
// Both Name and Type are required for creating a new category
func (c *Category) ToCreate() *Category {
	return &Category{
		Name: c.Name,
		Type: c.Type,
	}
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
