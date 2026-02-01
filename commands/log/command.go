package log

import (
	"github.com/spf13/cobra"
)

var format formatEnum = pretty
var Command = &cobra.Command{
	Use:   "log",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
}

func init() {
	Command.PersistentFlags().VarP(&format, "output", "o", `output logs in specific format [json, pretty]`)
	Command.PersistentFlags().StringArrayP("host", "H", []string{}, "Host names to filter the log stream")
	Command.PersistentFlags().StringArrayP("tag", "t", []string{}, "tags to filter by")
	Command.PersistentFlags().StringArrayP("app", "a", []string{}, "app names to filter by")
	Command.PersistentFlags().StringArrayP("level", "l", []string{}, "log levels to filter by")
	Command.AddCommand(tailCmd)
	Command.AddCommand(searchCmd)
}
