package resource

import (
	"errors"
	"sort"
	"strings"
)

// ResourceRegistry is a map-based registry that holds registered resources
// Keys are in the format "version:resourceType" (e.g., "v1:view", "v2:alert")
// Uses IResourceBase to ensure type safety while allowing different resource types
type ResourceRegistry map[string]IResourceBase

// Register adds a resource to the registry
func (r ResourceRegistry) Register(version, resourceType string, resource IResourceBase) {
	key := version + ":" + resourceType
	r[key] = resource
}

// GetResource returns a resource by version and type
// The caller must type assert to the specific IResource[T] they need
func (r ResourceRegistry) GetResource(version, resourceType string) (interface{}, error) {
	key := version + ":" + resourceType
	if resource, ok := r[key]; ok {
		return resource, nil
	}
	return nil, errors.New("resource not found: " + key)
}

// ListVersions returns all available API versions
func (r ResourceRegistry) ListVersions() []string {
	versionSet := make(map[string]bool)
	for key := range r {
		parts := strings.Split(key, ":")
		if len(parts) == 2 {
			versionSet[parts[0]] = true
		}
	}

	var versions []string
	for version := range versionSet {
		versions = append(versions, version)
	}
	sort.Strings(versions)
	return versions
}

// ListResourceTypes returns all resource types available in a specific version
func (r ResourceRegistry) ListResourceTypes(version string) []string {
	var resourceTypes []string
	prefix := version + ":"
	for key := range r {
		if strings.HasPrefix(key, prefix) {
			resourceType := strings.TrimPrefix(key, prefix)
			resourceTypes = append(resourceTypes, resourceType)
		}
	}
	sort.Strings(resourceTypes)
	return resourceTypes
}

// ListAllResourceTypes returns all resource types across all versions
func (r ResourceRegistry) ListAllResourceTypes() []string {
	resourceTypeSet := make(map[string]bool)
	for key := range r {
		parts := strings.Split(key, ":")
		if len(parts) == 2 {
			resourceTypeSet[parts[1]] = true
		}
	}

	var resourceTypes []string
	for resourceType := range resourceTypeSet {
		resourceTypes = append(resourceTypes, resourceType)
	}
	sort.Strings(resourceTypes)
	return resourceTypes
}

// HasResource checks if a specific resource exists
func (r ResourceRegistry) HasResource(version, resourceType string) bool {
	key := version + ":" + resourceType
	_, exists := r[key]
	return exists
}

// GetLatestVersion returns the latest version that supports the given resource type
func (r ResourceRegistry) GetLatestVersion(resourceType string) (string, error) {
	var versions []string
	for key := range r {
		parts := strings.Split(key, ":")
		if len(parts) == 2 && parts[1] == resourceType {
			versions = append(versions, parts[0])
		}
	}

	if len(versions) == 0 {
		return "", errors.New("resource type not found: " + resourceType)
	}

	sort.Strings(versions)
	return versions[len(versions)-1], nil
}

// Global registry instance
var Registry = make(ResourceRegistry)

// Register is a convenience function to register resources in the global registry
func Register(version, resourceType string, resource IResourceBase) {
	Registry.Register(version, resourceType, resource)
}
