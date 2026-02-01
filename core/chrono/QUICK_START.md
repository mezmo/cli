# Quick Start Guide

## Installation

```bash
# Clone or copy the chrono-go directory to your project
cd /path/to/your/project
```

## Basic Usage

```go
package main

import (
    "fmt"
    "time"
    
    "chrono/en"
)

func main() {
    // Parse a single date (returns first match)
    date := en.ParseDate("An appointment on Sep 12", time.Now(), nil)
    if date != nil {
        fmt.Println(date.Format("2006-01-02"))
    }
    
    // Parse all dates in text
    results := en.Parse("Sep 12-13", time.Now(), nil)
    for _, result := range results {
        fmt.Printf("Found: %s\n", result.Text)
        fmt.Printf("Date: %s\n", result.Start.Date())
    }
}
```

## Running Tests

```bash
cd chrono-go
go test -v ./...
```

## Running Example

```bash
cd chrono-go
go run examples/basic/main.go
```

## Supported Formats

- **Casual**: today, tomorrow, yesterday, tonight
- **Weekdays**: Monday, next Friday, last Tuesday
- **Months**: September 12, Jan 1st, Dec 2024
- **Times**: 3pm, 14:30, at 9am

## Module Structure

```
Module: chrono
Import: "chrono/en"
```

## Documentation

- `README.md` - Full documentation
- `MIGRATION.md` - Migration from old structure
- `STRUCTURE.md` - File structure details
- `IMPLEMENTATION.md` - Implementation details
