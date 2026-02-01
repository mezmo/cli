package parsers

import (
	"regexp"
	"strings"

	"mzm/core/chrono"
	"mzm/core/chrono/common"
)

var casualDatePattern = regexp.MustCompile(`(?i)(now|today|tonight|tomorrow|overmorrow|tmr|tmrw|yesterday|last\s*night|this\s*morning|this\s*afternoon|this\s*evening)`)

// CasualDateParser parses casual date references like "today", "tomorrow", etc.
type CasualDateParser struct{}

// Pattern returns the regex pattern for casual dates
func (p *CasualDateParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return casualDatePattern
}

// Extract extracts date components from the match
func (p *CasualDateParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 2 {
		return nil
	}

	lowerText := strings.ToLower(strings.TrimSpace(match[1]))
	var component *chrono.ParsingComponents

	switch {
	case lowerText == "now":
		component = common.Now(context.Reference)
	case lowerText == "today":
		component = common.Today(context.Reference)
	case lowerText == "yesterday":
		component = common.Yesterday(context.Reference)
	case lowerText == "tomorrow" || lowerText == "tmr" || lowerText == "tmrw":
		component = common.Tomorrow(context.Reference)
	case lowerText == "tonight":
		component = common.Tonight(context.Reference, 22)
	case lowerText == "overmorrow":
		component = common.TheDayAfter(context.Reference, 2)
	case strings.Contains(lowerText, "last") && strings.Contains(lowerText, "night"):
		targetDate := context.RefDate
		if targetDate.Hour() > 6 {
			targetDate = targetDate.AddDate(0, 0, -1)
		}
		component = chrono.NewParsingComponents(context.Reference, nil)
		common.AssignSimilarDate(component, targetDate)
		component.Imply(chrono.ComponentHour, 0)
	case strings.Contains(lowerText, "this") && strings.Contains(lowerText, "morning"):
		component = common.Morning(context.Reference, 6)
	case strings.Contains(lowerText, "this") && strings.Contains(lowerText, "afternoon"):
		component = common.Afternoon(context.Reference, 15)
	case strings.Contains(lowerText, "this") && strings.Contains(lowerText, "evening"):
		targetDate := context.Reference.GetDateWithAdjustedTimezone()
		component = chrono.NewParsingComponents(context.Reference, nil)
		common.AssignSimilarDate(component, targetDate)
		component.Imply(chrono.ComponentHour, 20)
	}

	if component != nil {
		component.AddTag("parser/CasualDateParser")
		return component
	}

	return nil
}
