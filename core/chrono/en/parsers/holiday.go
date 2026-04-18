package parsers

import (
	"mzm/core/chrono"
	"regexp"
)

var xmasPattern = regexp.MustCompile(`(?i)\bchristmas|xmas\b`)

type HolidayParser struct{}

func (pattern *HolidayParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return xmasPattern
}

func (pattern *HolidayParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	component := chrono.NewParsingComponents(context.Reference, nil)

	component.Assign(chrono.ComponentDay, 25)
	component.Assign(chrono.ComponentMonth, 12)
	component.AddTag("parser/HolidayParser")
	return component
}
