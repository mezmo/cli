package parsers

import (
	"regexp"
	"strconv"
	"strings"

	"mzm/core/chrono"
)

// More restrictive time pattern - require at least one time indicator (colon, am/pm, or time word)
var timeExpressionPattern = regexp.MustCompile(`(?i)(?:(?:at|from)\s+)?(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?\s*(am|pm|o\W*clock|at\s*night|in\s*the\s*(?:morning|afternoon))?`)

// TimeExpressionParser parses time expressions like "3pm", "14:30", etc.
type TimeExpressionParser struct{}

// Pattern returns the regex pattern for time expressions
func (p *TimeExpressionParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return timeExpressionPattern
}

// Extract extracts time components from the match
func (p *TimeExpressionParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 2 {
		return nil
	}

	hour, err := strconv.Atoi(match[1])
	if err != nil || hour < 0 || hour > 24 {
		return nil
	}

	// Check if there's any time indicator (colon, am/pm, or time word)
	hasTimeIndicator := false
	for i := 2; i < len(match); i++ {
		if match[i] != "" {
			hasTimeIndicator = true
			break
		}
	}
	if !hasTimeIndicator && !strings.Contains(strings.ToLower(match[0]), ":") {
		return nil
	}

	component := chrono.NewParsingComponents(context.Reference, nil)

	// Parse minutes
	minute := 0
	if len(match) > 2 && match[2] != "" {
		minute, _ = strconv.Atoi(match[2])
	}

	// Parse seconds
	second := 0
	if len(match) > 3 && match[3] != "" {
		second, _ = strconv.Atoi(match[3])
	}

	// Handle AM/PM
	meridiem := ""
	if len(match) > 4 {
		meridiem = strings.ToLower(match[4])
	}

	// Check for contextual time indicators in the full match
	fullMatch := match[0]
	if strings.Contains(strings.ToLower(fullMatch), "night") {
		if hour >= 6 && hour < 12 {
			hour += 12
			component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemPM))
		} else if hour < 6 {
			component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemAM))
		}
	} else if strings.Contains(strings.ToLower(fullMatch), "afternoon") {
		component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemPM))
		if hour >= 0 && hour <= 6 {
			hour += 12
		}
	} else if strings.Contains(strings.ToLower(fullMatch), "morning") {
		component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemAM))
	} else if meridiem == "pm" {
		component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemPM))
		if hour < 12 {
			hour += 12
		}
	} else if meridiem == "am" {
		component.Assign(chrono.ComponentMeridiem, int(chrono.MeridiemAM))
		if hour == 12 {
			hour = 0
		}
	}

	component.Assign(chrono.ComponentHour, hour)
	component.Assign(chrono.ComponentMinute, minute)
	if second > 0 {
		component.Assign(chrono.ComponentSecond, second)
	}

	component.AddTag("parser/TimeExpressionParser")
	return component
}
