package category

type CategoryType string

const (
	VIEW   CategoryType = "views"
	BOARD  CategoryType = "boards"
	SCREEN CategoryType = "screens"
)

var CATEGORY_TYPES = []CategoryType{VIEW, BOARD, SCREEN}

type Category struct {
	Name string
	Id   string
	Type CategoryType
}

func (category *Category) PK() string {
	return category.Id
}

func (category *Category) GetName() string {
	return category.Name
}
