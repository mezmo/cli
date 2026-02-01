package en

import (
	"testing"
	"time"
)

// Test slash date formats
func TestSlashDateParser(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text     string
		expected time.Time
	}{
		{"12/25/2024", time.Date(2024, 12, 25, 12, 0, 0, 0, time.UTC)},
		{"3/15/2024", time.Date(2024, 3, 15, 12, 0, 0, 0, time.UTC)},
		{"1/1/2025", time.Date(2025, 1, 1, 12, 0, 0, 0, time.UTC)},
		{"12-25-2024", time.Date(2024, 12, 25, 12, 0, 0, 0, time.UTC)},
		{"12.25.2024", time.Date(2024, 12, 25, 12, 0, 0, 0, time.UTC)},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()
		expectedDate := test.expected

		if !actualDate.Equal(expectedDate) {
			t.Errorf("For '%s': expected %v, got %v", test.text, expectedDate, actualDate)
		}
	}
}

// Test ISO date formats (YYYY-MM-DD)
func TestYearMonthDayParser(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text     string
		expected time.Time
	}{
		{"2024-12-25", time.Date(2024, 12, 25, 12, 0, 0, 0, time.UTC)},
		{"2024/03/15", time.Date(2024, 3, 15, 12, 0, 0, 0, time.UTC)},
		{"2025-01-01", time.Date(2025, 1, 1, 12, 0, 0, 0, time.UTC)},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()
		expectedDate := test.expected

		if !actualDate.Equal(expectedDate) {
			t.Errorf("For '%s': expected %v, got %v", test.text, expectedDate, actualDate)
		}
	}
}

// Test relative date expressions
func TestRelativeDateParser(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text         string
		expectedYear int
		expectedMonth int
	}{
		{"next month", 2024, 2},
		{"last month", 2023, 12},
		{"this year", 2024, 1},
		{"next year", 2025, 1},
		{"last year", 2023, 1},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()

		if actualDate.Year() != test.expectedYear || int(actualDate.Month()) != test.expectedMonth {
			t.Errorf("For '%s': expected %d-%02d, got %d-%02d",
				test.text, test.expectedYear, test.expectedMonth,
				actualDate.Year(), actualDate.Month())
		}
	}
}

// Test time units ago expressions
func TestTimeUnitsAgoParser(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text     string
		expected time.Time
	}{
		{"3 days ago", time.Date(2024, 1, 12, 12, 0, 0, 0, time.UTC)},
		{"2 weeks ago", time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)},
		{"1 month ago", time.Date(2023, 12, 15, 12, 0, 0, 0, time.UTC)},
		{"a year ago", time.Date(2023, 1, 15, 12, 0, 0, 0, time.UTC)},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()
		expectedDate := test.expected

		if !actualDate.Equal(expectedDate) {
			t.Errorf("For '%s': expected %v, got %v", test.text, expectedDate, actualDate)
		}
	}
}

// Test time units later expressions
func TestTimeUnitsLaterParser(t *testing.T) {
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		text     string
		expected time.Time
	}{
		{"in 3 days", time.Date(2024, 1, 18, 12, 0, 0, 0, time.UTC)},
		{"in 2 weeks", time.Date(2024, 1, 29, 12, 0, 0, 0, time.UTC)},
		{"in 1 month", time.Date(2024, 2, 15, 12, 0, 0, 0, time.UTC)},
		{"in a year", time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)},
		{"2 days later", time.Date(2024, 1, 17, 12, 0, 0, 0, time.UTC)},
	}

	for _, test := range tests {
		results := Parse(test.text, refDate, nil)
		if len(results) == 0 {
			t.Errorf("Failed to parse '%s'", test.text)
			continue
		}

		result := results[0]
		actualDate := result.Start.Date()
		expectedDate := test.expected

		if !actualDate.Equal(expectedDate) {
			t.Errorf("For '%s': expected %v, got %v", test.text, expectedDate, actualDate)
		}
	}
}
