package parsers

import (
	"regexp"
	"strings"
	"time"

	"mzm/core/chrono"
)

// Pattern for relative dates: "this week", "next month", "last year"
var relativeDatePattern = regexp.MustCompile(`(?i)\b(this|last|past|next|after\s*this)\s+(week|month|year|quarter)\b`)

// RelativeDateParser parses relative date expressions like "next month", "last week"
type RelativeDateParser struct{}

// Pattern returns the regex pattern for this parser
func (p *RelativeDateParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return relativeDatePattern
}

// Extract extracts date components from the match
func (p *RelativeDateParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 3 {
		return nil
	}

	modifier := strings.ToLower(match[1])
	unitWord := strings.ToLower(match[2])

	refDate := context.Reference.Instant
	var targetDate time.Time

	switch unitWord {
	case "week":
		targetDate = handleWeekRelative(refDate, modifier)
	case "month":
		targetDate = handleMonthRelative(refDate, modifier)
	case "year":
		targetDate = handleYearRelative(refDate, modifier)
	case "quarter":
		targetDate = handleQuarterRelative(refDate, modifier)
	default:
		return nil
	}

	components := context.CreateParsingComponents(nil)

	// Assign components based on the unit
	switch unitWord {
	case "week":
		components.Imply(chrono.ComponentYear, targetDate.Year())
		components.Imply(chrono.ComponentMonth, int(targetDate.Month()))
		components.Imply(chrono.ComponentDay, targetDate.Day())
	case "month":
		components.Assign(chrono.ComponentYear, targetDate.Year())
		components.Assign(chrono.ComponentMonth, int(targetDate.Month()))
		
	case "year":
		components.Assign(chrono.ComponentYear, targetDate.Year())
		
		
	case "quarter":
		components.Assign(chrono.ComponentYear, targetDate.Year())
		components.Assign(chrono.ComponentMonth, int(targetDate.Month()))
		components.Imply(chrono.ComponentDay, 1)
	}

	components.AddTag("parser/RelativeDateParser")
	return components
}

func handleWeekRelative(refDate time.Time, modifier string) time.Time {
	switch modifier {
	case "this":
		// Start of this week (Sunday)
		weekday := int(refDate.Weekday())
		return refDate.AddDate(0, 0, -weekday)
	case "next", "after this":
		// Start of next week
		weekday := int(refDate.Weekday())
		daysToNextWeek := 7 - weekday
		return refDate.AddDate(0, 0, daysToNextWeek)
	case "last", "past":
		// Start of last week
		weekday := int(refDate.Weekday())
		daysToLastWeek := -(weekday + 7)
		return refDate.AddDate(0, 0, daysToLastWeek)
	default:
		return refDate
	}
}

func handleMonthRelative(refDate time.Time, modifier string) time.Time {
	year := refDate.Year()
	month := refDate.Month()

	switch modifier {
	case "this":
		// First day of this month
		return time.Date(year, month, 1, 0, 0, 0, 0, refDate.Location())
	case "next", "after this":
		// First day of next month
		if month == 12 {
			return time.Date(year+1, 1, 1, 0, 0, 0, 0, refDate.Location())
		}
		return time.Date(year, month+1, 1, 0, 0, 0, 0, refDate.Location())
	case "last", "past":
		// First day of last month
		if month == 1 {
			return time.Date(year-1, 12, 1, 0, 0, 0, 0, refDate.Location())
		}
		return time.Date(year, month-1, 1, 0, 0, 0, 0, refDate.Location())
	default:
		return refDate
	}
}

func handleYearRelative(refDate time.Time, modifier string) time.Time {
	year := refDate.Year()

	switch modifier {
	case "this":
		// First day of this year
		return time.Date(year, 1, 1, 0, 0, 0, 0, refDate.Location())
	case "next", "after this":
		// First day of next year
		return time.Date(year+1, 1, 1, 0, 0, 0, 0, refDate.Location())
	case "last", "past":
		// First day of last year
		return time.Date(year-1, 1, 1, 0, 0, 0, 0, refDate.Location())
	default:
		return refDate
	}
}

func handleQuarterRelative(refDate time.Time, modifier string) time.Time {
	year := refDate.Year()
	month := refDate.Month()
	quarter := ((int(month) - 1) / 3) + 1

	switch modifier {
	case "this":
		// First day of this quarter
		quarterStartMonth := time.Month((quarter-1)*3 + 1)
		return time.Date(year, quarterStartMonth, 1, 0, 0, 0, 0, refDate.Location())
	case "next", "after this":
		// First day of next quarter
		if quarter == 4 {
			return time.Date(year+1, 1, 1, 0, 0, 0, 0, refDate.Location())
		}
		nextQuarterStartMonth := time.Month(quarter*3 + 1)
		return time.Date(year, nextQuarterStartMonth, 1, 0, 0, 0, 0, refDate.Location())
	case "last", "past":
		// First day of last quarter
		if quarter == 1 {
			return time.Date(year-1, 10, 1, 0, 0, 0, 0, refDate.Location())
		}
		lastQuarterStartMonth := time.Month((quarter-2)*3 + 1)
		return time.Date(year, lastQuarterStartMonth, 1, 0, 0, 0, 0, refDate.Location())
	default:
		return refDate
	}
}
