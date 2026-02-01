package chrono

import "time"

// ReferenceWithTimezone holds a reference instant and timezone
type ReferenceWithTimezone struct {
	Instant        time.Time
	TimezoneOffset *int // offset in minutes, nil means use system timezone
}

// NewReferenceWithTimezone creates a new reference with timezone
func NewReferenceWithTimezone(instant *time.Time, timezoneOffset *int) *ReferenceWithTimezone {
	if instant == nil {
		now := time.Now()
		instant = &now
	}
	return &ReferenceWithTimezone{
		Instant:        *instant,
		TimezoneOffset: timezoneOffset,
	}
}

// FromDate creates a reference from a date
func FromDate(date time.Time) *ReferenceWithTimezone {
	return &ReferenceWithTimezone{
		Instant:        date,
		TimezoneOffset: nil,
	}
}

// FromInput creates a reference from ParsingReference or time.Time
func FromInput(input interface{}, timezoneOverrides map[string]interface{}) *ReferenceWithTimezone {
	if input == nil {
		return NewReferenceWithTimezone(nil, nil)
	}

	switch v := input.(type) {
	case time.Time:
		return FromDate(v)
	case *time.Time:
		return FromDate(*v)
	case ParsingReference:
		instant := v.Instant
		if instant == nil {
			now := time.Now()
			instant = &now
		}
		var offset *int
		if v.Timezone != nil {
			offset = toTimezoneOffset(v.Timezone, *instant, timezoneOverrides)
		}
		return NewReferenceWithTimezone(instant, offset)
	default:
		return NewReferenceWithTimezone(nil, nil)
	}
}

// GetDateWithAdjustedTimezone returns a date adjusted for the reference timezone
func (r *ReferenceWithTimezone) GetDateWithAdjustedTimezone() time.Time {
	date := r.Instant
	if r.TimezoneOffset != nil {
		adjustment := r.GetSystemTimezoneAdjustmentMinute(&date, nil)
		date = date.Add(time.Duration(-adjustment) * time.Minute)
	}
	return date
}

// GetSystemTimezoneAdjustmentMinute returns minutes difference between system and reference timezone
func (r *ReferenceWithTimezone) GetSystemTimezoneAdjustmentMinute(date *time.Time, overrideTimezoneOffset *int) int {
	if date == nil {
		now := time.Now()
		date = &now
	}

	_, currentOffset := date.Zone()
	currentTimezoneOffset := -currentOffset / 60

	targetTimezoneOffset := currentTimezoneOffset
	if overrideTimezoneOffset != nil {
		targetTimezoneOffset = *overrideTimezoneOffset
	} else if r.TimezoneOffset != nil {
		targetTimezoneOffset = *r.TimezoneOffset
	}

	return currentTimezoneOffset - targetTimezoneOffset
}

// GetTimezoneOffset returns the timezone offset in minutes
func (r *ReferenceWithTimezone) GetTimezoneOffset() int {
	if r.TimezoneOffset != nil {
		return *r.TimezoneOffset
	}
	_, offset := r.Instant.Zone()
	return -offset / 60
}

// ParsingComponents holds parsed date/time components
type ParsingComponents struct {
	knownValues   map[Component]int
	impliedValues map[Component]int
	reference     *ReferenceWithTimezone
	tags          map[string]bool
}

// NewParsingComponents creates a new ParsingComponents
func NewParsingComponents(reference *ReferenceWithTimezone, knownComponents map[Component]int) *ParsingComponents {
	pc := &ParsingComponents{
		knownValues:   make(map[Component]int),
		impliedValues: make(map[Component]int),
		reference:     reference,
		tags:          make(map[string]bool),
	}

	if knownComponents != nil {
		for k, v := range knownComponents {
			pc.knownValues[k] = v
		}
	}

	// Set default implied values
	date := reference.GetDateWithAdjustedTimezone()
	pc.Imply(ComponentDay, date.Day())
	pc.Imply(ComponentMonth, int(date.Month()))
	pc.Imply(ComponentYear, date.Year())
	pc.Imply(ComponentHour, 12)
	pc.Imply(ComponentMinute, 0)
	pc.Imply(ComponentSecond, 0)
	pc.Imply(ComponentMillisecond, 0)

	return pc
}

// Get returns the value of a component (either certain or implied)
func (pc *ParsingComponents) Get(component Component) *int {
	if val, ok := pc.knownValues[component]; ok {
		return &val
	}
	if val, ok := pc.impliedValues[component]; ok {
		return &val
	}
	return nil
}

// IsCertain returns true if the component is certain (known)
func (pc *ParsingComponents) IsCertain(component Component) bool {
	_, ok := pc.knownValues[component]
	return ok
}

