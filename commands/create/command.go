package create

import (
	"mzm/core"

	"github.com/spf13/cobra"
)

var inputFormat core.InputFormatEnum = core.FORMAT.CRUD.YAML
var Command = &cobra.Command{
	Use:   "create",
	Short: "Create new mezmo resource",
	Long:  "Create new mezmo resource",
	Example: core.NewExampleRenderer().
		Example(
			"Create a new view",
			"mzm create view",
		).
		Render(),
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
	Command.PersistentFlags().VarP(&inputFormat, "output", "o", "The data format used to interact (edit | create) with remote resources [yaml, json]")
	Command.AddCommand(viewCommand)
	Command.AddCommand(categoryCommand)
}
