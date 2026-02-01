package main

import (
	"fmt"
	"time"

	"mzm/core/chrono/en"
)

func main() {
	// Parse various date formats
	examples := []string{
		"today",
		"tomorrow",
		"yesterday",
		"next Friday",
		"last Monday",
		"September 12",
		"Sep 12 2024",
		"3pm",
		"14:30",
		"Friday at 4pm",
		"2 days ago",
		"1 day ago",
		"day after tomorrow",
		"day after christmas",
	}

	fmt.Println("Chrono Go - Natural Language Date Parser")
	fmt.Println("========================================")
	fmt.Println()

	refDate := time.Now()
	fmt.Printf("Reference date: %s\n", refDate.Format("2006-01-02 15:04:05"))
	fmt.Println()

	for _, example := range examples {
		results := en.Parse(example, refDate, nil)

		fmt.Printf("Input: \"%s\"\n", example)
		if len(results) > 0 {
			for i, result := range results {
				fmt.Printf("  Result %d:\n", i+1)
				fmt.Printf("    Text: %s\n", result.Text)
				fmt.Printf("    Index: %d\n", result.Index)
				fmt.Printf("    Date: %s\n", result.Date().Format("2006-01-02 15:04:05"))

				if result.End != nil {
					fmt.Printf("    End Date: %s\n", result.End.Date().Format("2006-01-02 15:04:05"))
				}
			}
		} else {
			fmt.Println("  No results found")
		}
		fmt.Println()
	}

	// Example using ParseDate (returns first date only)
	fmt.Println()
	fmt.Println("Using ParseDate (returns first match only):")
	fmt.Println("-------------------------------------------")

	date := en.ParseDate("An appointment on Sep 12", refDate, nil)
	if date != nil {
		fmt.Printf("Input: \"An appointment on Sep 12\"\n")
		fmt.Printf("Date: %s\n", date.Format("2006-01-02 15:04:05"))
	}
}