// GetCertainComponents returns all certain components
func (pc *ParsingComponents) GetCertainComponents() []Component {
	components := make([]Component, 0, len(pc.knownValues))
	for k := range pc.knownValues {
		components = append(components, k)
	}
	return components
}

// Imply sets an implied value for a component
func (pc *ParsingComponents) Imply(component Component, value int) *ParsingComponents {
	if _, ok := pc.knownValues[component]; !ok {
		pc.impliedValues[component] = value
	}
	return pc
}

// Assign sets a certain value for a component
func (pc *ParsingComponents) Assign(component Component, value int) *ParsingComponents {
	pc.knownValues[component] = value
	delete(pc.impliedValues, component)
	return pc
}

// Delete removes components
func (pc *ParsingComponents) Delete(components ...Component) {
	for _, component := range components {
		delete(pc.knownValues, component)
		delete(pc.impliedValues, component)
	}
}

// Clone creates a deep copy of the components
func (pc *ParsingComponents) Clone() *ParsingComponents {
	clone := &ParsingComponents{
		knownValues:   make(map[Component]int),
		impliedValues: make(map[Component]int),
		reference:     pc.reference,
		tags:          make(map[string]bool),
	}

	for k, v := range pc.knownValues {
		clone.knownValues[k] = v
	}
	for k, v := range pc.impliedValues {
		clone.impliedValues[k] = v
	}
	for k, v := range pc.tags {
		clone.tags[k] = v
	}

	return clone
}

// IsOnlyDate returns true if only date components are certain
func (pc *ParsingComponents) IsOnlyDate() bool {
	return !pc.IsCertain(ComponentHour) && !pc.IsCertain(ComponentMinute) && !pc.IsCertain(ComponentSecond)
}

// IsOnlyTime returns true if only time components are certain
func (pc *ParsingComponents) IsOnlyTime() bool {
	return !pc.IsCertain(ComponentWeekday) && !pc.IsCertain(ComponentDay) &&
		!pc.IsCertain(ComponentMonth) && !pc.IsCertain(ComponentYear)
}

// IsOnlyWeekdayComponent returns true if only weekday is certain
func (pc *ParsingComponents) IsOnlyWeekdayComponent() bool {
	return pc.IsCertain(ComponentWeekday) && !pc.IsCertain(ComponentDay) && !pc.IsCertain(ComponentMonth)
}

// IsDateWithUnknownYear returns true if month is certain but year is not
func (pc *ParsingComponents) IsDateWithUnknownYear() bool {
	return pc.IsCertain(ComponentMonth) && !pc.IsCertain(ComponentYear)
}

// Date returns a time.Time from the components
func (pc *ParsingComponents) Date() time.Time {
	date := pc.dateWithoutTimezoneAdjustment()
	timezoneAdjustment := pc.reference.GetSystemTimezoneAdjustmentMinute(&date, pc.Get(ComponentTimezoneOffset))
	return date.Add(time.Duration(timezoneAdjustment) * time.Minute)
}

// AddTag adds a debugging tag
func (pc *ParsingComponents) AddTag(tag string) *ParsingComponents {
	pc.tags[tag] = true
	return pc
}

// Tags returns all tags
func (pc *ParsingComponents) Tags() map[string]bool {
	tags := make(map[string]bool)
	for k, v := range pc.tags {
		tags[k] = v
	}
	return tags
}

func (pc *ParsingComponents) dateWithoutTimezoneAdjustment() time.Time {
	year := *pc.Get(ComponentYear)
	month := *pc.Get(ComponentMonth)
	day := *pc.Get(ComponentDay)
	hour := *pc.Get(ComponentHour)
	minute := *pc.Get(ComponentMinute)
	second := *pc.Get(ComponentSecond)
	millisecond := *pc.Get(ComponentMillisecond)

	return time.Date(year, time.Month(month), day, hour, minute, second, millisecond*1000000, time.UTC)
}

// Helper function to convert timezone to offset (simplified version)
func toTimezoneOffset(timezone interface{}, instant time.Time, overrides map[string]interface{}) *int {
	switch v := timezone.(type) {
	case int:
		return &v
	case string:
		// Try to load location
		if loc, err := time.LoadLocation(v); err == nil {
			_, offset := instant.In(loc).Zone()
			minutes := -offset / 60
			return &minutes
		}
		// Check overrides
		if overrides != nil {
			if val, ok := overrides[v]; ok {
				if intVal, ok := val.(int); ok {
					return &intVal
				}
			}
		}
	}
	return nil
}

// HasTag checks if the component has a specific tag
func (pc *ParsingComponents) HasTag(tag string) bool {
	return pc.tags[tag]
}
