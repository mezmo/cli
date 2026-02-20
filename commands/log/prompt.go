package log

import (
	"fmt"
	"github.com/phoenix-tui/phoenix/terminal"
	resource "mzm/core/resource"
	"mzm/core/resource/v1/view"
	"mzm/core/tui/components/nestedlist"
)

func promptView() (*view.View, error) {
	resourceInterface, err := resource.Registry.GetResource("v1", "view")
	if err != nil {
		return nil, fmt.Errorf("failed to get view resource: %w", err)
	}

	api, ok := resourceInterface.(resource.IResource[view.View, view.View])
	if !ok {
		return nil, fmt.Errorf("unexpected resource type: %T", resourceInterface)
	}

	views, err := api.List(nil)

	if err != nil {
		return nil, err
	}
	// TODO(esatterwhite): Maybe this can be generic?
	// This seems to be the way to deal with a slice of interfaces
	// by looping and manually assinging
	resources := make([]nestedlist.CategorizedResource, len(views))
	for i, v := range views {
		resources[i] = v
	}
	options := nestedlist.DefaultOptions()
	options.GroupIcon = "\u00BB"
	options.GroupOpenIcon = "\u00AB"
	options.AllowCancel = true
	options.SortFn = func(current, next nestedlist.CategoryItem) int {
		if current.Name == "Uncategorized" {
			return -1
		}
		if next.Name == "Uncategorized" {
			return 1
		}

		if current.Name > next.Name {
			return 1
		}
		if current.Name < next.Name {
			return -1
		}

		return 0
	}

	selector, err := nestedlist.NewWithOptions(resources, options)
	if err != nil {
		return nil, err
	}

	term := terminal.New()
	term.HideCursor()
	selected, err := selector.Run()
	term.ShowCursor()
	if err != nil {
		return nil, err
	}

	if selected == nil {
		return nil, nil
	}

	// Type assert to view.View and return pointer to it
	if view, ok := selected.(view.View); !ok {
		return nil, fmt.Errorf("Expected view.View, got %T", selected)
	} else {
		return &view, nil
	}
}
