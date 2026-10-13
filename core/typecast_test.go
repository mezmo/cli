package core

import (
	"reflect"
	"testing"
)

func TestTypecast(t *testing.T) {
	cases := []struct {
		in   string
		want any
	}{
		{"foo", "foo"},
		{"true", true},
		{"false", false},
		{"123", 123.0},
		{"123.45", 123.45},
		{"-5", -5.0},
		{"null", nil},
		{"undefined", nil},
		{"", ""},
		{"Infinity", "Infinity"},
		{"NaN", "NaN"},
		{"1e999", "1e999"},
		{"DEBUG", "DEBUG"},
	}
	for _, c := range cases {
		if got := Typecast(c.in); !reflect.DeepEqual(got, c.want) {
			t.Errorf("Typecast(%q) = %#v, want %#v", c.in, got, c.want)
		}
	}
}
