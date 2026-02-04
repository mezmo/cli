package view

type View struct {
	Account     string                   `json:"account" yaml:"account,flow"`
	Name        string                   `json:"name" yaml:"name"`
	Viewid      string                   `json:"viewid" yaml:"viewid"`
	Description string                   `json:"description,omitempty" yaml:"description,omitempty"`
	Query       string                   `json:"query" yaml:"query"`
	Category    []string                 `json:"category" yaml:"category,omitempty,flow"`
	Hosts       []string                 `json:"hosts,omitempty" yaml:"hosts,omitempty,flow"`
	Apps        []string                 `json:"apps,omitempty" yaml:"apps,omitempty,flow"`
	Tags        []string                 `json:"tags,omitempty" yaml:"tags,omitempty,flow"`
	Levels      []string                 `json:"levels,omitempty" yaml:"levels,omitempty,flow"`
	Presetids   []string                 `json:"presetids,omitempty" yaml:"presetids,omitempty,flow"`
	Presetid    []string                 `json:"presetid,omitempty" yaml:"presetid,omitempty,flow"`
	Channels    []map[string]interface{} `json:"channels,omitempty" yaml:"channels,omitempty,flow"`
	Orgs        []interface{}            `json:"orgs,omitempty" yaml:"orgs,omitempty,flow"`
}

func (view *View) PK() string {
	return view.Viewid
}
