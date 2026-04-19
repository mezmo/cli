package get

import (
	"mzm/core"
	coreResource "mzm/core/resource"
	api "mzm/core/resource/v1/category"
	"mzm/core/tui"
	"os"

	"github.com/spf13/cobra"
)

var getCategoryCommand = &cobra.Command{
	Use:   "category [flags] [category-id]",
	Short: "Display Information about categories",
	Long:  "Displays The most infomration about categories, are containers for logically grouping boards, screens and views",
	RunE: func(cmd *cobra.Command, args []string) error {
		var categories []api.Category
		var pk string = ""
		var err error = nil

		if len(args) > 0 {
			pk = args[0]
		}
		resource := api.NewCategoryResource()

		if pk == "" {
			categories, err = resource.List(make(map[string]string))

			if err != nil {
				return err
			}

		} else {
			category, err := resource.Get(pk, make(map[string]string))
			if err != nil {
				return err
			}

			categories = append(categories, *category)
		}

		switch outputFormat.String() {
		case "json", "yaml":
			format := core.InputFormatEnum(outputFormat.String())
			if pk != "" {
				// Single view - encode just the view object
				content, err := coreResource.Stringify(categories[0], format)
				if err != nil {
					return err
				}
				os.Stdout.Write(content)
			} else {
				// Multiple views - encode the entire slice
				content, err := coreResource.Stringify(categories, format)
				if err != nil {
					return err
				}
				os.Stdout.Write(content)
			}
		case "table":
			table := tui.NewTable()
			table.Header("NAME", "TYPE", "ID")
			for _, category := range categories {
				table.Append(
					category.Name,
					category.Type,
					category.PK(),
				)
			}

			table.Render()
		}
		return nil
	},
}
