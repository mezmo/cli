// Package components provides reusable TUI components built with the Phoenix framework.
//
// This package includes:
// - NestedList: A two-level navigation component for hierarchical data (now in nestedlist subpackage)
//
// Example usage:
//
//	import "mzm/core/tui/components/nestedlist"
//	import "mzm/core/resource/v1/view"
//
//	views := []*view.View{...}
//	// Convert views to CategorizedResource interface (view.View implements it directly)
//	resources := make([]nestedlist.CategorizedResource, len(views))
//	for i, v := range views {
//		resources[i] = v
//	}
//	selectedResource, err := nestedlist.New(resources)
//	// Cast back to concrete type
//	selectedView := selectedResource.(*view.View)
//
package components
