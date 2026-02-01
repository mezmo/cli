package log

import (
	"errors"
	"strings"
)

const (
	pretty formatEnum = "pretty"
	json   formatEnum = "json"

	head searchDirection = "head"
	tail searchDirection = "tail"
)

type formatEnum string

func (enum *formatEnum) String() string {
	return string(*enum)
}

func (enum *formatEnum) Set(value string) error {
	switch value {
	case "json", "pretty":
		*enum = formatEnum(value)
		return nil
	default:
		return errors.New(`must be one of "pretty", "json"`)
	}
}

func (enum *formatEnum) Type() string {
	return "format"
}

type searchDirection string

func (enum *searchDirection) String() string {
	return string(*enum)
}

func (enum *searchDirection) Set(value string) error {
	switch strings.ToLower(value) {
	case "head", "tail":
		*enum = searchDirection(strings.ToLower(value))
		return nil
	default:
		return errors.New(`must be one of "head", "tail"`)
	}
}

func (enum *searchDirection) Type() string {
	return "preference"
}
