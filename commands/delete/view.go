package delete

import (
	"github.com/spf13/cobra"
	"mzm/core"
	"mzm/core/resource"
	"mzm/core/resource/v1/view"
)

var deleteViewCommand = &cobra.Command{
	Use:        "view [flags] [view-id]",
	Short:      "Delete resources from a file or stdin.",
	Long:       "Delete resources from a file or stdin.",
	Args:       cobra.RangeArgs(1, 1),
	ArgAliases: []string{"viewid"},
	Example:    core.NewExampleRenderer().Render(),
	RunE: func(cmd *cobra.Command, args []string) error {

		resource, err := resource.Registry.GetResource("v1", "view")
		if err != nil {
			return err
		}

		err = resource.(*view.ViewResource).Remove(args[0])

		if err != nil {
			return err
		}
		return nil
	},
}
