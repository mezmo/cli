package parsers

import (
	"regexp"
	"strconv"
	"strings"
	"time"

	"mzm/core/chrono"
)

// Pattern for time units like "3 days", "2 weeks", "1 month"
var timeUnitPattern = `(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|several|few|couple\s*(?:of)?)\s*(seconds?|minutes?|hours?|days?|weeks?|months?|years?)`

// Pattern for "X units ago"
var timeUnitsAgoPattern = regexp.MustCompile(`(?i)\b` + timeUnitPattern + `\s+(ago|before|earlier)\b`)

// Pattern for "in X units" or "X units later"
var timeUnitsLaterPattern = regexp.MustCompile(`(?i)\b(?:in\s+` + timeUnitPattern + `|` + timeUnitPattern + `\s+(later|after|from\s+now))\b`)

// Pattern for "within X units"
var timeUnitsWithinPattern = regexp.MustCompile(`(?i)\bwithin\s+` + timeUnitPattern + `\b`)

// TimeUnitsAgoParser parses expressions like "3 days ago", "2 weeks before"
type TimeUnitsAgoParser struct{}

func (p *TimeUnitsAgoParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return timeUnitsAgoPattern
}

func (p *TimeUnitsAgoParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 3 {
		return nil
	}

	amount := parseTimeAmount(match[1])
	if amount == 0 {
		return nil
	}

	unit := normalizeTimeUnit(match[2])
	if unit == "" {
		return nil
	}

	// Calculate the date by subtracting the duration
	targetDate := subtractDuration(context.Reference.Instant, amount, unit)

	components := context.CreateParsingComponents(nil)
	components.Assign(chrono.ComponentYear, targetDate.Year())
	components.Assign(chrono.ComponentMonth, int(targetDate.Month()))
	components.Assign(chrono.ComponentDay, targetDate.Day())

	// For hours/minutes/seconds, also set the time
	if unit == "hour" || unit == "minute" || unit == "second" {
		components.Assign(chrono.ComponentHour, targetDate.Hour())
		components.Assign(chrono.ComponentMinute, targetDate.Minute())
		if unit == "second" {
			components.Assign(chrono.ComponentSecond, targetDate.Second())
		}
	}

	return components
}

// TimeUnitsLaterParser parses expressions like "in 3 days", "2 weeks later"
type TimeUnitsLaterParser struct{}

func (p *TimeUnitsLaterParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return timeUnitsLaterPattern
}

func (p *TimeUnitsLaterParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	// Match groups vary depending on pattern matched
	var amount int
	var unit string

	if strings.HasPrefix(strings.ToLower(match[0]), "in ") {
		// "in X units" pattern - groups 1 and 2
		if len(match) < 3 {
			return nil
		}
		amount = parseTimeAmount(match[1])
		unit = normalizeTimeUnit(match[2])
	} else {
		// "X units later/after" pattern - groups 3 and 4
		if len(match) < 5 {
			return nil
		}
		amount = parseTimeAmount(match[3])
		unit = normalizeTimeUnit(match[4])
	}

	if amount == 0 || unit == "" {
		return nil
	}

	// Calculate the date by adding the duration
	targetDate := addDuration(context.Reference.Instant, amount, unit)

	components := context.CreateParsingComponents(nil)
	components.Assign(chrono.ComponentYear, targetDate.Year())
	components.Assign(chrono.ComponentMonth, int(targetDate.Month()))
	components.Assign(chrono.ComponentDay, targetDate.Day())

	// For hours/minutes/seconds, also set the time
	if unit == "hour" || unit == "minute" || unit == "second" {
		components.Assign(chrono.ComponentHour, targetDate.Hour())
		components.Assign(chrono.ComponentMinute, targetDate.Minute())
		if unit == "second" {
			components.Assign(chrono.ComponentSecond, targetDate.Second())
		}
	}

	return components
}

// TimeUnitsWithinParser parses expressions like "within 3 days", "within a week"
type TimeUnitsWithinParser struct{}

func (p *TimeUnitsWithinParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return timeUnitsWithinPattern
}

func (p *TimeUnitsWithinParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 3 {
		return nil
	}

	amount := parseTimeAmount(match[1])
	if amount == 0 {
		return nil
	}

	unit := normalizeTimeUnit(match[2])
	if unit == "" {
		return nil
	}

	// "Within" creates a range from now to the specified time
	startDate := context.Reference.Instant
	endDate := addDuration(startDate, amount, unit)

	// Create a result with both start and end
	result := context.CreateParsingResult(matchIndex, match[0], nil, nil)

	// Set start components (now)
	result.Start = context.CreateParsingComponents(nil)
	result.Start.Assign(chrono.ComponentYear, startDate.Year())
	result.Start.Assign(chrono.ComponentMonth, int(startDate.Month()))
	result.Start.Assign(chrono.ComponentDay, startDate.Day())

	// Set end components
	result.End = context.CreateParsingComponents(nil)
	result.End.Assign(chrono.ComponentYear, endDate.Year())
	result.End.Assign(chrono.ComponentMonth, int(endDate.Month()))
	result.End.Assign(chrono.ComponentDay, endDate.Day())

	return result
}

// Helper function to parse time amounts from words or numbers
func parseTimeAmount(amountStr string) int {
	amountStr = strings.ToLower(strings.TrimSpace(amountStr))

	// Remove "couple of" -> 2
	amountStr = strings.Replace(amountStr, "couple of", "2", 1)
	amountStr = strings.Replace(amountStr, "couple", "2", 1)

	// Word to number mapping
	wordNumbers := map[string]int{
		"a":       1,
		"an":      1,
		"one":     1,
		"two":     2,
		"three":   3,
		"four":    4,
		"five":    5,
		"six":     6,
		"seven":   7,
		"eight":   8,
		"nine":    9,
		"ten":     10,
		"several": 3,
		"few":     3,
	}

	if val, ok := wordNumbers[amountStr]; ok {
		return val
	}

	// Try to parse as integer
	val, err := strconv.Atoi(amountStr)
	if err != nil {
		return 0
	}
	return val
}

// Helper function to normalize time unit strings
func normalizeTimeUnit(unitStr string) string {
	unitStr = strings.ToLower(strings.TrimSpace(unitStr))
	// Remove plural 's'
	unitStr = strings.TrimSuffix(unitStr, "s")

	switch unitStr {
	case "second", "sec":
		return "second"
	case "minute", "min":
		return "minute"
	case "hour", "hr":
		return "hour"
	case "day":
		return "day"
	case "week", "wk":
		return "week"
	case "month", "mo":
		return "month"
	case "year", "yr":
		return "year"
	default:
		return ""
	}
}

// Helper function to add duration to a date
func addDuration(date time.Time, amount int, unit string) time.Time {
	switch unit {
	case "second":
		return date.Add(time.Duration(amount) * time.Second)
	case "minute":
		return date.Add(time.Duration(amount) * time.Minute)
	case "hour":
		return date.Add(time.Duration(amount) * time.Hour)
	case "day":
		return date.AddDate(0, 0, amount)
	case "week":
		return date.AddDate(0, 0, amount*7)
	case "month":
		return date.AddDate(0, amount, 0)
	case "year":
		return date.AddDate(amount, 0, 0)
	default:
		return date
	}
}

// Helper function to subtract duration from a date
func subtractDuration(date time.Time, amount int, unit string) time.Time {
	return addDuration(date, -amount, unit)
}
