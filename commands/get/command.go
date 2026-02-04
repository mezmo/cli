package get

import (
	"github.com/spf13/cobra"
	"mzm/core"
)

var outputFormat core.OutputFormatEnum = core.FORMAT.TABLE

var Command = &cobra.Command{
	Use:   "get",
	Short: "Introspect various resources.",
	Long:  "Prints a table of the most important information about the specified resources.",
	Example: core.NewExampleRenderer().
		Example(
			"Get all views",
			"mzm get view",
		).
		Example(
			"Get a specific view by ID",
			"mzm get view <view-id>",
		).
		Example(
			"Get account information",
			"mzm get account",
		).
		Render(),
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
	Command.AddCommand(getViewCommand)
	Command.PersistentFlags().VarP(&outputFormat, "output", "o", `output logs in specific format [json, pretty]`)
}
