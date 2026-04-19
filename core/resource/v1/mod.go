package v1

import (
	"mzm/core/resource/v1/category"
	"mzm/core/resource/v1/view"
)

var Resources = struct {
	view     *view.ViewResource
	category *category.CategoryResource
}{
	view:     &view.ViewResource{},
	category: &category.CategoryResource{},
}
