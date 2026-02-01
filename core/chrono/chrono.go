package chrono

import (
	"regexp"
	"sort"
	"time"
)

// Configuration holds parsers and refiners
type Configuration struct {
	Parsers  []Parser
	Refiners []Refiner
}

// Parser interface for date/time parsers
type Parser interface {
	Pattern(context *ParsingContext) *regexp.Regexp
	Extract(context *ParsingContext, match []string, matchIndex int) interface{}
}

// Refiner interface for result refinement
type Refiner interface {
	Refine(context *ParsingContext, results []*ParsedResult) []*ParsedResult
}

// ParsingContext holds parsing state
type ParsingContext struct {
	Text      string
	Option    *ParsingOption
	Reference *ReferenceWithTimezone
	RefDate   time.Time // deprecated, use Reference.Instant
}

// NewParsingContext creates a new parsing context
func NewParsingContext(text string, refDate interface{}, option *ParsingOption) *ParsingContext {
	if option == nil {
		option = &ParsingOption{}
	}

	var reference *ReferenceWithTimezone
	switch v := refDate.(type) {
	case time.Time:
		reference = FromDate(v)
	case *time.Time:
		if v != nil {
			reference = FromDate(*v)
		} else {
			reference = FromInput(nil, option.Timezones)
		}
	case ParsingReference:
		reference = FromInput(v, option.Timezones)
	case *ParsingReference:
		if v != nil {
			reference = FromInput(*v, option.Timezones)
		} else {
			reference = FromInput(nil, option.Timezones)
		}
	default:
		reference = FromInput(nil, option.Timezones)
	}

	return &ParsingContext{
		Text:      text,
		Option:    option,
		Reference: reference,
		RefDate:   reference.Instant,
	}
}

// CreateParsingComponents creates new parsing components
func (ctx *ParsingContext) CreateParsingComponents(components map[Component]int) *ParsingComponents {
	return NewParsingComponents(ctx.Reference, components)
}

// CreateParsingResult creates a new parsing result
func (ctx *ParsingContext) CreateParsingResult(index int, text string, start map[Component]int, end map[Component]int) *ParsedResult {
	var startComponents *ParsingComponents
	var endComponents *ParsingComponents

	if start != nil {
		startComponents = ctx.CreateParsingComponents(start)
	}
	if end != nil {
		endComponents = ctx.CreateParsingComponents(end)
	}

	return &ParsedResult{
		RefDate:   ctx.Reference.Instant,
		Index:     index,
		Text:      text,
		Start:     startComponents,
		End:       endComponents,
		reference: ctx.Reference,
	}
}

// Chrono is the main parsing engine
type Chrono struct {
	Parsers  []Parser
	Refiners []Refiner
}

// NewChrono creates a new Chrono instance
func NewChrono(configuration *Configuration) *Chrono {
	if configuration == nil {
		configuration = &Configuration{
			Parsers:  []Parser{},
			Refiners: []Refiner{},
		}
	}

	return &Chrono{
		Parsers:  configuration.Parsers,
		Refiners: configuration.Refiners,
	}
}

// Clone creates a shallow copy of the Chrono instance
func (c *Chrono) Clone() *Chrono {
	parsers := make([]Parser, len(c.Parsers))
	copy(parsers, c.Parsers)

	refiners := make([]Refiner, len(c.Refiners))
	copy(refiners, c.Refiners)

	return &Chrono{
		Parsers:  parsers,
		Refiners: refiners,
	}
}

// ParseDate is a shortcut for Parse that returns the first date
func (c *Chrono) ParseDate(text string, referenceDate interface{}, option *ParsingOption) *time.Time {
	results := c.Parse(text, referenceDate, option)
	if len(results) > 0 {
		date := results[0].Start.Date()
		return &date
	}
	return nil
}

// Parse parses the text and returns all found results
func (c *Chrono) Parse(text string, referenceDate interface{}, option *ParsingOption) []*ParsedResult {
	context := NewParsingContext(text, referenceDate, option)

	results := make([]*ParsedResult, 0)

	// Execute all parsers
	for _, parser := range c.Parsers {
		parsedResults := executeParser(context, parser)
		results = append(results, parsedResults...)
	}

	// Sort by index
	sort.Slice(results, func(i, j int) bool {
		return results[i].Index < results[j].Index
	})

	// Apply refiners
	for _, refiner := range c.Refiners {
		results = refiner.Refine(context, results)
	}

	return results
}

func executeParser(context *ParsingContext, parser Parser) []*ParsedResult {
	results := make([]*ParsedResult, 0)
	pattern := parser.Pattern(context)

	originalText := context.Text
	remainingText := context.Text
	offset := 0

	for {
		matches := pattern.FindStringSubmatchIndex(remainingText)
		if matches == nil {
			break
		}

		matchIndex := matches[0] + offset
		matchText := remainingText[matches[0]:matches[1]]

		// Extract match groups
		groups := make([]string, 0)
		for i := 0; i < len(matches); i += 2 {
			if matches[i] >= 0 {
				groups = append(groups, remainingText[matches[i]:matches[i+1]])
			} else {
				groups = append(groups, "")
			}
		}

		result := parser.Extract(context, groups, matchIndex)
		if result != nil {
		} else {
		}
		if result == nil {
			// Move forward by 1 character
			offset += matches[0] + 1
			remainingText = originalText[offset:]
			continue
		}

		var parsedResult *ParsedResult

		switch v := result.(type) {
		case *ParsedResult:
			parsedResult = v
		case *ParsingComponents:
			parsedResult = context.CreateParsingResult(matchIndex, matchText, nil, nil)
			parsedResult.Start = v
		case map[Component]int:
			parsedResult = context.CreateParsingResult(matchIndex, matchText, v, nil)
		default:
			// Skip invalid results
			offset += matches[0] + 1
			remainingText = originalText[offset:]
			continue
		}

		results = append(results, parsedResult)

		// Move past this match
		offset += matches[1]
		remainingText = originalText[offset:]
	}

	return results
}