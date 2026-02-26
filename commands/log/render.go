package log

import (
	JSON "encoding/json"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	style "github.com/phoenix-tui/phoenix/style"
)

var errorRegex = regexp.MustCompile(`(?i)err(?:or)?|crit(?:ical)?|fatal|severe|emerg(?:ency)?`)
var warnRegex = regexp.MustCompile(`(?i)warn(?:ing)?`)
var infoRegex = regexp.MustCompile(`(?i)info`)
var debugRegex = regexp.MustCompile(`(?i)debug`)
var traceRegex = regexp.MustCompile(`(?i)trace`)
var THEME = make(map[string]style.Style)
var dimStyle style.Style
var redStyle style.Style
var blueStyle style.Style
var grayStyle style.Style
var levelMap LevelMap

const TIME_FORMAT string = "Jan 02 15:04:05"
const LVL_TRACE = "trace"
const LVL_DEBUG = "debug"
const SPACE = " "

var center style.Alignment = style.NewAlignment(style.AlignCenter, style.AlignMiddle)
var defaultStyle style.Style = style.New().
	Foreground(style.RGB(108, 108, 108)).
	Padding(style.NewPadding(0, 1, 0, 1)).
	Width(10).
	MaxWidth(10).
	Align(center)

type StyleValue struct {
	Pattern *regexp.Regexp
	Style   style.Style
}

type LevelMap = []StyleValue

type Message struct {
	Host      string `json:"_host"`
	Timestamp uint64 `json:"_ts"`
	App       string `json:"_app"`
	Msg       string `json:"message,omitempty"`
	Line      string `json:"_line,omitempty"`
	Level     any    `json:"level"`
}

// levelToString safely converts a level field of any type to a string
func levelToString(level any) string {
	switch v := level.(type) {
	case string:
		return v
	case int:
		return strconv.Itoa(v)
	case int64:
		return strconv.FormatInt(v, 10)
	case float64:
		// JSON numbers are unmarshaled as float64 by default
		return strconv.FormatFloat(v, 'f', -1, 64)
	case fmt.Stringer:
		return v.String()
	default:
		// Fallback to sprintf for any other type
		return fmt.Sprintf("%v", v)
	}
}

func colorize(level string) string {
	for _, def := range levelMap {
		match := def.Pattern.MatchString(level)
		if match == true {
			return style.Render(def.Style, level)
		}
	}
	return style.Render(defaultStyle, level)
}

func text(message string, level string) string {
	if level == LVL_DEBUG || level == LVL_TRACE {
		return style.Render(dimStyle, message)
	}
	return message
}

// TODO(esatterwhite): replace struct based json codec
// with github.com/buger/jsonparser implementation
// to optimize performance and mimimize memory usage
func pprint(line Message, plain bool) string {
	var message string
	if line.Msg != "" {
		message = line.Msg
	} else {
		message = line.Line
	}

	if plain {
		output, err := JSON.Marshal(line)
		if err != nil {
			log.Fatalf("Unable to format log data for display: %s", err)
		}

		return string(output)

	}
	t := time.UnixMilli(int64(line.Timestamp))
	levelStr := levelToString(line.Level)
	return strings.Join([]string{
		style.Render(grayStyle, t.Format(TIME_FORMAT)),
		style.Render(redStyle, line.Host),
		style.Render(blueStyle, line.App),
		colorize(strings.ToLower(levelStr)),
		text(message, levelStr),
	}, SPACE)
}

func init() {
	colorRed := style.RGB(255, 95, 95)
	dimStyle = style.New().Foreground(style.Gray)
	redStyle = style.New().Foreground(colorRed)
	blueStyle = style.New().Foreground(style.RGB(0, 175, 215))
	grayStyle = style.New().Foreground(style.Color256(24))

	errorStyle := style.New().
		Foreground(style.White).
		Background(colorRed).
		Padding(style.NewPadding(0, 1, 0, 1)).
		Width(10).
		MaxWidth(10).
		Align(center)

	infoStyle := style.New().
		Foreground(style.Color256(155)).
		Background(style.RGB(88, 88, 88)).
		Padding(style.NewPadding(0, 1, 0, 1)).
		Width(10).
		MaxWidth(10).
		Align(center)

	traceStyle := style.New().
		Foreground(style.RGB(0, 95, 215)).
		Background(style.RGB(99, 99, 99)).
		Padding(style.NewPadding(0, 1, 0, 1)).
		Width(10).
		MaxWidth(10).
		Align(center)

	var debugStyle style.Style = defaultStyle

	warnStyle := style.New().
		Foreground(style.Black).
		Background(style.RGB(255, 215, 0)).
		Padding(style.NewPadding(0, 1, 0, 1)).
		Width(10).
		MaxWidth(10).
		Align(center)

	levelMap = LevelMap{
		StyleValue{
			Pattern: errorRegex,
			Style:   errorStyle,
		},
		StyleValue{
			Pattern: infoRegex,
			Style:   infoStyle,
		},
		StyleValue{
			Pattern: debugRegex,
			Style:   debugStyle,
		},
		StyleValue{
			Pattern: traceRegex,
			Style:   traceStyle,
		},
		StyleValue{
			Pattern: warnRegex,
			Style:   warnStyle,
		},
	}
}
