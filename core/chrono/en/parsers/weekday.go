package parsers

import (
	"regexp"
	"strings"

	"mzm/core/chrono"
	"mzm/core/chrono/common"
)

// Removed lookahead
var weekdayPattern = regexp.MustCompile(`(?i)(?:(?:,|\(|（)\s*)?(?:on\s*?)?(?:(this|last|past|next)\s*)?(monday|mon\.?|tuesday|tue\.?|wednesday|wed\.?|thursday|thurs?\.?|thu\.?|friday|fri\.?|saturday|sat\.?|sunday|sun\.?)(?:\s*(?:,|\)|）))?(?:\s*(this|last|past|next)\s*week)?`)

var weekdayDictionary = map[string]int{
	"sunday": 0, "sun": 0, "sun.": 0,
	"monday": 1, "mon": 1, "mon.": 1,
	"tuesday": 2, "tue": 2, "tue.": 2,
	"wednesday": 3, "wed": 3, "wed.": 3,
	"thursday": 4, "thurs": 4, "thurs.": 4, "thur": 4, "thur.": 4, "thu": 4, "thu.": 4,
	"friday": 5, "fri": 5, "fri.": 5,
	"saturday": 6, "sat": 6, "sat.": 6,
}

// WeekdayParser parses weekday references
type WeekdayParser struct{}

// Pattern returns the regex pattern for weekdays
func (p *WeekdayParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return weekdayPattern
}

// Extract extracts weekday components from the match
func (p *WeekdayParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 3 {
		return nil
	}

	prefix := ""
	if len(match) > 1 {
		prefix = match[1]
	}
	weekdayWord := strings.ToLower(strings.TrimSpace(match[2]))
	postfix := ""
	if len(match) > 3 {
		postfix = match[3]
	}

	modifierWord := prefix
	if modifierWord == "" {
		modifierWord = postfix
	}
	modifierWord = strings.ToLower(modifierWord)

	var modifier string
	switch modifierWord {
	case "last", "past":
		modifier = "last"
	case "next":
		modifier = "next"
	case "this":
		modifier = "this"
	}

	weekday, ok := weekdayDictionary[weekdayWord]
	if !ok {
		return nil
	}

	component := CreateParsingComponentsAtWeekday(context.Reference, weekday, modifier)
	component.AddTag("parser/WeekdayParser")
	return component
}

// CreateParsingComponentsAtWeekday creates components for a specific weekday
func CreateParsingComponentsAtWeekday(reference *chrono.ReferenceWithTimezone, weekday int, modifier string) *chrono.ParsingComponents {
	refDate := reference.GetDateWithAdjustedTimezone()
	refWeekday := int(refDate.Weekday())

	component := chrono.NewParsingComponents(reference, nil)

	// Calculate days difference
	var daysDiff int
	if modifier == "last" || modifier == "past" {
		daysDiff = weekday - refWeekday
		if daysDiff >= 0 {
			daysDiff -= 7
		}
	} else if modifier == "next" {
		daysDiff = weekday - refWeekday
		if daysDiff <= 0 {
			daysDiff += 7
		}
	} else if modifier == "this" {
		daysDiff = weekday - refWeekday
	} else {
		// Default behavior: if weekday is today or in future this week, use it; otherwise next week
		daysDiff = weekday - refWeekday
		if daysDiff < 0 {
			daysDiff += 7
		}
	}

	targetDate := refDate.AddDate(0, 0, daysDiff)
	common.AssignSimilarDate(component, targetDate)
	component.Assign(chrono.ComponentWeekday, weekday)

	return component
}
