package delete

import (
	"github.com/spf13/cobra"
	"mzm/core"
)

var Command = &cobra.Command{
	Use:   "delete",
	Short: "Delete resources from a file or stdin.",
	Long:  "Delete resources from a file or stdin.",
	Example: core.NewExampleRenderer().
		Render(),
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
	Command.AddCommand(deleteViewCommand)
}
