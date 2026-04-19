package get

import (
	"cmp"
	"fmt"
	"mzm/core"
	"mzm/core/logging"
	coreResource "mzm/core/resource"
	api "mzm/core/resource/v1/view"
	"mzm/core/tui"
	"os"
	"slices"
	"strings"

	"github.com/spf13/cobra"
)

var defaultViewParams = make(map[string]string)
var getViewCommand = &cobra.Command{
	Use:        "view [flags] [view-id]",
	Short:      "Display Information about view",
	Long:       "Displays The most infomration about view, which are predefined sets of search filters",
	Args:       cobra.RangeArgs(0, 1),
	ArgAliases: []string{"viewid"},
	Example: core.NewExampleRenderer().
		Example(
			`list all views in json format`,
			`mzm get view -o json`,
		).
		Example(
			`Get a specific view by id`,
			`mzm get view 3f4bca174`,
		).
		Example(
			`Get a specific view by name`,
			`mzm get view "my first view"`,
		).
		Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		var views []api.View
		var viewid string = ""
		var err error = nil

		log, ok := cmd.Context().Value("log").(logging.Logger)

		if ok {
			log = log.Child("get.view")
		}

		if len(args) > 0 {
			viewid = args[0]
		}

		viewRes := api.NewViewResource()

		if viewid == "" {
			views, err = viewRes.List(defaultViewParams)
			if err != nil {
				return fmt.Errorf("Unable to get views: %s", err)
			}
		} else {
			view, err := viewRes.Get(viewid, nil)
			if err != nil {
				return err
			}

			if view == nil {
				return nil
			}
			views = []api.View{*view}
		}

		flags := cmd.Flags()

		quiet, err := flags.GetBool("quiet")

		if err != nil {
			return err
		}

		if quiet {
			output := make([]string, len(views))
			for idx, item := range views {
				output[idx] = item.PK()
			}

			fmt.Println(strings.Join(output, " "))
			return nil
		}

		switch outputFormat.String() {
		case "json", "yaml":
			format := core.InputFormatEnum(outputFormat.String())
			if viewid != "" {
				// Single view - encode just the view object
				content, err := coreResource.Stringify(views[0], format)
				if err != nil {
					return err
				}
				os.Stdout.Write(content)
			} else {
				// Multiple views - encode the entire slice
				content, err := coreResource.Stringify(views, format)
				if err != nil {
					return err
				}
				os.Stdout.Write(content)
			}
		case "table":
			table := tui.NewTable()

			table.Header("CATEGORY", "ID", "NAME", "APPS", "HOSTS", "QUERY")

			slices.SortFunc(views, func(a, b api.View) int {
				if a.GetCategory() == "Uncategorized" {
					return -1
				}
				if b.GetCategory() == "Uncategorized" {
					return 1
				}
				return cmp.Compare(a.GetCategory(), b.GetCategory())
			})
			for _, view := range views {
				categories := "Uncategorized" // Default if it doesn't have any

				if len(view.Category) > 0 {
					categories = view.Category[0]
				}

				table.Append(
					categories,
					view.PK(),
					view.Name,
					strings.Join(view.Apps, ", "),
					strings.Join(view.Hosts, ", "),
					view.Query,
				)
			}

			table.Render()
		}
		return err
	},
}
