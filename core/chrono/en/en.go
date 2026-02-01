// Package en provides English language support for chrono
package en

import (
	"time"

	"mzm/core/chrono"
	"mzm/core/chrono/en/parsers"
)

// Casual is a Chrono instance configured for parsing casual English
var Casual *chrono.Chrono

// Strict is a Chrono instance configured for parsing strict English
var Strict *chrono.Chrono

func init() {
	Casual = NewCasual()
	Strict = NewStrict()
}

// NewCasual creates a new casual English chrono instance
func NewCasual() *chrono.Chrono {
	config := &chrono.Configuration{
		Parsers: []chrono.Parser{
			// Casual parsers
			&parsers.CasualDateParser{},
			// Date parsers
			&parsers.WeekdayParser{},
			&parsers.MonthNameParser{},
			&parsers.SlashDateParser{},
			&parsers.YearMonthDayParser{},
			&parsers.HolidayParser{},
			// Time parsers
			&parsers.TimeExpressionParser{},
			// Relative parsers
			&parsers.RelativeDateParser{},
			&parsers.TimeUnitsAgoParser{},
			&parsers.TimeUnitsLaterParser{},
			&parsers.TimeUnitsWithinParser{},
		},
		Refiners: []chrono.Refiner{
			// Overlap removal should run first
			&OverlapRemovalRefiner{},
			// Then merge operations
			&MergeDateTimeRefiner{},
			&MergeDateRangeRefiner{},
			// Then filtering
			&UnlikelyFormatFilter{},
			// Finally adjustments
			&ForwardDateRefiner{},
		},
	}
	return chrono.NewChrono(config)
}

// NewStrict creates a new strict English chrono instance
func NewStrict() *chrono.Chrono {
	config := &chrono.Configuration{
		Parsers: []chrono.Parser{
			// Date parsers
			&parsers.WeekdayParser{},
			&parsers.MonthNameParser{},
			&parsers.SlashDateParser{},
			&parsers.YearMonthDayParser{},
			// Time parsers
			&parsers.TimeExpressionParser{},
			// Relative parsers (strict versions)
			&parsers.RelativeDateParser{},
			&parsers.TimeUnitsAgoParser{},
			&parsers.TimeUnitsLaterParser{},
		},
		Refiners: []chrono.Refiner{
			// Overlap removal should run first
			&OverlapRemovalRefiner{},
			// Then merge operations
			&MergeDateTimeRefiner{},
			&MergeDateRangeRefiner{},
			// Then filtering
			&UnlikelyFormatFilter{},
			// Finally adjustments
			&ForwardDateRefiner{},
		},
	}
	return chrono.NewChrono(config)
}

// Parse is a shortcut for Casual.Parse()
func Parse(text string, ref interface{}, option *chrono.ParsingOption) []*chrono.ParsedResult {
	return Casual.Parse(text, ref, option)
}

// ParseDate is a shortcut for Casual.ParseDate()
func ParseDate(text string, ref interface{}, option *chrono.ParsingOption) *time.Time {
	return Casual.ParseDate(text, ref, option)
}
