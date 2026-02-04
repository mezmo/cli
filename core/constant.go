package core

var FORMAT = struct {
	JSON  OutputFormatEnum
	YAML  OutputFormatEnum
	TABLE OutputFormatEnum
}{
	JSON:  json,
	YAML:  yaml,
	TABLE: table,
}
