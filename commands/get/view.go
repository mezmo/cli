package get

import (
	JSON "encoding/json"
	"fmt"
	"mzm/core"
	"mzm/core/logging"
	resource "mzm/core/resource/v1/view"
	"os"
	"strings"

	yaml "github.com/elioetibr/golang-yaml/pkg/encoder"
	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/renderer"
	"github.com/olekukonko/tablewriter/tw"
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
		var views *[]resource.View
		var viewid string = ""
		var err error = nil

		log, ok := cmd.Context().Value("log").(logging.Logger)

		if ok {
			log = log.Child("get.view")
		}

		// Handle the case when args is not empty
		if len(args) > 0 {
			viewid = args[0]
		}

		if viewid == "" {
			views, err = resource.List(defaultViewParams)
			if err != nil {
				return fmt.Errorf("Unable to get views: %s", err)
			}
		} else {
			view, err := resource.Get(viewid, nil)
			if err != nil {
				return err
			}

			if view == nil {
				return nil
			}
			// Simply create a new slice with the single view
			views = &[]resource.View{*view}
		}

		switch outputFormat.String() {
		case "json":
			encoder := JSON.NewEncoder(os.Stdout)
			encoder.SetIndent("", " ")
			if viewid != "" {
				// Single view - encode just the view object
				encoder.Encode((*views)[0])
			} else {
				// Multiple views - encode the entire slice
				encoder.Encode(*views)
			}
		case "yaml":
			var out []byte
			if viewid != "" {
				out, err = yaml.Marshal((*views)[0])
			} else {
				out, err = yaml.Marshal(views)
			}
			if err != nil {
				return fmt.Errorf("Unable to convert views you yaml")
			}
			fmt.Println(string(out))
		case "table":
			table := tablewriter.NewTable(
				os.Stdout,
				tablewriter.WithRenderer(
					renderer.NewBlueprint(
						tw.Rendition{
							Borders: tw.BorderNone,
							Settings: tw.Settings{
								Separators: tw.Separators{
									ShowHeader:     tw.Off,
									ShowFooter:     tw.Off,
									BetweenRows:    tw.Off,
									BetweenColumns: tw.Off,
								},
								Lines: tw.Lines{
									ShowTop:        tw.Off,
									ShowBottom:     tw.Off,
									ShowHeaderLine: tw.Off,
									ShowFooterLine: tw.Off,
								},
							},
						},
					),
				),
				tablewriter.WithConfig(
					tablewriter.Config{
						Header: tw.CellConfig{
							Alignment: tw.CellAlignment{Global: tw.AlignLeft},
						},
						Row: tw.CellConfig{
							Merging: tw.CellMerging{Mode: tw.MergeHierarchical},
						},
					},
				),
			)

			table.Header("CATEGORY", "ID", "NAME", "APPS", "HOSTS", "QUERY")

			for _, view := range *views {
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
