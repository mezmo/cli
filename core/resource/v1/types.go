package v1

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
