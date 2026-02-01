package parsers

import (
	"regexp"
	"strconv"
	"strings"

	"mzm/core/chrono"
)

// Removed positive lookahead (?=\W|$) - Go doesn't support it
var monthNamePattern = regexp.MustCompile(`(?i)(january|jan\.?|february|feb\.?|march|mar\.?|april|apr\.?|may|june|jun\.?|july|jul\.?|august|aug\.?|september|sept?\.?|october|oct\.?|november|nov\.?|december|dec\.?)(?:\s+(\d{1,2})(?:st|nd|rd|th)?)?(?:\s*,?\s*(\d{4}))?`)

var monthDictionary = map[string]int{
	"january": 1, "jan": 1, "jan.": 1,
	"february": 2, "feb": 2, "feb.": 2,
	"march": 3, "mar": 3, "mar.": 3,
	"april": 4, "apr": 4, "apr.": 4,
	"may": 5,
	"june": 6, "jun": 6, "jun.": 6,
	"july": 7, "jul": 7, "jul.": 7,
	"august": 8, "aug": 8, "aug.": 8,
	"september": 9, "sep": 9, "sep.": 9, "sept": 9, "sept.": 9,
	"october": 10, "oct": 10, "oct.": 10,
	"november": 11, "nov": 11, "nov.": 11,
	"december": 12, "dec": 12, "dec.": 12,
}

var ordinalSuffixPattern = regexp.MustCompile(`(?i)(?:st|nd|rd|th)$`)

// MonthNameParser parses month names with optional day and year
type MonthNameParser struct{}

// Pattern returns the regex pattern for month names
func (p *MonthNameParser) Pattern(context *chrono.ParsingContext) *regexp.Regexp {
	return monthNamePattern
}

// Extract extracts month/day/year components from the match
func (p *MonthNameParser) Extract(context *chrono.ParsingContext, match []string, matchIndex int) interface{} {
	if len(match) < 2 {
		return nil
	}

	monthWord := strings.ToLower(strings.TrimSpace(match[1]))
	month, ok := monthDictionary[monthWord]
	if !ok {
		return nil
	}

	component := chrono.NewParsingComponents(context.Reference, nil)
	component.Assign(chrono.ComponentMonth, month)

	// Parse day if present
	if len(match) > 2 && match[2] != "" {
		day, _ := strconv.Atoi(ordinalSuffixPattern.ReplaceAllString(match[2], ""))
		if day > 0 && day <= 31 {
			component.Assign(chrono.ComponentDay, day)
		}
	}

	// Parse year if present
	if len(match) > 3 && match[3] != "" {
		year, _ := strconv.Atoi(match[3])
		if year > 0 {
			component.Assign(chrono.ComponentYear, year)
		}
	}

	component.AddTag("parser/MonthNameParser")
	return component
}
