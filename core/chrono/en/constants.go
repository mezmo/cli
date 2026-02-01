package en

import (
	"regexp"
	"strconv"
	"strings"
)

// WeekdayDictionary maps weekday names to their numeric values
var WeekdayDictionary = map[string]int{
	"sunday": 0, "sun": 0, "sun.": 0,
	"monday": 1, "mon": 1, "mon.": 1,
	"tuesday": 2, "tue": 2, "tue.": 2,
	"wednesday": 3, "wed": 3, "wed.": 3,
	"thursday": 4, "thurs": 4, "thurs.": 4, "thur": 4, "thur.": 4, "thu": 4, "thu.": 4,
	"friday": 5, "fri": 5, "fri.": 5,
	"saturday": 6, "sat": 6, "sat.": 6,
}

// MonthDictionary maps month names to their numeric values
var MonthDictionary = map[string]int{
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

// IntegerWordDictionary maps number words to integers
var IntegerWordDictionary = map[string]int{
	"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
	"seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
}

// OrdinalWordDictionary maps ordinal words to integers
var OrdinalWordDictionary = map[string]int{
	"first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5,
	"sixth": 6, "seventh": 7, "eighth": 8, "ninth": 9, "tenth": 10,
	"eleventh": 11, "twelfth": 12, "thirteenth": 13, "fourteenth": 14,
	"fifteenth": 15, "sixteenth": 16, "seventeenth": 17, "eighteenth": 18,
	"nineteenth": 19, "twentieth": 20, "twenty first": 21, "twenty-first": 21,
	"twenty second": 22, "twenty-second": 22, "twenty third": 23, "twenty-third": 23,
	"twenty fourth": 24, "twenty-fourth": 24, "twenty fifth": 25, "twenty-fifth": 25,
	"twenty sixth": 26, "twenty-sixth": 26, "twenty seventh": 27, "twenty-seventh": 27,
	"twenty eighth": 28, "twenty-eighth": 28, "twenty ninth": 29, "twenty-ninth": 29,
	"thirtieth": 30, "thirty first": 31, "thirty-first": 31,
}

// TimeUnitDictionary maps time unit names to their canonical form
var TimeUnitDictionary = map[string]string{
	"s": "second", "sec": "second", "second": "second", "seconds": "second",
	"m": "minute", "min": "minute", "mins": "minute", "minute": "minute", "minutes": "minute",
	"h": "hour", "hr": "hour", "hrs": "hour", "hour": "hour", "hours": "hour",
	"d": "day", "day": "day", "days": "day",
	"w": "week", "week": "week", "weeks": "week",
	"mo": "month", "mon": "month", "mos": "month", "month": "month", "months": "month",
	"qtr": "quarter", "quarter": "quarter", "quarters": "quarter",
	"y": "year", "yr": "year", "year": "year", "years": "year",
}

var ordinalSuffixPattern = regexp.MustCompile(`(?i)(?:st|nd|rd|th)$`)

// ParseOrdinalNumber parses an ordinal number string
func ParseOrdinalNumber(match string) int {
	lower := strings.ToLower(strings.TrimSpace(match))
	if val, ok := OrdinalWordDictionary[lower]; ok {
		return val
	}
	// Remove ordinal suffix
	num := ordinalSuffixPattern.ReplaceAllString(lower, "")
	if val, err := strconv.Atoi(num); err == nil {
		return val
	}
	return 0
}

// ParseNumber parses a number string (including words)
func ParseNumber(match string) float64 {
	lower := strings.ToLower(strings.TrimSpace(match))

	if val, ok := IntegerWordDictionary[lower]; ok {
		return float64(val)
	}

	if lower == "a" || lower == "an" || lower == "the" {
		return 1
	}

	if strings.Contains(lower, "few") {
		return 3
	}

	if strings.Contains(lower, "half") {
		return 0.5
	}

	if strings.Contains(lower, "couple") {
		return 2
	}

	if strings.Contains(lower, "several") {
		return 7
	}

	if val, err := strconv.ParseFloat(lower, 64); err == nil {
		return val
	}

	return 1
}

// ParseYear parses a year string
func ParseYear(match string) int {
	match = strings.TrimSpace(match)

	// Handle Buddhist Era
	if strings.Contains(strings.ToUpper(match), "BE") {
		numStr := strings.ReplaceAll(strings.ToUpper(match), "BE", "")
		if val, err := strconv.Atoi(strings.TrimSpace(numStr)); err == nil {
			return val - 543
		}
	}

	// Handle BCE
	if strings.Contains(strings.ToUpper(match), "BCE") || strings.Contains(strings.ToUpper(match), "BC") {
		numStr := strings.ReplaceAll(strings.ToUpper(match), "BCE", "")
		numStr = strings.ReplaceAll(numStr, "BC", "")
		if val, err := strconv.Atoi(strings.TrimSpace(numStr)); err == nil {
			return -val
		}
	}

	// Handle AD/CE
	if strings.Contains(strings.ToUpper(match), "AD") || strings.Contains(strings.ToUpper(match), "CE") {
		numStr := strings.ReplaceAll(strings.ToUpper(match), "AD", "")
		numStr = strings.ReplaceAll(numStr, "CE", "")
		if val, err := strconv.Atoi(strings.TrimSpace(numStr)); err == nil {
			return val
		}
	}

	// Parse raw number
	if val, err := strconv.Atoi(match); err == nil {
		return FindMostLikelyADYear(val)
	}

	return 0
}

// FindMostLikelyADYear finds the most likely AD year from a 2-digit year
func FindMostLikelyADYear(yearNumber int) int {
	if yearNumber < 100 {
		if yearNumber > 50 {
			return 1900 + yearNumber
		}
		return 2000 + yearNumber
	}
	return yearNumber
}
