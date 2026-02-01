package chrono_test

import (
	"testing"
	"time"

	"mzm/core/chrono/en"
)

// TestEnglishParsing tests various English date/time formats
func TestEnglishParsing(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name     string
		input    string
		expected struct {
			hasResult bool
			year      int
			month     int
			day       int
		}
	}{
		{
			name:  "ISO date format",
			input: "2024-12-25",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 12, 25},
		},
		{
			name:  "Slash date format",
			input: "12/25/2024",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 12, 25},
		},
		{
			name:  "Next month",
			input: "next month",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 2, 15},
		},
		{
			name:  "This year",
			input: "this year",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 1, 15},
		},
		{
			name:  "Last year",
			input: "last year",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2023, 1, 15},
		},
		{
			name:  "Next year",
			input: "next year",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2025, 1, 15},
		},
		{
			name:  "3 days ago",
			input: "3 days ago",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 1, 12},
		},
		{
			name:  "In 3 days",
			input: "in 3 days",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 1, 18},
		},
		{
			name:  "2 days later",
			input: "2 days later",
			expected: struct {
				hasResult bool
				year      int
				month     int
				day       int
			}{true, 2024, 1, 17},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			results := en.Parse(tt.input, refDate, nil)

			if tt.expected.hasResult && len(results) == 0 {
				t.Errorf("Expected result for '%s', but got none", tt.input)
				return
			}

			if !tt.expected.hasResult && len(results) > 0 {
				t.Errorf("Expected no result for '%s', but got %d", tt.input, len(results))
				return
			}

			if tt.expected.hasResult && len(results) > 0 {
				result := results[0]
				date := result.Start.Date()

				if date.Year() != tt.expected.year {
					t.Errorf("Year mismatch for '%s': expected %d, got %d",
						tt.input, tt.expected.year, date.Year())
				}

				if int(date.Month()) != tt.expected.month {
					t.Errorf("Month mismatch for '%s': expected %d, got %d",
						tt.input, tt.expected.month, int(date.Month()))
				}

				if date.Day() != tt.expected.day {
					t.Errorf("Day mismatch for '%s': expected %d, got %d",
						tt.input, tt.expected.day, date.Day())
				}
			}
		})
	}
}

// TestDateRangeParsing tests parsing of date ranges
// func TestDateRangeParsing(t *testing.T) {
// 	refDate := time.Date(2024, 9, 10, 12, 0, 0, 0, time.UTC)
// 
// 	tests := []struct {
// 		name        string
// 		input       string
// 		expectRange bool
// 	}{
// 		{
// 			name:        "Sep 12-13",
// 			input:       "Sep 12-13",
// 			expectRange: true,
// 		},
// 	}
// 
// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			results := en.Parse(tt.input, refDate, nil)
// 
// 			if len(results) == 0 {
// 				t.Errorf("Expected result for '%s', but got none", tt.input)
// 				return
// 			}
// 
// 			result := results[0]
// 			if tt.expectRange && result.End == nil {
// 				t.Errorf("Expected date range for '%s', but got single date", tt.input)
// 			}
// 		})
// 	}
// }

// TestDateTimeCombination tests parsing of combined date and time
func TestDateTimeCombination(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name         string
		input        string
		expectedHour int
		expectedMin  int
	}{
		{
			name:         "Tomorrow at 2:30pm",
			input:        "tomorrow at 2:30pm",
			expectedHour: 14,
			expectedMin:  30,
		},
		{
			name:         "Tomorrow at 3pm",
			input:        "tomorrow at 3pm",
			expectedHour: 15,
			expectedMin:  0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			results := en.Parse(tt.input, refDate, nil)

			if len(results) == 0 {
				t.Errorf("Expected result for '%s', but got none", tt.input)
				return
			}

			result := results[0]
			date := result.Start.Date()

			if date.Hour() != tt.expectedHour {
				t.Errorf("Hour mismatch for '%s': expected %d, got %d",
					tt.input, tt.expectedHour, date.Hour())
			}

			if date.Minute() != tt.expectedMin {
				t.Errorf("Minute mismatch for '%s': expected %d, got %d",
					tt.input, tt.expectedMin, date.Minute())
			}
		})
	}
}

// TestTimeUnitsAgo tests parsing of "X units ago" patterns
func TestTimeUnitsAgo(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name     string
		input    string
		expected time.Time
	}{
		{
			name:     "3 days ago",
			input:    "3 days ago",
			expected: time.Date(2024, 1, 12, 12, 0, 0, 0, time.UTC),
		},
		{
			name:     "2 weeks ago",
			input:    "2 weeks ago",
			expected: time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC),
		},
		{
			name:     "1 month ago",
			input:    "1 month ago",
			expected: time.Date(2023, 12, 15, 12, 0, 0, 0, time.UTC),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			results := en.Parse(tt.input, refDate, nil)

			if len(results) == 0 {
				t.Errorf("Expected result for '%s', but got none", tt.input)
				return
			}

			result := results[0]
			date := result.Start.Date()

			if !date.Equal(tt.expected) {
				t.Errorf("Date mismatch for '%s': expected %s, got %s",
					tt.input, tt.expected.Format("2006-01-02"), date.Format("2006-01-02"))
			}
		})
	}
}

// TestTimeUnitsLater tests parsing of "in X units" and "X units later" patterns
func TestTimeUnitsLater(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name     string
		input    string
		expected time.Time
	}{
		{
			name:     "In 3 days",
			input:    "in 3 days",
			expected: time.Date(2024, 1, 18, 12, 0, 0, 0, time.UTC),
		},
		{
			name:     "2 days later",
			input:    "2 days later",
			expected: time.Date(2024, 1, 17, 12, 0, 0, 0, time.UTC),
		},
		{
			name:     "3 weeks from now",
			input:    "3 weeks from now",
			expected: time.Date(2024, 2, 5, 12, 0, 0, 0, time.UTC),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			results := en.Parse(tt.input, refDate, nil)

			if len(results) == 0 {
				t.Errorf("Expected result for '%s', but got none", tt.input)
				return
			}

			result := results[0]
			date := result.Start.Date()

			if !date.Equal(tt.expected) {
				t.Errorf("Date mismatch for '%s': expected %s, got %s",
					tt.input, tt.expected.Format("2006-01-02"), date.Format("2006-01-02"))
			}
		})
	}
}
