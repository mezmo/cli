package core

import (
	"math"
	"strconv"
)

// Typecast converts a command line string into a typed value. It is a port of
// typecast in @mzm/core/lang/string.ts: "true"/"false" become bool,
// "null"/"undefined" become nil, finite numbers become float64, anything else
// stays a string.
func Typecast(value string) any {
	switch value {
	case "null", "undefined":
		return nil
	case "true":
		return true
	case "false":
		return false
	case "":
		return value
	}
	if f, err := strconv.ParseFloat(value, 64); err == nil && !math.IsInf(f, 0) && !math.IsNaN(f) {
		return f
	}
	return value
}
