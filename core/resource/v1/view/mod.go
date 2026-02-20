package view

import (
	_ "embed"
	"errors"
	"fmt"
	"mzm/core/resource"
	"strings"

	resty "resty.dev/v3"
)

//go:embed template.yaml
var viewTemplate []byte

// ViewResource implements IResource[View] for type-safe view operations
type ViewResource struct {
	client *resty.Client
}

// Ensure ViewResource implements IResource[View, View] with new generic interface
var _ resource.IResource[View, View] = (*ViewResource)(nil)

// NewViewResource creates a new ViewResource instance
func NewViewResource() *ViewResource {
	return &ViewResource{
		client: resource.Client(),
	}
}

// ViewResource methods implementing IResource[View]

func (r *ViewResource) Get(pk string, params map[string]string) (*View, error) {
	response := View{}
	res, err := r.client.
		R().
		SetResult(response).
		SetPathParam("pk", pk).
		Get("/v1/config/view/{pk}")

	if err != nil {
		return nil, err
	}

	switch res.StatusCode() {
	case 200:
		return res.Result().(*View), nil
	case 401:
		fmt.Println("Unauthorized")
	case 403:
		fmt.Println("Forbidden")
	case 404:
		break
	default:
		return nil, errors.New("unexpected error")
	}

	views, err := r.List(params)

	if err != nil {
		return nil, err
	}

	for _, instance := range views {
		if instance.PK() == pk {
			return &instance, nil
		}

		if strings.EqualFold(string(instance.Name), pk) {
			return &instance, nil
		}
	}
	return nil, nil
}

func (r *ViewResource) List(params map[string]string) ([]View, error) {
	var response []View

	res, err := r.client.
		R().
		SetResult(response).
		Get("/v1/config/view")

	if err != nil {
		return nil, err
	}

	result := res.Result().(*[]View)
	if result == nil {
		return []View{}, nil
	}
	return *result, nil
}

func (r *ViewResource) GetBySpec(spec *View) (*View, error) {
	return nil, errors.New("GetBySpec() Not Implemented")
}

func (r *ViewResource) Create(template resource.IResourceTemplate[View]) (*View, error) {
	// Create view from strongly typed template - NO TYPE CASTING!
	view, err := ViewFromTemplate(&template)
	if err != nil {
		return nil, fmt.Errorf("failed to create view from template: %w", err)
	}

	fmt.Println(template)
	apiView := view.ToCreate()

	// Use the original view object for the API response - Resty will populate it directly
	res, err := r.client.
		R().
		SetResult(view).
		SetBody(apiView).
		Post("/v1/config/view")

	if err != nil {
		return nil, err
	}

	switch res.StatusCode() {
	case 200, 201:
		// The view object is already populated by Resty's SetResult
		return view, nil
	case 400:
		fmt.Printf("Bad request - API response:\n%s\n", res.String())
		return nil, errors.New("bad request: check your view specification")
	case 401:
		return nil, errors.New("unauthorized: check your access key")
	case 403:
		return nil, errors.New("forbidden: insufficient permissions to create views")
	default:
		return nil, fmt.Errorf("unexpected error: status %d", res.StatusCode())
	}
}

func (r *ViewResource) Remove(pk string) error {
	res, err := r.client.
		R().
		SetPathParam("pk", pk).
		Delete("/v1/config/view/{pk}")

	if err != nil {
		return err
	}

	switch res.StatusCode() {
	case 200, 201, 204:
		return nil
	case 404:
		// If initial delete returns 404, try to find view by name and delete it
		return r.removeByName(pk)
	case 400:
		fmt.Printf("Bad request - API response:\n%s\n", res.String())
		return errors.New("bad request: check your view specification")
	case 401:
		return errors.New(
			"There was a problem authenticating the previous operation. Make sure your access key is still valid",
		)
	case 403:
		return errors.New(
			"Make sure you have the appropriate permissions to read views in the appropriate account",
		)
	default:
		return fmt.Errorf("unexpected error: status %d", res.StatusCode())
	}
}

func (r *ViewResource) RemoveBySpec(view *View) error {
	return errors.New("RemoveBySpec() Not Implemented")
}

// removeByName attempts to find a view by name (case-insensitive) and delete it by ID
func (r *ViewResource) removeByName(name string) error {
	// Get all views
	views, err := r.List(nil)
	if err != nil {
		return fmt.Errorf("failed to list views while searching by name: %w", err)
	}

	// Search for a view with matching name (case-insensitive)
	for _, view := range views {
		if strings.EqualFold(view.Name, name) {
			// Found a match, delete using the view's ID
			res, err := r.client.
				R().
				SetPathParam("pk", view.Viewid).
				Delete("/v1/config/view/{pk}")

			if err != nil {
				return fmt.Errorf("failed to delete view by ID %s: %w", view.Viewid, err)
			}

			switch res.StatusCode() {
			case 200, 201, 204:
				return nil
			case 404:
				return fmt.Errorf("view with name '%s' (ID: %s) not found", name, view.Viewid)
			case 400:
				fmt.Printf("Bad request - API response:\n%s\n", res.String())
				return errors.New("bad request: check your view specification")
			case 401:
				return errors.New(
					"There was a problem authenticating the previous operation. Make sure your access key is still valid",
				)
			case 403:
				return errors.New(
					"Make sure you have the appropriate permissions to delete views in the appropriate account",
				)
			default:
				return fmt.Errorf("unexpected error: status %d", res.StatusCode())
			}
		}
	}

	// No view found with the given name
	return fmt.Errorf("view with name '%s' not found", name)
}

func (r *ViewResource) Update(template resource.IResourceTemplate[View]) (*View, error) {
	return nil, errors.New("Update() Not Implemented")
}

func (r *ViewResource) GetTemplate() []byte {
	return viewTemplate
}

// Register this resource with the main resource package
func init() {
	resource.Register("v1", "view", NewViewResource())
}
