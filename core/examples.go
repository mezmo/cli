package core

import (
	"github.com/phoenix-tui/phoenix/layout"
)

type Example struct {
	Description string
	Example     string
}

type ExampleRender struct {
	examples []Example
}

func NewExampleRenderer() *ExampleRender {
	render := ExampleRender{}
	return &render
}
func (example *ExampleRender) Example(desc string, detail string) *ExampleRender {
	example.examples = append(example.examples, Example{
		Description: desc,
		Example:     detail,
	})

	return example
}

// Render creates a two-column layout for command examples.
//
// Visual representation of the layout:
//
// ┌──────────────────────────────────────────────────────────────────┐
// │ Column (vertical container)                                      │
// │                                                                  │
// │  ┌────────────────────────────────────────────────────────────┐  │
// │  │ Row 1                                                      │  │
// │  │  ┌─────────────┐   ┌────────────────────────────────────┐  │  │
// │  │  │ description:│   │ example command text               │  │  │
// │  │  └─────────────┘   └────────────────────────────────────┘  │  │
// │  │  ↑             ↑   ↑                                       │  │
// │  │  │             │   └─ Example box (variable width)         │  │
// │  │  │             └───── Gap (3 spaces)                       │  │
// │  │  └─────────────────── Description box (fixed width)        │  │
// │  └────────────────────────────────────────────────────────────┘  │
// │  ↑                                                               │
// │  └─ Left margin (2 spaces)                                       │
// └──────────────────────────────────────────────────────────────────┘
func (example *ExampleRender) Render() string {
	if len(example.examples) == 0 {
		return ""
	}

	// Calculate the maximum width needed for descriptions and examples
	maxDescWidth := 0
	maxExampleWidth := 0
	for _, ex := range example.examples {
		descWidth := len(ex.Description) + 1 // +1 for the colon
		if descWidth > maxDescWidth {
			maxDescWidth = descWidth
		}

		exampleWidth := len(ex.Example)
		if exampleWidth > maxExampleWidth {
			maxExampleWidth = exampleWidth
		}
	}

	// Compute the total max width based on content
	const leftMargin = 2 // indent
	const gap = 3        // gap between columns
	maxWidth := leftMargin + maxDescWidth + gap + maxExampleWidth

	mainColumn := layout.Column()

	for _, ex := range example.examples {
		descText := ex.Description + ":"

		exampleWidth := maxWidth - maxDescWidth - gap - leftMargin

		row := layout.Row().
			Width(maxWidth - leftMargin).
			Gap(gap).
			JustifyStart().
			AlignStart().
			Add(layout.NewBox(descText).Width(maxDescWidth)).
			Add(layout.NewBox(ex.Example).Width(exampleWidth))

		rowBox := layout.NewBox(row.Render(maxWidth-leftMargin, 1)).MarginAll(0).Margin(0, 0, 0, leftMargin)
		mainColumn = mainColumn.Add(rowBox)
	}

	return mainColumn.Render(maxWidth, len(example.examples))
}
