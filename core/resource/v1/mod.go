package v1

import (
	"mzm/core/resource/v1/view"
)

var Resources = struct {
	view *view.ViewResource
}{
	view: &view.ViewResource{},
}
