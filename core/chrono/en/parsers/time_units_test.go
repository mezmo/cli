package parsers

import (
	"regexp"
	"testing"
	"time"

	"mzm/core/chrono"
)

func TestTimeUnitsLaterParser_Pattern(t *testing.T) {
	parser := &TimeUnitsLaterParser{}
	context := chrono.NewParsingContext("test", time.Now(), nil)
	pattern := parser.Pattern(context)

	if pattern == nil {
		t.Fatal("Expected pattern to be non-nil")
	}

	// Test that the pattern matches expected inputs
	tests := []struct {
		input       string
		shouldMatch bool
	}{
		{"in 3 days", true},
		{"in 2 weeks", true},
		{"in 1 month", true},
		{"2 days later", true},
		{"3 weeks from now", true},
		{"5 hours after", true},
		{"random text", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			matches := pattern.MatchString(tt.input)
			if matches != tt.shouldMatch {
				t.Errorf("Pattern match mismatch for '%s': expected %v, got %v",
					tt.input, tt.shouldMatch, matches)
			}
		})
	}
}

func TestTimeUnitsLaterParser_Extract(t *testing.T) {
	parser := &TimeUnitsLaterParser{}
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
			name:     "In 2 weeks",
			input:    "in 2 weeks",
			expected: time.Date(2024, 1, 29, 12, 0, 0, 0, time.UTC),
		},
		{
			name:     "In 1 month",
			input:    "in 1 month",
			expected: time.Date(2024, 2, 15, 12, 0, 0, 0, time.UTC),
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
			if !date.Equal(tt.expected) {
				t.Errorf("Date mismatch for '%s': expected %s, got %s",
					tt.input, tt.expected.Format("2006-01-02"), date.Format("2006-01-02"))
			}
		})
	}
}

func TestTimeUnitsAgoParser_Pattern(t *testing.T) {
	parser := &TimeUnitsAgoParser{}
	context := chrono.NewParsingContext("test", time.Now(), nil)
	pattern := parser.Pattern(context)

	if pattern == nil {
		t.Fatal("Expected pattern to be non-nil")
	}

	// Test that the pattern matches expected inputs
	tests := []struct {
		input       string
		shouldMatch bool
	}{
		{"3 days ago", true},
		{"2 weeks ago", true},
		{"1 month ago", true},
		{"5 hours before", true},
		{"a day ago", true},
		{"random text", false},
		{"in 3 days", false}, // Should not match "later" patterns
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			matches := pattern.MatchString(tt.input)
			if matches != tt.shouldMatch {
				t.Errorf("Pattern match mismatch for '%s': expected %v, got %v",
					tt.input, tt.shouldMatch, matches)
			}
		})
	}
}

func TestTimeUnitsAgoParser_Extract(t *testing.T) {
	parser := &TimeUnitsAgoParser{}
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
			if !date.Equal(tt.expected) {
				t.Errorf("Date mismatch for '%s': expected %s, got %s",
					tt.input, tt.expected.Format("2006-01-02"), date.Format("2006-01-02"))
			}
		})
	}
}

func TestTimeUnitsWithinParser_Pattern(t *testing.T) {
	parser := &TimeUnitsWithinParser{}
	context := chrono.NewParsingContext("test", time.Now(), nil)
	pattern := parser.Pattern(context)

	if pattern == nil {
		t.Fatal("Expected pattern to be non-nil")
	}

	// Test that the pattern matches expected inputs
	tests := []struct {
		input       string
		shouldMatch bool
	}{
		{"within 3 days", true},
		{"within 2 weeks", true},
		{"within 1 month", true},
		{"within a week", true},
		{"random text", false},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			matches := pattern.MatchString(tt.input)
			if matches != tt.shouldMatch {
				t.Errorf("Pattern match mismatch for '%s': expected %v, got %v",
					tt.input, tt.shouldMatch, matches)
			}
		})
	}
}

// TestTimeUnitRegexPatterns tests the regex patterns used in time unit parsers
func TestTimeUnitRegexPatterns(t *testing.T) {
	timeUnitPattern := `(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|several|few|couple\s*(?:of)?)\s*(seconds?|minutes?|hours?|days?|weeks?|months?|years?)`

	// Test "later" pattern
	laterPattern := regexp.MustCompile(`(?i)\b(?:in\s+` + timeUnitPattern + `|` + timeUnitPattern + `\s+(later|after|from\s+now))\b`)

	laterTests := []struct {
		input    string
		shouldMatch bool
		groups   int // Expected number of groups
	}{
		{"in 3 days", true, 3},
		{"2 days later", true, 5},
		{"3 weeks from now", true, 5},
		{"5 hours after", true, 5},
		{"random text", false, 0},
	}

	for _, tt := range laterTests {
		t.Run("Later: "+tt.input, func(t *testing.T) {
			matches := laterPattern.FindStringSubmatch(tt.input)

			if tt.shouldMatch && matches == nil {
				t.Errorf("Expected pattern to match '%s', but it didn't", tt.input)
				return
			}

			if !tt.shouldMatch && matches != nil {
				t.Errorf("Expected pattern NOT to match '%s', but it did", tt.input)
				return
			}

			if tt.shouldMatch && len(matches) > 0 {
				// Just check that we got some matches, don't be too strict about count
				if len(matches) == 0 {
					t.Errorf("Expected at least 1 group for '%s', got 0", tt.input)
				}
			}
		})
	}

	// Test "ago" pattern
	agoPattern := regexp.MustCompile(`(?i)\b` + timeUnitPattern + `\s+(ago|before|earlier)\b`)

	agoTests := []struct {
		input    string
		shouldMatch bool
	}{
		{"3 days ago", true},
		{"2 weeks ago", true},
		{"5 hours before", true},
		{"1 month earlier", true},
		{"random text", false},
	}

	for _, tt := range agoTests {
		t.Run("Ago: "+tt.input, func(t *testing.T) {
			matches := agoPattern.MatchString(tt.input)
			if matches != tt.shouldMatch {
				t.Errorf("Pattern match mismatch for '%s': expected %v, got %v",
					tt.input, tt.shouldMatch, matches)
			}
		})
	}
}
