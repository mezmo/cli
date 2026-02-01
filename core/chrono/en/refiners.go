package en

import (
	"strconv"
	"strings"

	"mzm/core/chrono"
)

// OverlapRemovalRefiner removes overlapping results
type OverlapRemovalRefiner struct{}

func (r *OverlapRemovalRefiner) Refine(context *chrono.ParsingContext, results []*chrono.ParsedResult) []*chrono.ParsedResult {
	if len(results) < 2 {
		return results
	}

	filtered := make([]*chrono.ParsedResult, 0, len(results))
	var lastResult *chrono.ParsedResult

	for _, result := range results {
		if lastResult == nil {
			filtered = append(filtered, result)
			lastResult = result
			continue
		}

		// Check for overlap
		if result.Index < lastResult.Index+len(lastResult.Text) {
			// Results overlap, keep the longer one
			if len(result.Text) > len(lastResult.Text) {
				// Replace last with current
				filtered[len(filtered)-1] = result
				lastResult = result
			}
			// Otherwise skip current (keep last)
		} else {
			// No overlap
			filtered = append(filtered, result)
			lastResult = result
		}
	}

	return filtered
}

// MergeDateRangeRefiner merges adjacent date expressions into ranges
type MergeDateRangeRefiner struct{}

func (r *MergeDateRangeRefiner) Refine(context *chrono.ParsingContext, results []*chrono.ParsedResult) []*chrono.ParsedResult {
	if len(results) < 2 {
		return results
	}

	merged := make([]*chrono.ParsedResult, 0, len(results))
	var i int

	for i < len(results) {
		current := results[i]

		// Look for next result
		if i+1 < len(results) {
			next := results[i+1]
			textBetween := context.Text[current.Index+len(current.Text) : next.Index]

			// Check if we should merge
			if shouldMergeDateRange(textBetween, current, next) {
				// Create merged result
				mergedResult := &chrono.ParsedResult{
					RefDate: current.RefDate,
					Index:   current.Index,
					Text:    context.Text[current.Index : next.Index+len(next.Text)],
					Start:   current.Start,
					End:     next.Start, // Use next's start as the end
				}
				merged = append(merged, mergedResult)
				i += 2 // Skip both results
				continue
			}
		}

		// No merge, add current
		merged = append(merged, current)
		i++
	}

	return merged
}

func shouldMergeDateRange(textBetween string, current, next *chrono.ParsedResult) bool {
	// Only merge if there's no end date already
	if current.End != nil || next.End != nil {
		return false
	}

	// Check for range indicators
	textBetween = strings.TrimSpace(strings.ToLower(textBetween))
	rangeIndicators := []string{"-", "–", "—", "to", "until", "through", "till"}

	for _, indicator := range rangeIndicators {
		if textBetween == indicator {
			return true
		}
	}

	return false
}

// MergeDateTimeRefiner merges adjacent date and time expressions
type MergeDateTimeRefiner struct{}

func (r *MergeDateTimeRefiner) Refine(context *chrono.ParsingContext, results []*chrono.ParsedResult) []*chrono.ParsedResult {
	if len(results) < 2 {
		return results
	}

	merged := make([]*chrono.ParsedResult, 0, len(results))
	var i int

	for i < len(results) {
		current := results[i]

		// Look for next result
		if i+1 < len(results) {
			next := results[i+1]
			textBetween := context.Text[current.Index+len(current.Text) : next.Index]

			// Check if we should merge date and time
			if shouldMergeDateTime(textBetween, current, next) {
				// Merge the components
				mergedComponents := current.Start.Clone()

				// Copy time components from next if it has them
				if next.Start.IsCertain(chrono.ComponentHour) {
					mergedComponents.Assign(chrono.ComponentHour, *next.Start.Get(chrono.ComponentHour))
				}
				if next.Start.IsCertain(chrono.ComponentMinute) {
					mergedComponents.Assign(chrono.ComponentMinute, *next.Start.Get(chrono.ComponentMinute))
				}
				if next.Start.IsCertain(chrono.ComponentSecond) {
					mergedComponents.Assign(chrono.ComponentSecond, *next.Start.Get(chrono.ComponentSecond))
				}

				// Copy date components from next if current doesn't have them
				if !current.Start.IsCertain(chrono.ComponentYear) && next.Start.IsCertain(chrono.ComponentYear) {
					mergedComponents.Assign(chrono.ComponentYear, *next.Start.Get(chrono.ComponentYear))
				}
				if !current.Start.IsCertain(chrono.ComponentMonth) && next.Start.IsCertain(chrono.ComponentMonth) {
					mergedComponents.Assign(chrono.ComponentMonth, *next.Start.Get(chrono.ComponentMonth))
				}
				if !current.Start.IsCertain(chrono.ComponentDay) && next.Start.IsCertain(chrono.ComponentDay) {
					mergedComponents.Assign(chrono.ComponentDay, *next.Start.Get(chrono.ComponentDay))
				}

				// Create merged result
				mergedResult := &chrono.ParsedResult{
					RefDate: current.RefDate,
					Index:   current.Index,
					Text:    context.Text[current.Index : next.Index+len(next.Text)],
					Start:   mergedComponents,
					End:     nil,
				}
				merged = append(merged, mergedResult)
				i += 2 // Skip both results
				continue
			}
		}

		// No merge, add current
		merged = append(merged, current)
		i++
	}

	return merged
}

