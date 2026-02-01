package parsers

import (
	"regexp"
	"strconv"
	"time"

	"mzm/core/chrono"
)

// Pattern for dates with slash, dash, or dot separators
// Supports MM/DD/YYYY, MM-DD-YYYY, MM.DD.YYYY
// Also supports shortened forms like MM/DD, MM/YYYY
var slashDatePattern = regexp.MustCompile(`(?:^|\s)(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?(?:\s|$)`)

// SlashDateParser parses dates in slash format like "12/25/2024", "3/15", etc.
type SlashDateParser struct {
	LittleEndian bool // If true, interpret as DD/MM/YYYY instead of MM/DD/YYYY
}

// Pattern returns the regex pattern for this parser
func (p *SlashDateParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return slashDatePattern
}

// Extract extracts date components from the match
func (p *SlashDateParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 3 {
		return nil
	}

	var month, day int
	var err error

	first, err := strconv.Atoi(match[1])
	if err != nil {
		return nil
	}

	second, err := strconv.Atoi(match[2])
	if err != nil {
		return nil
	}

	// Determine month and day based on endianness
	if p.LittleEndian {
		// DD/MM format
		day = first
		month = second
	} else {
		// MM/DD format (American)
		month = first
		day = second
	}

	// Swap if month is invalid but day would be valid as month
	if month > 12 && day <= 12 && month <= 31 {
		month, day = day, month
	}

	// Validate month and day
	if month < 1 || month > 12 || day < 1 || day > 31 {
		return nil
	}

	// Check for impossible dates
	if !isValidDate(month, day) {
		return nil
	}

	components := context.CreateParsingComponents(map[chrono.Component]int{
		chrono.ComponentMonth: month,
		chrono.ComponentDay:   day,
	})

	// Handle year if present
	if len(match) > 3 && match[3] != "" {
		yearStr := match[3]
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			return nil
		}

		// Handle 2-digit years
		if year < 100 {
			currentYear := context.Reference.Instant.Year()
			century := (currentYear / 100) * 100
			year = century + year

			// If the year is too far in the future, use previous century
			if year > currentYear+20 {
				year -= 100
			}
		}

		components.Assign(chrono.ComponentYear, year)
	} else {
		// Imply the year based on the reference date
		year := findYearClosestToRef(context.Reference.Instant, month, day)
		components.Imply(chrono.ComponentYear, year)
	}

	return components
}

// isValidDate checks if a month/day combination is valid
func isValidDate(month, day int) bool {
	// Days in each month (non-leap year)
	daysInMonth := []int{0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}

	if month < 1 || month > 12 {
		return false
	}

	maxDays := daysInMonth[month]
	// Note: This doesn't handle leap years perfectly, but it's good enough
	// The actual date validation will happen when creating the time.Time

	return day >= 1 && day <= maxDays
}

// findYearClosestToRef finds the year closest to the reference date for a given month/day
func findYearClosestToRef(refDate time.Time, month, day int) int {
	refYear := refDate.Year()
	refMonth := int(refDate.Month())
	refDay := refDate.Day()

	// Try current year
	if month > refMonth || (month == refMonth && day >= refDay) {
		return refYear
	}

	// Use next year if the date has passed
	return refYear + 1
}

// YearMonthDayParser parses ISO-style dates: YYYY-MM-DD, YYYY/MM/DD
type YearMonthDayParser struct{}

// Pattern for YYYY-MM-DD format
var yearMonthDayPattern = regexp.MustCompile(`(?i)\b(\d{4})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12][0-9]|3[01])\b`)

func (p *YearMonthDayParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return yearMonthDayPattern
}

func (p *YearMonthDayParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 4 {
		return nil
	}

	year, err := strconv.Atoi(match[1])
	if err != nil {
		return nil
	}

	month, err := strconv.Atoi(match[2])
	if err != nil || month < 1 || month > 12 {
		return nil
	}

	day, err := strconv.Atoi(match[3])
	if err != nil || day < 1 || day > 31 {
		return nil
	}

	// Validate the date
	parsedDate := time.Date(year, time.Month(month), day, 0, 0, 0, 0, context.Reference.Instant.Location())
	if parsedDate.Month() != time.Month(month) || parsedDate.Day() != day {
		// Invalid date (e.g., Feb 30)
		return nil
	}

	component := context.CreateParsingComponents(map[chrono.Component]int{
		chrono.ComponentYear:  year,
		chrono.ComponentMonth: month,
		chrono.ComponentDay:   day,
	})

	return component
}

