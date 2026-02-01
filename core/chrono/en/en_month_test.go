package en

import (
	"testing"
	"time"

	"mzm/core/chrono"
)

func TestMonthNameSeptember(t *testing.T) {
	text := "September 12"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Text != "September 12" {
		t.Errorf("Expected text 'September 12', got '%s'", result.Text)
	}
	
	if *result.Start.Get(chrono.ComponentMonth) != 9 {
		t.Errorf("Expected month 9, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 12 {
		t.Errorf("Expected day 12, got %d", *result.Start.Get(chrono.ComponentDay))
	}
}

func TestMonthNameWithYear(t *testing.T) {
	text := "Sep 12, 2024"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentMonth) != 9 {
		t.Errorf("Expected month 9, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 12 {
		t.Errorf("Expected day 12, got %d", *result.Start.Get(chrono.ComponentDay))
	}
	if *result.Start.Get(chrono.ComponentYear) != 2024 {
		t.Errorf("Expected year 2024, got %d", *result.Start.Get(chrono.ComponentYear))
	}
}

func TestMonthNameJanuary1st(t *testing.T) {
	text := "January 1st"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentMonth) != 1 {
		t.Errorf("Expected month 1, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 1 {
		t.Errorf("Expected day 1, got %d", *result.Start.Get(chrono.ComponentDay))
	}
}

func TestMonthNameDecember(t *testing.T) {
	text := "December"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentMonth) != 12 {
		t.Errorf("Expected month 12, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
}
