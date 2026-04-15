/**
* Copyright © 2026 Mezmo <support@mezmo.com>
**/
package commands

import (
	"context"
	"fmt"
	"os"
	"strings"

	"mzm/commands/create"
	"mzm/commands/delete"
	"mzm/commands/get"
	"mzm/commands/log"
	"mzm/core/assets"
	"mzm/core/logging"
	"mzm/core/meta"

	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/renderer"
	"github.com/olekukonko/tablewriter/tw"
	style "github.com/phoenix-tui/phoenix/style"
	"github.com/rs/zerolog"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "mzm",
	Short: "A brief description of your application",
	Run: func(cmd *cobra.Command, args []string) {
		// Create a borderless table for layout
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
					Row: tw.CellConfig{
						Alignment: tw.CellAlignment{Global: tw.AlignCenter},
					},
				},
			),
		)

		// Get release info
		info := meta.GetRelease()
		yellow := style.RGB(255, 215, 0)
		yellowStyle := style.New().Foreground(yellow)
		bold := style.New().Bold(true)

		// Format: "mezmo cli @ 2.0.6" with mezmo in yellow, version in bold
		versionText := fmt.Sprintf("%s cli @ %s",
			style.Render(yellowStyle, "mezmo"),
			style.Render(bold, info.Version),
		)

		// Add logo
		table.Append(assets.Logo())
		// Add empty row for spacing
		table.Append("")
		// Add version info centered
		table.Append(versionText)

		table.Render()
		fmt.Println()

		// Show help
		cmd.Help()
	},
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
	rootCmd.AddCommand(get.Command)
	rootCmd.AddCommand(create.Command)
	rootCmd.AddCommand(delete.Command)
}
