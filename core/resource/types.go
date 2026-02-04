package resource

type IResourceTemplate struct {
	version  string // v1 | v2 | v3
	resource string
	metadata map[string]string
	spec     map[string]any
}

type IResourceSpec interface {
	toJSON() any
	toUpdate() any
	toTemplate() IResourceTemplate
}
