package core

var FORMAT = struct {
	OUTPUT struct {
		JSON  OutputFormatEnum
		YAML  OutputFormatEnum
		TABLE OutputFormatEnum
	}
	CRUD struct {
		JSON InputFormatEnum
		YAML InputFormatEnum
	}
}{
	OUTPUT: struct {
		JSON  OutputFormatEnum
		YAML  OutputFormatEnum
		TABLE OutputFormatEnum
	}{
		JSON:  jsonOutput,
		YAML:  yamlOutput,
		TABLE: tableOutput,
	},
	CRUD: struct {
		JSON InputFormatEnum
		YAML InputFormatEnum
	}{
		JSON: jsonInput,
		YAML: yamlInput,
	},
}
