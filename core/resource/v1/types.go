package v1

import (
	"fmt"
	"strings"
)

type JoiDetail struct {
	Message string `json:"message"`
	Key     string `json:"key"`
}

type JoiResponse struct {
	Details []JoiDetail `json:"details"`
	Error   string      `json:"error"`
	Code    string      `json:"code"`
	Status  string      `json:"status"`
}

// FormatJoiError formats Joi validation errors into a user-friendly message
func (j *JoiResponse) FormatJoiError() string {
	if len(j.Details) == 0 {
		return j.Error
	}

	var messages []string
	for _, detail := range j.Details {
		if detail.Message != "" {
			messages = append(messages, fmt.Sprintf("  - %s", detail.Message))
		}
	}

	if len(messages) == 0 {
		return j.Error
	}

	return fmt.Sprintf("Validation errors:\n%s", strings.Join(messages, "\n"))
}
