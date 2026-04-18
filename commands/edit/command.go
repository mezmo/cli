package edit

import (
	"mzm/core"

	"github.com/spf13/cobra"
)

func init() {
	Command.AddCommand(viewCommand)
}

var Command = &cobra.Command{
	Use:   "edit",
	Short: "Edit a resource",
	Example: core.NewExampleRenderer().
		Example(
			"Edit a view",
			"mzm edit view",
		).
		Render(),
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}
