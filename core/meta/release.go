package meta

import (
	_ "embed"
	"encoding/json"
)

//go:embed release.json
var releaseJSON []byte

// ReleaseInfo contains information about the current release
type Info struct {
	ReleaseDate string `json:"release_date"`
	Version     string `json:"version"`
}

// GetRelease returns the release information from release.json
func GetRelease() *Info {
	var info Info
	if err := json.Unmarshal(releaseJSON, &info); err != nil {
		// Return a default vaue if parsing fails
		return &Info{
			Version:     "unknown",
			ReleaseDate: "",
		}
	}

	return &info
}
