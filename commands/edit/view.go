package edit

import (
	"fmt"
	"mzm/core/logging"
	"mzm/core/resource"
	view "mzm/core/resource/v1/view"

	"github.com/spf13/cobra"
)

var viewCommand = &cobra.Command{
	Use:   "view [view-id]",
	Short: "Edit an existing view",
	Long:  "Edit an existing view through a file interface using your preferred editor. This will use the editor configured via the EDITOR environment variable",
	Args:  cobra.ExactArgs(1),

	RunE: func(cmd *cobra.Command, args []string) error {
		logger, _ := cmd.Context().Value("edit:view").(logging.Logger)
		// Load the view from API and open in editor
		content, err := resource.Load("v1", "view", args[0], make(map[string]string))
		if err != nil {
			return err
		}

		// Apply the edited template (create or update)
		result, err := resource.ApplyTemplate[view.View](content)
		if err != nil {
			return err
		}

		// Display the result
		logger.Info("Successfully updated view: %s (PK: %s)", result.Name, result.PK())
		fmt.Println(result.PK())
		return nil
	},
}
