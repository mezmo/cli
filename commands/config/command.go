package config

import (
	"mzm/core"

	"github.com/spf13/cobra"
)

var Command = &cobra.Command{
	Use:     "config",
	Aliases: []string{"cfg"},
	Short:   "Manage the configuration of the mzm command",
	Long:    "Manage the configuration of the mzm command",
	Example: core.NewExampleRenderer().
		Example("Get specific key", "mzm config get core.host.api").
		Example("Get list of keys", "mzm config get core.*").
		Example("Set a configuration value", "mzm config set core.log.level DEBUG").
		Render(),
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
	Command.AddCommand(getCommand)
	Command.AddCommand(setCommand)
}