func shouldMergeDateTime(textBetween string, current, next *chrono.ParsedResult) bool {
	textBetween = strings.TrimSpace(strings.ToLower(textBetween))

	// Check if one has date and other has time
	currentHasTime := current.Start.IsCertain(chrono.ComponentHour)
	nextHasTime := next.Start.IsCertain(chrono.ComponentHour)
	currentHasDate := current.Start.IsCertain(chrono.ComponentDay) || current.Start.IsCertain(chrono.ComponentMonth)
	nextHasDate := next.Start.IsCertain(chrono.ComponentDay) || next.Start.IsCertain(chrono.ComponentMonth)

	// Merge if one has date and other has time
	if currentHasDate && !currentHasTime && nextHasTime && !nextHasDate {
		// Allow merge with "at", comma, or just whitespace
		return textBetween == "" || textBetween == "at" || textBetween == ","
	}
	if currentHasTime && !currentHasDate && nextHasDate && !nextHasTime {
		// Time before date is less common but possible
		return textBetween == "" || textBetween == "on" || textBetween == ","
	}

	return false
}

// UnlikelyFormatFilter filters out unlikely date formats
type UnlikelyFormatFilter struct{}

func (f *UnlikelyFormatFilter) Refine(context *chrono.ParsingContext, results []*chrono.ParsedResult) []*chrono.ParsedResult {
	filtered := make([]*chrono.ParsedResult, 0, len(results))

	for _, result := range results {
		if isLikelyDateFormat(result) {
			filtered = append(filtered, result)
		}
	}

	return filtered
}

func isLikelyDateFormat(result *chrono.ParsedResult) bool {
	// Filter out results that are too short
	if len(result.Text) < 3 {
		return false
	}

	// Filter out single numbers
	if _, err := strconv.Atoi(result.Text); err == nil {
		return false
	}

	// Filter out results that only have a year
	if result.Start.IsCertain(chrono.ComponentYear) &&
		!result.Start.IsCertain(chrono.ComponentMonth) &&
		!result.Start.IsCertain(chrono.ComponentDay) &&
		!result.Start.IsCertain(chrono.ComponentHour) {
		// Just a year is unlikely unless it's in a specific format
		// Check if this is from a relative date parser
		if result.Start.HasTag("parser/RelativeDateParser") {
			return true
		}
		return false
	}

	return true
}

// ForwardDateRefiner adjusts ambiguous dates to be in the future
type ForwardDateRefiner struct{}

func (r *ForwardDateRefiner) Refine(context *chrono.ParsingContext, results []*chrono.ParsedResult) []*chrono.ParsedResult {
	if context.Option == nil || !context.Option.ForwardDate {
		return results
	}

	refDate := context.Reference.Instant

	for _, result := range results {
		// Only adjust if year is implied (not certain)
		if !result.Start.IsCertain(chrono.ComponentYear) {
			resultDate := result.Start.Date()

			// If the date is in the past, move it to next year
			if resultDate.Before(refDate) {
				currentYear := result.Start.Get(chrono.ComponentYear)
				if currentYear != nil {
					result.Start.Imply(chrono.ComponentYear, *currentYear+1)
				}
			}
		}
	}

	return results
}
