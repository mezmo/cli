package resource

import (
	JSON "encoding/json"
	"fmt"
	"log"
	"mzm/core"
	"mzm/core/logging"
	"os"
	"os/exec"
	"runtime"
	"strings"

	yamlDecoder "github.com/elioetibr/golang-yaml/pkg/decoder"
	yamlEncoder "github.com/elioetibr/golang-yaml/pkg/encoder"
)

func FromString(content []byte, format core.InputFormatEnum, file_name string) (string, error) {
	logger := logging.Default.Child("mzm/core/remote")
	var transformed []byte = []byte(content)

	if file_name == "" {
		file_name = "from-string"
	}

	if format == core.FORMAT.CRUD.JSON {
		// Parse and re-format JSON for validation and pretty-printing
		var jsonData map[string]any
		err := JSON.Unmarshal(content, &jsonData)
		if err != nil {
			return "", fmt.Errorf("invalid JSON format: %w", err)
		}

		transformed, err = JSON.MarshalIndent(jsonData, "", " ")
		if err != nil {
			return "", err
		}
	}

	dirName, err := os.MkdirTemp("", "mzm-staging")
	if err != nil {
		log.Fatal(err)
	}

	logger.Debug("Temp dir created %s", dirName)
	file_path := strings.Join([]string{file_name, "*", format.String()}, ".")
	file, err := os.CreateTemp(
		dirName,
		file_path,
	)

	if err != nil {
		log.Fatal(err)
	}

	defer os.Remove(file.Name())

	logger.Debug("Temp file created %s", file.Name())
	file.Write(transformed)
	file.Close()

	cmd := exec.Command(getEditorCommand(), file.Name())
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err = cmd.Run()

	if err != nil {
		log.Fatal(err)
	}
	output, err := os.ReadFile(file.Name())
	return string(output), err
}

func getEditorCommand() string {
	var defaultEditor string = "vi"
	if runtime.GOOS == "windows" {
		defaultEditor = "notepad.exe"
	}

	editor := os.Getenv("EDITOR")

	if editor == "" {
		return defaultEditor
	}

	return editor
}

// Convert a struct to a json string
func Stringify(content any, format core.InputFormatEnum) ([]byte, error) {
	switch format {
	case core.FORMAT.CRUD.JSON:
		return JSON.MarshalIndent(content, "", " ")
	case core.FORMAT.CRUD.YAML:
		return yamlEncoder.Marshal(content)
	default:
		return []byte{}, fmt.Errorf("unknown stringify format %s", string(format))
	}
}

// Generic Parse function - eliminates type casting by parsing directly to strongly typed spec
func Parse[T any](str string) (*IResourceTemplate[T], error) {
	var definition IResourceTemplate[T]
	var err error

	// Try parsing as YAML first
	err = yamlDecoder.Unmarshal([]byte(str), &definition)
	if err == nil {
		return &definition, nil
	}

	// If YAML parsing fails, try JSON
	err = JSON.Unmarshal([]byte(str), &definition)
	if err != nil {
		return nil, err
	}

	return &definition, nil
}

// ParseAndValidate parses and validates a template with a spec that implements Validator
func ParseAndValidate[T interface{ Validate() error }](str string) (*IResourceTemplate[T], error) {
	template, err := Parse[T](str)
	if err != nil {
		return nil, err
	}

	// Validate the spec if it implements Validator
	if err := template.Spec.Validate(); err != nil {
		return nil, fmt.Errorf("template validation failed: %w", err)
	}

	return template, nil
}

func Load(version string, resource_type string, resource_id string, params map[string]string) (string, error) {
	logger := logging.Default.Child("mzm/core/remote/load")

	// 1. Get resource interface using only strings - no type knowledge needed
	resource, err := Registry.GetResource(version, resource_type)
	if err != nil {
		return "", fmt.Errorf("resource not found: %s:%s - %w", version, resource_type, err)
	}

	// 2. Fetch from API and reshape to clean template structure
	templateStruct, err := resource.ToTemplate(resource_id, params)
	if err != nil {
		return "", fmt.Errorf("failed to fetch resource: %w", err)
	}

	// 3. Use existing Stringify to serialize to YAML
	templateBytes, err := Stringify(templateStruct, core.FORMAT.CRUD.YAML)
	if err != nil {
		return "", fmt.Errorf("failed to serialize template: %w", err)
	}

	// 4. Create temp directory
	dirName, err := os.MkdirTemp("", "mzm-edit")
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}
	logger.Debug("Temp dir created %s", dirName)

	// 5. Create temp file
	fileName := fmt.Sprintf("%s.*.yaml", resource_type)
	file, err := os.CreateTemp(dirName, fileName)
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(file.Name())
	logger.Debug("Temp file created %s", file.Name())

	// 6. Write template to file
	_, err = file.Write(templateBytes)
	if err != nil {
		file.Close()
		return "", fmt.Errorf("failed to write template to file: %w", err)
	}
	file.Close()

	// 7. Open in editor
	cmd := exec.Command(getEditorCommand(), file.Name())
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err = cmd.Run()
	if err != nil {
		return "", fmt.Errorf("editor error: %w", err)
	}

	// 8. Read edited content back
	output, err := os.ReadFile(file.Name())
	if err != nil {
		return "", fmt.Errorf("failed to read edited file: %w", err)
	}

	return string(output), nil
}

// ApplyTemplate parses template content and applies it (create or update based on metadata.pk)
// Returns the created or updated resource with type safety
func ApplyTemplate[T any](content string) (*T, error) {
	// 1. Parse content to extract version and resource type
	// Use a minimal struct to get just the metadata we need
	var rawTemplate struct {
		Version  string `json:"version" yaml:"version"`
		Resource string `json:"resource" yaml:"resource"`
	}

	// Try YAML first, then JSON
	err := yamlDecoder.Unmarshal([]byte(content), &rawTemplate)
	if err != nil {
		err = JSON.Unmarshal([]byte(content), &rawTemplate)
		if err != nil {
			return nil, fmt.Errorf("failed to parse template: %w", err)
		}
	}

	// 2. Validate version and resource type exist
	if !Registry.HasResource(rawTemplate.Version, rawTemplate.Resource) {
		versions := Registry.ListVersions()
		return nil, fmt.Errorf(
			"unsupported api version '%s' (supported versions: %v)",
			rawTemplate.Version, versions,
		)
	}

	// 3. Get resource interface
	resourceInterface, err := Registry.GetResource(rawTemplate.Version, rawTemplate.Resource)
	if err != nil {
		types := Registry.ListResourceTypes(rawTemplate.Version)
		return nil, fmt.Errorf(
			"unsupported resource type '%s' for version %s (supported types: %v)",
			rawTemplate.Resource, rawTemplate.Version, types,
		)
	}

	// 4. Let the resource parse and apply the template
	// This handles the type-specific parsing and create/update logic
	result, err := resourceInterface.ParseAndApply(content)
	if err != nil {
		return nil, fmt.Errorf("failed to apply template: %w", err)
	}

	// 5. Type assert to expected type T
	typedResult, ok := result.(*T)
	if !ok {
		return nil, fmt.Errorf(
			"unexpected result type: got %T, expected %T",
			result, new(T),
		)
	}

	return typedResult, nil
}
