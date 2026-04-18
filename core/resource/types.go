package resource

// Generic IResourceTemplate - eliminates type casting by making Spec strongly typed
type IResourceTemplate[T any] struct {
	Version  string            `json:"version" yaml:"version"` // v1 | v2 | v3
	Resource string            `json:"resource" yaml:"resource"`
	Metadata map[string]string `json:"metadata" yaml:"metadata,flow"`
	Spec     T                 `json:"spec" yaml:"spec"`
}

// IResourceBase is the non-generic base interface for registry storage
// This allows different resource types to be stored in the same registry
type IResourceBase interface {
	GetTemplate() []byte
	// ToTemplate fetches a resource from the API and returns it as a template structure
	// with only editable fields (no API-only fields like IDs, account info, etc.)
	// Returns IResourceTemplate structure (not serialized) for use with Stringify
	ToTemplate(id string, params map[string]string) (any, error)
	// ParseAndApply parses template content and applies it (create or update based on metadata.pk)
	// Returns the created or updated resource as any (caller should type assert)
	ParseAndApply(content string) (any, error)
}

// IResource is a common generic interface that all resources implement
// Resource represents the concrete resource type (e.g., View, Category, etc.)
// Spec represents the spec type for templates (e.g., ViewSpec, CategorySpec, etc.)
// This provides type safety while maintaining interface flexibility
type IResource[Resource any, Spec any] interface {
	IResourceBase // Embed the base interface
	Get(string, map[string]string) (*Resource, error)
	List(map[string]string) ([]Resource, error)
	GetBySpec(*Resource) (*Resource, error)
	Create(IResourceTemplate[Spec]) (*Resource, error) // Now strongly typed!
	Remove(string) error
	RemoveBySpec(*Resource) error
	Update(IResourceTemplate[Spec]) (*Resource, error) // Now strongly typed!
}
