package logging

import (
	"fmt"
	"os"
	"time"

	"github.com/rs/zerolog"
)

type Logger struct {
	logger zerolog.Logger
}

var Default Logger = NewLogger("fatal", "default")

func SetLogLevel(lvl zerolog.Level) {
	Default.logger = Default.logger.Level(lvl)
}

func NewLogger(level string, command string) Logger {
	lvl, err := zerolog.ParseLevel(level)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	output := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	logger := zerolog.New(output).With().Str("command", command).Timestamp().Logger()

	return Logger{logger: logger.Level(lvl)}
}

// Print Wrapper method for generic debug
func (log *Logger) Print(format string, v ...interface{}) {
	log.logger.Debug().Msgf(format, v...)
}

// Trace outputs a log line at trace the level
func (log *Logger) Trace(format string, v ...interface{}) {
	log.logger.Trace().Msgf(format, v...)
}

// Error outputs a log line at trace the level
func (log *Logger) Error(format string, v ...interface{}) {
	log.logger.Error().Msgf(format, v...)
}
func (log *Logger) Info(format string, v ...interface{}) {
	log.logger.Info().Msgf(format, v...)
}

func (log *Logger) Debug(format string, v ...interface{}) {
	log.logger.Debug().Msgf(format, v...)
}

func (log *Logger) With() zerolog.Context {
	return log.logger.With()
}

func (log *Logger) Child(command string) Logger {
	sub := log.logger.With().Str("command", command).Logger()
	return Logger{logger: sub}
}
