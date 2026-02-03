/*
Copyright © 2026 NAME HERE <EMAIL ADDRESS>
*/
package commands

import (
	"context"
	"os"
	"strings"

	"mzm/commands/log"
	"mzm/core/logging"

	"github.com/rs/zerolog"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "mzm",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		debug, err := cmd.Flags().GetBool("debug")
		if err != nil {
			return err
		}

		if debug {
			logging.SetLogLevel(zerolog.DebugLevel)
			// Test that debug logging is now working
			logging.Default.Debug("Debug logging has been enabled")
			logging.Default.Info("Info logging is also enabled")
		}

		ctx := context.WithValue(cmd.Context(), "log", logging.Default)
		cmd.SetContext(ctx)
		return nil
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.mzm.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.

	viper.SetEnvPrefix("mzm")
	viper.SetEnvKeyReplacer(strings.NewReplacer("-", "_"))
	viper.AutomaticEnv()
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	rootCmd.PersistentFlags().Bool("debug", false, "enable debug logging")

	viper.BindEnv("access-key")
	rootCmd.AddCommand(log.Command)
}
