package category

import (
	_ "embed"
	"errors"
	"fmt"
	"mzm/core/resource"
	"sync"

	"resty.dev/v3"
)

//go:embed template.yaml
var categoryTemplate []byte

// CategoryResource implements IResource[Category] for type-safe category operations
type CategoryResource struct {
	client *resty.Client
}

// Ensure CategoryResource implements IResource[Category, Category] with new generic interface
var _ resource.IResource[Category, Category] = (*CategoryResource)(nil)

// Register this resource with the main resource package
func init() {
	resource.Register("v1", "category", NewCategoryResource())
}

// NewCategoryResource creates a new CategoryResource instance
func NewCategoryResource() *CategoryResource {
	return &CategoryResource{
		client: resource.Client(),
	}
}

// Get fetches a category by ID
func (r *CategoryResource) Get(pk string, params map[string]string) (*Category, error) {
	responses := make(chan *Category, len(CATEGORY_TYPES))
	errChan := make(chan error, len(CATEGORY_TYPES))
	var wg sync.WaitGroup

	// Launch a goroutine for each category type
	for _, category_type := range CATEGORY_TYPES {
		wg.Add(1)
		go func(catType CategoryType) {
			defer wg.Done()

			var cat Category
			res, err := r.client.
				R().
				SetResult(&cat).
				SetPathParam("type", string(catType)).
				SetPathParam("pk", pk).
				Get("/v1/config/categories/{type}/{pk}")

			if err != nil {
				errChan <- fmt.Errorf("failed to fetch category from %s: %w", catType, err)
				return
			}

			switch res.StatusCode() {
			case 200:
				result := res.Result().(*Category)
				// Verify the ID matches what we're looking for
				if result.Id == pk {
					responses <- result
				}
			case 404:
				// Category not found in this type, this is expected
				return
			case 401:
				errChan <- fmt.Errorf("unauthorized to fetch category from %s", catType)
			case 403:
				errChan <- fmt.Errorf("forbidden to fetch category from %s", catType)
			default:
				errChan <- fmt.Errorf("unexpected error fetching category from %s: status %d", catType, res.StatusCode())
			}
		}(category_type)
	}

	// Close channels after all goroutines complete
	go func() {
		wg.Wait()
		close(responses)
		close(errChan)
	}()

	// Collect first successful response
	var foundCategory *Category
	var errors []error

	// Collect responses (we only need the first one)
	for cat := range responses {
		if foundCategory == nil {
			foundCategory = cat
		}
	}

	// Collect errors
	for err := range errChan {
		errors = append(errors, err)
	}

	// If there were any errors, return the first one
	if len(errors) > 0 {
		return nil, errors[0]
	}

	// Return nil if no category was found (not an error)
	return foundCategory, nil
}

// List returns all categories
func (r *CategoryResource) List(params map[string]string) ([]Category, error) {
	responses := make(chan []Category, len(CATEGORY_TYPES))
	errChan := make(chan error, len(CATEGORY_TYPES))
	var wg sync.WaitGroup

	// Launch a goroutine for each category type
	for _, category_type := range CATEGORY_TYPES {
		wg.Add(1)
		go func(catType CategoryType) {
			defer wg.Done()

			var cats []Category
			res, err := r.client.
				R().
				SetResult(&cats).
				SetPathParam("type", string(catType)).
				Get("/v1/config/categories/{type}")

			if err != nil {
				errChan <- fmt.Errorf("failed to fetch %s categories: %w", catType, err)
				return
			}

			switch res.StatusCode() {
			case 200:
				result := res.Result().(*[]Category)
				responses <- *result
			case 401:
				errChan <- fmt.Errorf("unauthorized to fetch %s categories", catType)
			case 403:
				errChan <- fmt.Errorf("forbidden to fetch %s categories", catType)
			case 404:
				errChan <- fmt.Errorf("category type %s not found", catType)
			default:
				errChan <- fmt.Errorf("unexpected error fetching %s categories: status %d", catType, res.StatusCode())
			}
		}(category_type)
	}

	// Close channels after all goroutines complete
	go func() {
		wg.Wait()
		close(responses)
		close(errChan)
	}()

	// Collect all results
	var allCategories []Category
	var errors []error

	// Collect responses
	for cats := range responses {
		allCategories = append(allCategories, cats...)
	}

	// Collect errors
	for err := range errChan {
		errors = append(errors, err)
	}

	// If there were any errors, return the first one
	if len(errors) > 0 {
		return nil, errors[0]
	}

	return allCategories, nil
}

// GetBySpec fetches a category by spec
func (r *CategoryResource) GetBySpec(spec *Category) (*Category, error) {
	return nil, errors.New("GetBySpec() Not Implemented")
}

// Create creates a new category
func (r *CategoryResource) Create(template resource.IResourceTemplate[Category]) (*Category, error) {
	return nil, errors.New("Create() Not Implemented")
}

// Remove deletes a category by ID
func (r *CategoryResource) Remove(pk string) error {
	return errors.New("Remove() Not Implemented")
}

// RemoveBySpec deletes a category by spec
func (r *CategoryResource) RemoveBySpec(category *Category) error {
	return errors.New("RemoveBySpec() Not Implemented")
}

// Update updates an existing category
func (r *CategoryResource) Update(template resource.IResourceTemplate[Category]) (*Category, error) {
	return nil, errors.New("Update() Not Implemented")
}

// ParseAndApply parses template content and applies it (create or update based on metadata.pk)
func (r *CategoryResource) ParseAndApply(content string) (any, error) {
	// Parse content into IResourceTemplate[Category]
	template, err := resource.Parse[Category](content)
	if err != nil {
		return nil, fmt.Errorf("failed to parse template: %w", err)
	}

	// Check metadata for pk (primary key)
	pk, hasPk := template.Metadata["pk"]

	var result *Category

	if hasPk && pk != "" {
		// Update existing resource
		result, err = r.Update(*template)
		if err != nil {
			return nil, fmt.Errorf("failed to update category: %w", err)
		}
	} else {
		// Create new resource
		result, err = r.Create(*template)
		if err != nil {
			return nil, fmt.Errorf("failed to create category: %w", err)
		}
	}

	return result, nil
}

// GetTemplate returns the embedded template
func (r *CategoryResource) GetTemplate() []byte {
	return categoryTemplate
}

// ToTemplate fetches a category from the API and returns it as a template structure
func (r *CategoryResource) ToTemplate(id string, params map[string]string) (any, error) {
	// Fetch from API
	category, err := r.Get(id, params)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch category: %w", err)
	}

	// Handle 404 case - category not found (could be a typo)
	if category == nil {
		return nil, fmt.Errorf("category '%s' not found", id)
	}

	// Create clean spec with only editable fields
	spec := Category{
		Name: category.Name,
		Type: category.Type,
	}

	// Return template with clean spec
	template := resource.IResourceTemplate[Category]{
		Version:  "v1",
		Resource: "category",
		Metadata: map[string]string{},
		Spec:     spec,
	}

	return template, nil
}
