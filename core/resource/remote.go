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

	fmt.Println(file.Name())
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
		fmt.Println(content)
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
