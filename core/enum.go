package core

import (
	"errors"
	"strings"
)

const (
	jsonOutput  OutputFormatEnum = "json"
	yamlOutput  OutputFormatEnum = "yaml"
	tableOutput OutputFormatEnum = "table"
	jsonInput   InputFormatEnum  = "json"
	yamlInput   InputFormatEnum  = "yaml"
)

type OutputFormatEnum string

func (enum *OutputFormatEnum) String() string {
	return string(*enum)
}

func (enum *OutputFormatEnum) Type() string {
	return "output"
}

func (enum *OutputFormatEnum) Set(value string) error {
	lower := strings.ToLower(value)
	switch lower {
	case "json", "yaml", "table":
		*enum = OutputFormatEnum(lower)
		return nil
	default:
		return errors.New(`must be one of "json", "yaml", "table"`)
	}
}

type InputFormatEnum string

func (enum *InputFormatEnum) String() string {
	return string(*enum)
}

func (enum *InputFormatEnum) Type() string {
	return "output"
}

func (enum *InputFormatEnum) Set(value string) error {
	lower := strings.ToLower(value)
	switch lower {
	case "json", "yaml":
		*enum = InputFormatEnum(lower)
		return nil
	default:
		return errors.New(`must be one of "json", "yaml"`)
	}
}
