package log

import (
	"fmt"
	"mzm/core/logging"
	resource "mzm/core/resource"
	"mzm/core/resource/v1/view"
	"mzm/core/tui/components/nestedlist"
	"strings"

	edlib "github.com/hbollon/go-edlib"
	"github.com/phoenix-tui/phoenix/terminal"
)

func promptView(seed []view.View) (*view.View, error) {
	var views []view.View
	resourceInterface, err := resource.Registry.GetResource("v1", "view")
	if err != nil {
		return nil, fmt.Errorf("failed to get view resource: %w", err)
	}

	api, ok := resourceInterface.(resource.IResource[view.View, view.View])
	if !ok {
		return nil, fmt.Errorf("unexpected resource type: %T", resourceInterface)
	}

	if len(seed) == 0 {
		views, err = api.List(nil)
		if err != nil {
			return nil, err
		}
	} else {
		views = seed
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

func findView(match string) (*view.View, error) {
	log := logging.Default.Child("views")
	log.Info("Looking for views matching %s", match)

	var potentialMatches []view.View
	toMatch := strings.ToLower(match)
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

	for _, view := range views {

		// if its an id match, return it
		if view.PK() == match {
			log.Info("view id match: %s (%s)", view.Name, view.PK())
			return &view, nil
		}

		var name string = strings.ToLower(view.Name)

		// if there is an exact name match, return it
		if name == toMatch {
			log.Info("view name match: %s (%s)", view.Name, view.PK())
			return &view, nil
		}

		// compile a list of similarly named views an prompt for a selection
		value, err := edlib.StringsSimilarity(toMatch, name, edlib.Levenshtein)
		if err != nil {
			continue
		}

		log.Debug("%d %s", value, view.Name)
		// Only keep items that are close enough
		if value >= 0.8 {
			potentialMatches = append(potentialMatches, view)
		} else if value <= 0.4 && strings.Contains(name, toMatch) {
			potentialMatches = append(potentialMatches, view)
		}

	}

	log.Debug("found %d potential views. Prompting for selection", len(potentialMatches))
	view, err := promptView(potentialMatches)

	if view != nil {
		log.Debug("Found a matching view: %s", view.Name)
	}
	return view, err

}
