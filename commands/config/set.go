package config

import (
	"errors"
	"fmt"

	"mzm/core"
	"mzm/core/storage"

	"github.com/spf13/cobra"
)

var setCommand = &cobra.Command{
	Use:   "set <key> <value>",
	Short: "Set a configuration value",
	Long:  "Set a configuration value. Values may be a number, string, or boolean.",
	Args:  cobra.ExactArgs(2),
	Example: core.NewExampleRenderer().
		Example("Set a specific configuration value", "mzm config set core.log.level DEBUG").
		Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		value := core.Typecast(args[1])
		switch value.(type) {
		case string, float64, bool:
		default:
			return errors.New(`value must be one of a number, string, or boolean`)
		}

		db, err := storage.Store()
		if err != nil {
			return err
		}
		if err := db.SetValue(args[0], value); err != nil {
			return err
		}
		fmt.Fprintln(cmd.OutOrStdout(), display(value))
		return nil
	},
}
