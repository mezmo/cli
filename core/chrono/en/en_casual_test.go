package en

import (
	"testing"
	"time"

	"mzm/core/chrono"
)

func TestCasualNow(t *testing.T) {
	text := "The Deadline is now"
	refDate := time.Date(2012, 8, 10, 8, 9, 10, 11000000, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 16 {
		t.Errorf("Expected index 16, got %d", result.Index)
	}
	if result.Text != "now" {
		t.Errorf("Expected text 'now', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 10 {
		t.Errorf("Expected day 10, got %d", *result.Start.Get(chrono.ComponentDay))
	}
	if *result.Start.Get(chrono.ComponentHour) != 8 {
		t.Errorf("Expected hour 8, got %d", *result.Start.Get(chrono.ComponentHour))
	}
	if *result.Start.Get(chrono.ComponentMinute) != 9 {
		t.Errorf("Expected minute 9, got %d", *result.Start.Get(chrono.ComponentMinute))
	}
	if *result.Start.Get(chrono.ComponentSecond) != 10 {
		t.Errorf("Expected second 10, got %d", *result.Start.Get(chrono.ComponentSecond))
	}
}

func TestCasualToday(t *testing.T) {
	text := "The Deadline is today"
	refDate := time.Date(2012, 8, 10, 14, 12, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 16 {
		t.Errorf("Expected index 16, got %d", result.Index)
	}
	if result.Text != "today" {
		t.Errorf("Expected text 'today', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 10 {
		t.Errorf("Expected day 10, got %d", *result.Start.Get(chrono.ComponentDay))
	}
}

func TestCasualTomorrow(t *testing.T) {
	text := "The Deadline is Tomorrow"
	refDate := time.Date(2012, 8, 10, 17, 10, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 16 {
		t.Errorf("Expected index 16, got %d", result.Index)
	}
	if result.Text != "Tomorrow" {
		t.Errorf("Expected text 'Tomorrow', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 11 {
		t.Errorf("Expected day 11, got %d", *result.Start.Get(chrono.ComponentDay))
	}
}

func TestCasualYesterday(t *testing.T) {
	text := "The Deadline was yesterday"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 17 {
		t.Errorf("Expected index 17, got %d", result.Index)
	}
	if result.Text != "yesterday" {
		t.Errorf("Expected text 'yesterday', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 9 {
		t.Errorf("Expected day 9, got %d", *result.Start.Get(chrono.ComponentDay))
	}
}

func TestCasualLastNight(t *testing.T) {
	text := "The Deadline was last night "
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 17 {
		t.Errorf("Expected index 17, got %d", result.Index)
	}
	if result.Text != "last night" {
		t.Errorf("Expected text 'last night', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 9 {
		t.Errorf("Expected day 9, got %d", *result.Start.Get(chrono.ComponentDay))
	}
	if *result.Start.Get(chrono.ComponentHour) != 0 {
		t.Errorf("Expected hour 0, got %d", *result.Start.Get(chrono.ComponentHour))
	}
}

func TestCasualThisMorning(t *testing.T) {
	text := "The Deadline was this morning "
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if result.Index != 17 {
		t.Errorf("Expected index 17, got %d", result.Index)
	}
	if result.Text != "this morning" {
		t.Errorf("Expected text 'this morning', got '%s'", result.Text)
	}
	
	if result.Start == nil {
		t.Fatal("Expected start to be non-nil")
	}
	
	if *result.Start.Get(chrono.ComponentYear) != 2012 {
		t.Errorf("Expected year 2012, got %d", *result.Start.Get(chrono.ComponentYear))
	}
	if *result.Start.Get(chrono.ComponentMonth) != 8 {
		t.Errorf("Expected month 8, got %d", *result.Start.Get(chrono.ComponentMonth))
	}
	if *result.Start.Get(chrono.ComponentDay) != 10 {
		t.Errorf("Expected day 10, got %d", *result.Start.Get(chrono.ComponentDay))
	}
	if *result.Start.Get(chrono.ComponentHour) != 6 {
		t.Errorf("Expected hour 6, got %d", *result.Start.Get(chrono.ComponentHour))
	}
}
