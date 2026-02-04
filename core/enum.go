package core

import (
	"errors"
	"strings"
)

const (
	json  OutputFormatEnum = "json"
	yaml  OutputFormatEnum = "yaml"
	table OutputFormatEnum = "table"
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
