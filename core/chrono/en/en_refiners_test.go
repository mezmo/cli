package en

import (
	"testing"
	"time"

	"mzm/core/chrono"
)

// Test date range merging
// func TestMergeDateRange(t *testing.T) {
// 	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)
// 
// 	tests := []struct {
// 		text         string
// 		expectRange  bool
// 		expectStart  time.Time
// 		expectEnd    time.Time
// 	}{
// 		{
// 			"Sep 12-13",
// 			true,
// 			time.Date(2024, 9, 12, 12, 0, 0, 0, time.UTC),
// 			time.Date(2024, 9, 13, 12, 0, 0, 0, time.UTC),
// 		},
// 		{
// 			"from 3/15 to 3/20",
// 			true,
// 			time.Date(2024, 3, 15, 12, 0, 0, 0, time.UTC),
// 			time.Date(2024, 3, 20, 12, 0, 0, 0, time.UTC),
// 		},
// 	}
// 
// 	for _, test := range tests {
// 		results := Parse(test.text, refDate, nil)
// 		if len(results) == 0 {
// 			t.Errorf("Failed to parse '%s'", test.text)
// 			continue
// 		}
// 
// 		result := results[0]
// 
// 		if test.expectRange {
// 			if result.End == nil {
// 				t.Errorf("For '%s': expected range but got single date", test.text)
// 				continue
// 			}
// 
// 			startDate := result.Start.Date()
// 			endDate := result.End.Date()
// 
// 			if !startDate.Equal(test.expectStart) {
// 				t.Errorf("For '%s': start date expected %v, got %v", test.text, test.expectStart, startDate)
// 			}
// 
// 			if !endDate.Equal(test.expectEnd) {
// 				t.Errorf("For '%s': end date expected %v, got %v", test.text, test.expectEnd, endDate)
// 			}
// 		}
// 	}
// }

// Test date and time merging
func TestMergeDateTimeRefiner(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text         string
		expectedDate time.Time
	}{
		{
			"September 12 at 3pm",
			time.Date(2024, 9, 12, 15, 0, 0, 0, time.UTC),
		},
		{
			"tomorrow at 2:30pm",
			time.Date(2024, 1, 16, 14, 30, 0, 0, time.UTC),
		},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		// Should get merged into one result
		if len(results) != 1 {
			t.Errorf("For '%s': expected 1 merged result, got %d", test.text, len(results))
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()

		// Check both date and time components
		if actualDate.Year() != test.expectedDate.Year() ||
			actualDate.Month() != test.expectedDate.Month() ||
			actualDate.Day() != test.expectedDate.Day() ||
			actualDate.Hour() != test.expectedDate.Hour() ||
			actualDate.Minute() != test.expectedDate.Minute() {
			t.Errorf("For '%s': expected %v, got %v", test.text, test.expectedDate, actualDate)
		}
	}
}

// Test overlap removal
func TestOverlapRemoval(t *testing.T) {
	// Create a context with overlapping results
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)
	context := chrono.NewParsingContext("September 12", refDate, nil)

	// Simulate overlapping results
	result1 := &chrono.ParsedResult{
		Index: 0,
		Text:  "September",
		Start: context.CreateParsingComponents(map[chrono.Component]int{
			chrono.ComponentMonth: 9,
		}),
	}

	result2 := &chrono.ParsedResult{
		Index: 0,
		Text:  "September 12",
		Start: context.CreateParsingComponents(map[chrono.Component]int{
			chrono.ComponentMonth: 9,
			chrono.ComponentDay:   12,
		}),
	}

	results := []*chrono.ParsedResult{result1, result2}

	// Apply overlap removal
	refiner := &OverlapRemovalRefiner{}
	refined := refiner.Refine(context, results)

	// Should keep the longer one
	if len(refined) != 1 {
		t.Errorf("Expected 1 result after overlap removal, got %d", len(refined))
	}

	if refined[0].Text != "September 12" {
		t.Errorf("Expected to keep 'September 12', got '%s'", refined[0].Text)
	}
}

// Test forward date refiner
func TestForwardDateRefiner(t *testing.T) {
	// Test with a reference date in June
	refDate := time.Date(2024, 6, 15, 12, 0, 0, 0, time.UTC)
	option := &chrono.ParsingOption{
		ForwardDate: true,
	}

	tests := []struct {
		text         string
		expectedYear int
	}{
		{"March 15", 2025},   // March is before June, so should be next year
		{"December 1", 2024}, // December is after June, so should be this year
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, option)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualYear := result.Start.Date().Year()

		if actualYear != test.expectedYear {
			t.Errorf("For '%s' with forward date: expected year %d, got %d",
				test.text, test.expectedYear, actualYear)
		}
	}
}
