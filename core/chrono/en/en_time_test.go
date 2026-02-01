package en

import (
	"testing"
	"time"

	"mzm/core/chrono"
)

func TestTime3PM(t *testing.T) {
	text := "at 3pm"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentHour) != 15 {
		t.Errorf("Expected hour 15, got %d", *result.Start.Get(chrono.ComponentHour))
	}
	if *result.Start.Get(chrono.ComponentMinute) != 0 {
		t.Errorf("Expected minute 0, got %d", *result.Start.Get(chrono.ComponentMinute))
	}
}

func TestTime1430(t *testing.T) {
	text := "14:30"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentHour) != 14 {
		t.Errorf("Expected hour 14, got %d", *result.Start.Get(chrono.ComponentHour))
	}
	if *result.Start.Get(chrono.ComponentMinute) != 30 {
		t.Errorf("Expected minute 30, got %d", *result.Start.Get(chrono.ComponentMinute))
	}
}

func TestTime9AM(t *testing.T) {
	text := "at 9:00 am"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	if *result.Start.Get(chrono.ComponentHour) != 9 {
		t.Errorf("Expected hour 9, got %d", *result.Start.Get(chrono.ComponentHour))
	}
	if *result.Start.Get(chrono.ComponentMinute) != 0 {
		t.Errorf("Expected minute 0, got %d", *result.Start.Get(chrono.ComponentMinute))
	}
}

func TestTime12AM(t *testing.T) {
	text := "12 am"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	// 12 AM should be 0 hours (midnight)
	if *result.Start.Get(chrono.ComponentHour) != 0 {
		t.Errorf("Expected hour 0, got %d", *result.Start.Get(chrono.ComponentHour))
	}
}

func TestTime12PM(t *testing.T) {
	text := "12 pm"
	refDate := time.Date(2012, 8, 10, 12, 0, 0, 0, time.UTC)
	
	results := Casual.Parse(text, refDate, nil)
	
	if len(results) != 1 {
		t.Fatalf("Expected 1 result, got %d", len(results))
	}
	
	result := results[0]
	// 12 PM should be 12 hours (noon)
	if *result.Start.Get(chrono.ComponentHour) != 12 {
		t.Errorf("Expected hour 12, got %d", *result.Start.Get(chrono.ComponentHour))
	}
}
