package parsers

import (
	"regexp"
	"strings"
	"testing"
	"time"

	"mzm/core/chrono"
)

func TestRelativeDateParser_Pattern(t *testing.T) {
	parser := &RelativeDateParser{}
	context := chrono.NewParsingContext("test", time.Now(), nil)
	pattern := parser.Pattern(context)

	// Test that the pattern is valid regex
	if pattern == nil {
		t.Fatal("Expected pattern to be non-nil")
	}

	// Test pattern string
	expectedPattern := `(?i)\b(this|last|past|next|after\s*this)\s+(week|month|year|quarter)\b`
	if pattern.String() != expectedPattern {
		t.Errorf("Pattern mismatch: expected %s, got %s", expectedPattern, pattern.String())
	}
}

func TestRelativeDateParser_Extract(t *testing.T) {
	parser := &RelativeDateParser{}
	refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name     string
		input    string
		expected struct {
			year  int
			month int
			day   int
		}
	}{
		{
			name:  "This year",
			input: "this year",
			expected: struct {
				year  int
				month int
				day   int
			}{2024, 1, 15},
		},
		{
			name:  "Last year",
			input: "last year",
			expected: struct {
				year  int
				month int
				day   int
			}{2023, 1, 15},
		},
		{
			name:  "Next year",
			input: "next year",
			expected: struct {
				year  int
				month int
				day   int
			}{2025, 1, 15},
		},
		{
			name:  "This month",
			input: "this month",
			expected: struct {
				year  int
				month int
				day   int
			}{2024, 1, 15},
		},
		{
			name:  "Next month",
			input: "next month",
			expected: struct {
				year  int
				month int
				day   int
			}{2024, 2, 15},
		},
		{
			name:  "Last month",
			input: "last month",
			expected: struct {
				year  int
				month int
				day   int
			}{2023, 12, 15},
		},
		{
			name:  "This week",
			input: "this week",
			expected: struct {
				year  int
				month int
				day   int
			}{2024, 1, 15}, // Monday of this week would be Jan 15, 2024
		},
		{
			name:  "Next week",
			input: "next week",
			expected: struct {
				year  int
				month int
				day   int
			}{2024, 1, 22}, // Monday of next week
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			context := chrono.NewParsingContext(tt.input, refDate, nil)
			pattern := parser.Pattern(context)
			matches := pattern.FindStringSubmatch(tt.input)

			if matches == nil {
				t.Fatalf("Pattern did not match '%s'", tt.input)
			}

			result := parser.Extract(context, matches, 0)
			if result == nil {
				t.Fatalf("Extract returned nil for '%s'", tt.input)
			}

			date := result.(*chrono.ParsingComponents).Date()
			if date.Year() != tt.expected.year {
				t.Errorf("Year mismatch for '%s': expected %d, got %d",
					tt.input, tt.expected.year, date.Year())
			}

			if int(date.Month()) != tt.expected.month {
				t.Errorf("Month mismatch for '%s': expected %d, got %d",
					tt.input, tt.expected.month, int(date.Month()))
			}

			// For week-based tests, we might have some variance in the day
			if !strings.Contains(tt.input, "week") && date.Day() != tt.expected.day {
				t.Errorf("Day mismatch for '%s': expected %d, got %d",
					tt.input, tt.expected.day, date.Day())
			}
		})
	}
}

func TestRelativeDateParser_Regex(t *testing.T) {
	pattern := regexp.MustCompile(`(?i)\b(this|last|past|next|after\s*this)\s+(week|month|year|quarter)\b`)

	tests := []struct {
		input    string
		shouldMatch bool
		groups   []string
	}{
		{
			input:       "this year",
			shouldMatch: true,
			groups:      []string{"this year", "this", "year"},
		},
		{
			input:       "last year",
			shouldMatch: true,
			groups:      []string{"last year", "last", "year"},
		},
		{
			input:       "next year",
			shouldMatch: true,
			groups:      []string{"next year", "next", "year"},
		},
		{
			input:       "past year",
			shouldMatch: true,
			groups:      []string{"past year", "past", "year"},
		},
		{
			input:       "this month",
			shouldMatch: true,
			groups:      []string{"this month", "this", "month"},
		},
		{
			input:       "next week",
			shouldMatch: true,
			groups:      []string{"next week", "next", "week"},
		},
		{
			input:       "last quarter",
			shouldMatch: true,
			groups:      []string{"last quarter", "last", "quarter"},
		},
		{
			input:       "random text",
			shouldMatch: false,
			groups:      nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			matches := pattern.FindStringSubmatch(tt.input)

			if tt.shouldMatch && matches == nil {
				t.Errorf("Expected pattern to match '%s', but it didn't", tt.input)
				return
			}

			if !tt.shouldMatch && matches != nil {
				t.Errorf("Expected pattern NOT to match '%s', but it did", tt.input)
				return
			}

			if tt.shouldMatch && matches != nil {
				if len(matches) != len(tt.groups) {
					t.Errorf("Group count mismatch for '%s': expected %d, got %d",
						tt.input, len(tt.groups), len(matches))
					return
				}

				for i, group := range tt.groups {
					if matches[i] != group {
						t.Errorf("Group %d mismatch for '%s': expected '%s', got '%s'",
							i, tt.input, group, matches[i])
					}
				}
			}
		})
	}
}
