package log

import (
	JSON "encoding/json"
	"log"
	"regexp"
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
	Level     string `json:"level"`
}

func colorize(level string) string {
	for _, def := range levelMap {
		match := def.Pattern.MatchString(level)
		if match == true {
			return style.Render(def.Style, level)
		}
	}
	return level
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
	if line.Line != "" {
		message = line.Line
	} else {
		message = line.Msg
	}

	if plain {
		output, err := JSON.Marshal(line)
		if err != nil {
			log.Fatalf("Unable to format log data for display: %s", err)
		}

		return string(output)

	}
	t := time.UnixMilli(int64(line.Timestamp))
	return strings.Join([]string{
		style.Render(grayStyle, t.Format(TIME_FORMAT)),
		style.Render(redStyle, line.Host),
		style.Render(blueStyle, line.App),
		colorize(strings.ToLower(line.Level)),
		text(message, line.Level),
	}, SPACE)
}

func init() {
	colorRed := style.RGB(255, 95, 95)
	dimStyle = style.New().Foreground(style.Gray)
	redStyle = style.New().Foreground(colorRed)
	blueStyle = style.New().Foreground(style.RGB(0, 175, 215))
	grayStyle = style.New().Foreground(style.Color256(24))

	center := style.NewAlignment(style.AlignCenter, style.AlignMiddle)

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

	debugStyle := style.New().
		Foreground(style.RGB(108, 108, 108)).
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
