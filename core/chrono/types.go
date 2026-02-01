package chrono

import "time"

// Component represents a date/time component
type Component string

const (
	ComponentYear            Component = "year"
	ComponentMonth           Component = "month"
	ComponentDay             Component = "day"
	ComponentWeekday         Component = "weekday"
	ComponentHour            Component = "hour"
	ComponentMinute          Component = "minute"
	ComponentSecond          Component = "second"
	ComponentMillisecond     Component = "millisecond"
	ComponentMeridiem        Component = "meridiem"
	ComponentTimezoneOffset  Component = "timezoneOffset"
)

// Timeunit represents time units for relative dates
type Timeunit string

const (
	TimeunitYear        Timeunit = "year"
	TimeunitMonth       Timeunit = "month"
	TimeunitWeek        Timeunit = "week"
	TimeunitDay         Timeunit = "day"
	TimeunitHour        Timeunit = "hour"
	TimeunitMinute      Timeunit = "minute"
	TimeunitSecond      Timeunit = "second"
	TimeunitMillisecond Timeunit = "millisecond"
	TimeunitQuarter     Timeunit = "quarter"
)

// Meridiem represents AM/PM
type Meridiem int

const (
	MeridiemAM Meridiem = 0
	MeridiemPM Meridiem = 1
)

// Weekday represents days of the week
type Weekday int

const (
	WeekdaySunday    Weekday = 0
	WeekdayMonday    Weekday = 1
	WeekdayTuesday   Weekday = 2
	WeekdayWednesday Weekday = 3
	WeekdayThursday  Weekday = 4
	WeekdayFriday    Weekday = 5
	WeekdaySaturday  Weekday = 6
)

// Month represents months of the year
type Month int

const (
	MonthJanuary   Month = 1
	MonthFebruary  Month = 2
	MonthMarch     Month = 3
	MonthApril     Month = 4
	MonthMay       Month = 5
	MonthJune      Month = 6
	MonthJuly      Month = 7
	MonthAugust    Month = 8
	MonthSeptember Month = 9
	MonthOctober   Month = 10
	MonthNovember  Month = 11
	MonthDecember  Month = 12
)

// ParsingOption contains options for parsing
type ParsingOption struct {
	// ForwardDate parses only forward dates (results after reference date)
	ForwardDate bool

	// Timezones contains additional timezone keywords
	Timezones map[string]interface{}

	// Debug enables debug output
	Debug bool
}

// ParsingReference defines the reference date/time and timezone
type ParsingReference struct {
	// Instant is the reference date/time
	Instant *time.Time

	// Timezone is the reference timezone (name or offset in minutes)
	Timezone interface{} // string or int
}

// ParsedResult represents a parsed date/time result
type ParsedResult struct {
	RefDate   time.Time
	Index     int
	Text      string
	Start     *ParsingComponents
	End       *ParsingComponents
	reference *ReferenceWithTimezone
}

// Date returns a time.Time created from the result's start components
func (r *ParsedResult) Date() time.Time {
	return r.Start.Date()
}

// Tags returns debugging tags combined from start and end
func (r *ParsedResult) Tags() map[string]bool {
	tags := make(map[string]bool)
	for tag := range r.Start.Tags() {
		tags[tag] = true
	}
	if r.End != nil {
		for tag := range r.End.Tags() {
			tags[tag] = true
		}
	}
	return tags
}

// Clone creates a deep copy of the result
func (r *ParsedResult) Clone() *ParsedResult {
	result := &ParsedResult{
		RefDate:   r.RefDate,
		Index:     r.Index,
		Text:      r.Text,
		reference: r.reference,
	}
	if r.Start != nil {
		result.Start = r.Start.Clone()
	}
	if r.End != nil {
		result.End = r.End.Clone()
	}
	return result
}

// AddTag adds a tag to both start and end components
func (r *ParsedResult) AddTag(tag string) *ParsedResult {
	r.Start.AddTag(tag)
	if r.End != nil {
		r.End.AddTag(tag)
	}
	return r
}

// ParsedComponentsInterface interface for accessing parsed date/time components
type ParsedComponentsInterface interface {
	IsCertain(component Component) bool
	Get(component Component) *int
	Date() time.Time
	Tags() map[string]bool
}

