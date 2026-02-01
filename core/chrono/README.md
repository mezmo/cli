# Chrono Go

A natural language date parser in Go, ported from the TypeScript [chrono-node](https://github.com/wanasit/chrono) library.

## Overview

Chrono Go is designed to handle most date/time formats and extract information from any given text:

* _Today_, _Tomorrow_, _Yesterday_, _Last Friday_, etc
* _September 12-13_
* _Friday at 4pm_
* _3pm_, _14:30_
* _next Monday_
* _last week_

## Installation

```bash
# Navigate to the chrono-go directory
cd /path/to/chrono-go

# Run go mod tidy to ensure dependencies are set
go mod tidy
```

## Usage

### Basic Usage

```go
package main

import (
    "fmt"
    "time"

    "chrono/en"
)

func main() {
    // Parse a date string
    date := en.ParseDate("An appointment on Sep 12", time.Now(), nil)
    if date != nil {
        fmt.Println(date.Format("2006-01-02"))
    }

    // Parse and get all results
    results := en.Parse("Sep 12-13", time.Now(), nil)
    for _, result := range results {
        fmt.Printf("Found: %s at index %d\n", result.Text, result.Index)
        fmt.Printf("Start: %s\n", result.Start.Date().Format("2006-01-02"))
        if result.End != nil {
            fmt.Printf("End: %s\n", result.End.Date().Format("2006-01-02"))
        }
    }
}
```

### Using Reference Date

```go
// Parse relative to a specific date
refDate := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)
date := en.ParseDate("next Friday", refDate, nil)
```

### Using Parsing Options

```go
option := &chrono.ParsingOption{
    ForwardDate: true, // Only parse forward dates
}
results := en.Parse("Friday", time.Now(), option)
```

## Package Structure


```
chrono-go/              # Top-level directory (module: chrono)
├── go.mod              # Go module file (module chrono)
├── chrono.go           # Main Chrono engine
├── types.go            # Type definitions (Component, Weekday, etc.)
├── results.go          # ParsingComponents, ParsingResult
├── en/                 # English locale support
│   ├── en.go           # English configuration
│   ├── constants.go    # English constants and dictionaries
│   ├── parsers/        # English parsers
│   │   ├── casual.go   # Casual date parser (today, tomorrow, etc.)
│   │   ├── weekday.go  # Weekday parser (Monday, Friday, etc.)
│   │   ├── month.go    # Month name parser (September, Jan, etc.)
│   │   └── time.go     # Time expression parser (3pm, 14:30, etc.)
│   └── *_test.go       # Test files
├── common/             # Common utilities
│   └── references.go   # Casual reference utilities
└── examples/           # Example applications
    └── basic/
        └── main.go
        └── main.go
```

## Supported Formats

### Casual Dates
- today, tomorrow, yesterday
- tonight, last night
- next Friday, last Monday
- this week, last week

### Month Names
- September 12
- Sep 12, 2024
- January 1st

### Time Expressions
- 3pm, 14:30
- at 9:00
- 3:30pm

### Weekdays
- Friday
- next Monday
- last Tuesday

## API Reference

### Main Functions

#### `en.Parse(text string, ref interface{}, option *ParsingOption) []*ParsedResult`
Parses the text and returns all found date/time references.

#### `en.ParseDate(text string, ref interface{}, option *ParsingOption) *time.Time`
Parses the text and returns the first date found (or nil if none found).

### Types

#### `ParsedResult`
```go
type ParsedResult struct {
    RefDate   time.Time          // Reference date used for parsing
    Index     int                // Position in the input text
    Text      string             // Matched text
    Start     *ParsingComponents // Start date/time components
    End       *ParsingComponents // End date/time components (for ranges)
}
```

#### `ParsingComponents`
```go
type ParsingComponents struct {
    // Methods:
    Get(component Component) *int
    IsCertain(component Component) bool
    Date() time.Time
}
```

#### `ParsingOption`
```go
type ParsingOption struct {
    ForwardDate bool                   // Only parse forward dates
    Timezones   map[string]interface{} // Custom timezone mappings
    Debug       bool                   // Enable debug output
}
```

## Differences from TypeScript Version

This Go port focuses on the English locale and core functionality. Key differences:

1. **English Only**: Only English locale is implemented (other locales from the original are omitted)
2. **Simplified**: Some advanced parsers and refiners are simplified or omitted
3. **Go Idioms**: Uses Go conventions (e.g., `*time.Time` instead of nullable Date, error handling)
4. **Package Structure**: Organized as Go modules with proper package structure

## Examples

See the [examples](./examples/) directory for complete examples:

```bash
cd examples/basic
go run main.go
```

## Contributing

Contributions are welcome! This is a port of the TypeScript chrono library. If you'd like to add more parsers, refiners, or features, please submit a pull request.

## License

This project maintains the same license as the original chrono-node library.

## Credits

This is a Go port of [chrono-node](https://github.com/wanasit/chrono) by Wanasit Tanakitrungruang.

