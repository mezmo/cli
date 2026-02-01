package common

import (
	"mzm/core/chrono"
	"time"
)

// Now returns components for "now"
func Now(reference *chrono.ReferenceWithTimezone) *chrono.ParsingComponents {
	targetDate := reference.GetDateWithAdjustedTimezone()
	component := chrono.NewParsingComponents(reference, nil)
	AssignSimilarDate(component, targetDate)
	AssignSimilarTime(component, targetDate)
	offset := reference.GetTimezoneOffset()
	component.Assign(chrono.ComponentTimezoneOffset, offset)
	component.AddTag("casualReference/now")
	return component
}

// Today returns components for "today"
func Today(reference *chrono.ReferenceWithTimezone) *chrono.ParsingComponents {
	targetDate := reference.GetDateWithAdjustedTimezone()
	component := chrono.NewParsingComponents(reference, nil)
	AssignSimilarDate(component, targetDate)
	ImplySimilarTime(component, targetDate)
	component.Delete(chrono.ComponentMeridiem)
	component.AddTag("casualReference/today")
	return component
}

// Yesterday returns components for "yesterday"
func Yesterday(reference *chrono.ReferenceWithTimezone) *chrono.ParsingComponents {
	return TheDayBefore(reference, 1).AddTag("casualReference/yesterday")
}

// Tomorrow returns components for "tomorrow"
func Tomorrow(reference *chrono.ReferenceWithTimezone) *chrono.ParsingComponents {
	return TheDayAfter(reference, 1).AddTag("casualReference/tomorrow")
}

// TheDayBefore returns components for n days before
func TheDayBefore(reference *chrono.ReferenceWithTimezone, numDay int) *chrono.ParsingComponents {
	return TheDayAfter(reference, -numDay)
}

// TheDayAfter returns components for n days after
func TheDayAfter(reference *chrono.ReferenceWithTimezone, nDays int) *chrono.ParsingComponents {
	targetDate := reference.GetDateWithAdjustedTimezone()
	component := chrono.NewParsingComponents(reference, nil)
	newDate := targetDate.AddDate(0, 0, nDays)

	AssignSimilarDate(component, newDate)
	ImplySimilarTime(component, newDate)
	component.Delete(chrono.ComponentMeridiem)
	return component
}

// Tonight returns components for "tonight"
func Tonight(reference *chrono.ReferenceWithTimezone, implyHour int) *chrono.ParsingComponents {
	if implyHour == 0 {
		implyHour = 22
	}
	targetDate := reference.GetDateWithAdjustedTimezone()
	component := chrono.NewParsingComponents(reference, nil)
	AssignSimilarDate(component, targetDate)
	component.Imply(chrono.ComponentHour, implyHour)
	component.Imply(chrono.ComponentMeridiem, int(chrono.MeridiemPM))
	component.AddTag("casualReference/tonight")
	return component
}

// LastNight returns components for "last night"
func LastNight(reference *chrono.ReferenceWithTimezone, implyHour int) *chrono.ParsingComponents {
	targetDate := reference.GetDateWithAdjustedTimezone()
	component := chrono.NewParsingComponents(reference, nil)
	if targetDate.Hour() < 6 {
		targetDate = targetDate.AddDate(0, 0, -1)
	}
	AssignSimilarDate(component, targetDate)
	component.Imply(chrono.ComponentHour, implyHour)
	return component
}

// Morning returns components for "morning"
func Morning(reference *chrono.ReferenceWithTimezone, implyHour int) *chrono.ParsingComponents {
	if implyHour == 0 {
		implyHour = 6
	}
	component := chrono.NewParsingComponents(reference, nil)
	component.Imply(chrono.ComponentMeridiem, int(chrono.MeridiemAM))
	component.Imply(chrono.ComponentHour, implyHour)
	component.Imply(chrono.ComponentMinute, 0)
	component.Imply(chrono.ComponentSecond, 0)
	component.Imply(chrono.ComponentMillisecond, 0)
	component.AddTag("casualReference/morning")
	return component
}

// Afternoon returns components for "afternoon"
func Afternoon(reference *chrono.ReferenceWithTimezone, implyHour int) *chrono.ParsingComponents {
	if implyHour == 0 {
		implyHour = 15
	}
	component := chrono.NewParsingComponents(reference, nil)
	component.Imply(chrono.ComponentMeridiem, int(chrono.MeridiemPM))
	component.Imply(chrono.ComponentHour, implyHour)
	component.Imply(chrono.ComponentMinute, 0)
	component.Imply(chrono.ComponentSecond, 0)
	component.Imply(chrono.ComponentMillisecond, 0)
	component.AddTag("casualReference/afternoon")
	return component
}

// AssignSimilarDate assigns date components from a time.Time
func AssignSimilarDate(component *chrono.ParsingComponents, date time.Time) {
	component.Assign(chrono.ComponentDay, date.Day())
	component.Assign(chrono.ComponentMonth, int(date.Month()))
	component.Assign(chrono.ComponentYear, date.Year())
}

// AssignSimilarTime assigns time components from a time.Time
func AssignSimilarTime(component *chrono.ParsingComponents, date time.Time) {
	component.Assign(chrono.ComponentHour, date.Hour())
	component.Assign(chrono.ComponentMinute, date.Minute())
	component.Assign(chrono.ComponentSecond, date.Second())
	component.Assign(chrono.ComponentMillisecond, date.Nanosecond()/1000000)
}

// ImplySimilarTime implies time components from a time.Time
func ImplySimilarTime(component *chrono.ParsingComponents, date time.Time) {
	component.Imply(chrono.ComponentHour, date.Hour())
	component.Imply(chrono.ComponentMinute, date.Minute())
	component.Imply(chrono.ComponentSecond, date.Second())
	component.Imply(chrono.ComponentMillisecond, date.Nanosecond()/1000000)
}
