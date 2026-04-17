package view

import (
	"fmt"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	JSON "encoding/json"
	"mzm/core/resource"

	yamlDecoder "github.com/elioetibr/golang-yaml/pkg/decoder"
	yamlEncoder "github.com/elioetibr/golang-yaml/pkg/encoder"
)

// Validator interface for template validation
type Validator interface {
	Validate() error
}

type View struct {
	// API-only fields (not shown in templates)
	Account     string `json:"account,omitempty" yaml:"account,omitempty,flow" template:"-"`
	Viewid      string `json:"viewid,omitempty" yaml:"viewid,omitempty,flow" template:"-"`
	Description string `json:"description,omitempty" yaml:"description,omitempty,flow" template:"-"`
	Orgs        []any  `json:"orgs,omitempty" yaml:"orgs,omitempty,flow" template:"-"`

	// Template/User-editable fields
	Name     string   `json:"name" yaml:"name" validate:"required"`
	Query    string   `json:"query,omitempty" yaml:"query,omitempty"`
	Category []string `json:"category" yaml:"category,flow"`
	Hosts    []string `json:"hosts,omitempty" yaml:"hosts,omitempty,flow"`
	Apps     []string `json:"apps,omitempty" yaml:"apps,omitempty,flow"`
	Tags     []string `json:"tags,omitempty" yaml:"tags,omitempty,flow"`
	Levels   []string `json:"levels,omitempty" yaml:"levels,omitempty,flow"`

	// Preset handling - API uses both formats
	Presetids []string `json:"presetids,omitempty" yaml:"-" template:"-"`
	Presetid  []string `json:"presetid,omitempty" yaml:"-" template:"-"`
	PresetID  string   `json:"-" yaml:"presetid,omitempty"` // Template format (single string)

	Channels []map[string]interface{} `json:"channels,omitempty" yaml:"channels,omitempty,flow"`
}

func (view *View) PK() string {
	return view.Viewid
}

// GetName implements the CategorizedResource interface
func (view View) GetName() string {
	return view.Name
}

func (view View) GetCategory() string {
	if len(view.Category) == 0 {
		return "Uncategorized"
	}

	result := cases.Title(language.English)
	return result.String(view.Category[0])
}

// Validate ensures the View has required fields and valid combinations for template usage
func (v View) Validate() error {
	if v.Name == "" {
		return fmt.Errorf("name is required")
	}

	// At least one filter criteria must be specified
	if v.Query == "" && len(v.Hosts) == 0 && len(v.Apps) == 0 &&
		len(v.Levels) == 0 && len(v.Tags) == 0 {
		return fmt.Errorf("at least one of query, hosts, apps, levels, or tags must be specified")
	}

	return nil
}

// ToYAML converts the View to YAML bytes (template format - user-editable fields only)
func (v *View) ToYAML() ([]byte, error) {
	// Create a copy with only template-relevant fields
	templateView := struct {
		Name     string                   `yaml:"name"`
		Query    string                   `yaml:"query,omitempty"`
		Category []string                 `yaml:"category"`
		Hosts    []string                 `yaml:"hosts,omitempty"`
		Apps     []string                 `yaml:"apps,omitempty"`
		Tags     []string                 `yaml:"tags,omitempty"`
		Levels   []string                 `yaml:"levels,omitempty"`
		PresetID string                   `yaml:"presetid,omitempty"`
		Channels []map[string]interface{} `yaml:"channels,omitempty"`
	}{
		Name:     v.Name,
		Query:    v.Query,
		Category: v.Category,
		Hosts:    v.Hosts,
		Apps:     v.Apps,
		Tags:     v.Tags,
		Levels:   v.Levels,
		PresetID: v.PresetID,
		Channels: v.Channels,
	}

	// If PresetID is empty but we have presetid/presetids from API, use the first one
	if templateView.PresetID == "" {
		if len(v.Presetid) > 0 {
			templateView.PresetID = v.Presetid[0]
		} else if len(v.Presetids) > 0 {
			templateView.PresetID = v.Presetids[0]
		}
	}

	return yamlEncoder.Marshal(templateView)
}

// ToTemplateYAML converts the View to the full template format
func (v *View) ToTemplateYAML() ([]byte, error) {
	// Get the spec YAML first
	specBytes, err := v.ToYAML()
	if err != nil {
		return nil, err
	}

	// Parse it back to get the spec structure for embedding
	var spec interface{}
	err = yamlDecoder.Unmarshal(specBytes, &spec)
	if err != nil {
		return nil, err
	}

	template := struct {
		Version  string            `yaml:"version"`
		Resource string            `yaml:"resource"`
		Metadata map[string]string `yaml:"metadata"`
		Spec     interface{}       `yaml:"spec"`
	}{
		Version:  "v1",
		Resource: "view",
		Metadata: map[string]string{},
		Spec:     spec,
	}
	return yamlEncoder.Marshal(template)
}

// ToJSON converts the View to JSON bytes (API format - all fields)
func (v *View) ToJSON() ([]byte, error) {
	return JSON.Marshal(v)
}

// ToCreate returns the View in the format needed for API creation calls
func (v *View) ToCreate() *View {
	return v.ToUpdate()
}

// ToUpdate returns the View in the format needed for API update calls
func (v *View) ToUpdate() *View {
	apiView := &View{
		Name:     v.Name,
		Query:    v.Query,
		Category: v.Category,
		Hosts:    v.Hosts,
		Apps:     v.Apps,
		Tags:     v.Tags,
		Levels:   v.Levels,
		Channels: v.Channels,
	}

	// Ensure Category is never nil for API calls - API requires empty array, not null
	if apiView.Category == nil {
		apiView.Category = []string{}
	}

	// Convert PresetID to the API format
	if v.PresetID != "" {
		apiView.Presetid = []string{v.PresetID}
		apiView.Presetids = []string{v.PresetID}
	}

	return apiView
}

// ViewFromTemplate creates a View from a strongly typed resource template - NO TYPE CASTING!
func ViewFromTemplate(template *resource.IResourceTemplate[View]) (*View, error) {
	// Direct field access - no casting needed!
	// The template.Spec is already a View, so we create a copy for API usage
	view := &View{
		Name:     template.Spec.Name,
		Query:    template.Spec.Query,
		Category: template.Spec.Category,
		Hosts:    template.Spec.Hosts,
		Apps:     template.Spec.Apps,
		Tags:     template.Spec.Tags,
		Levels:   template.Spec.Levels,
		PresetID: template.Spec.PresetID,
		Channels: template.Spec.Channels,
	}

	// Ensure Category is never nil - API requires empty array, not null
	if view.Category == nil {
		view.Category = []string{}
	}

	return view, view.Validate()
}

// Convenience function for parsing and creating View from template content
func CreateViewFromTemplate(content string) (*View, error) {
	template, err := resource.ParseAndValidate[View](content)
	if err != nil {
		return nil, err
	}

	return ViewFromTemplate(template)
}
