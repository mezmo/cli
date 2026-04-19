package edit

import (
	"fmt"
	"mzm/core/logging"
	"mzm/core/resource"
	api "mzm/core/resource/v1/category"

	"github.com/spf13/cobra"
)

var categoryCommand = &cobra.Command{
	Use:   "category [category-id]",
	Short: "Edit an existing category",
	Long:  "Edit an existing category through a file interface using your preferred editor. This will use the editor configured via the EDITOR environment variable",
	Args:  cobra.ExactArgs(1),

	RunE: func(cmd *cobra.Command, args []string) error {
		logger, _ := cmd.Context().Value("edit:category").(logging.Logger)
		// Load the category from API and open in editor
		content, err := resource.Load("v1", "category", args[0], make(map[string]string))
		if err != nil {
			return err
		}

		// Apply the edited template (create or update)
		result, err := resource.ApplyTemplate[api.Category](content)
		if err != nil {
			return err
		}

		// Display the result
		logger.Info("Successfully updated category: %s (PK: %s)", result.Name, result.PK())
		fmt.Println(result.PK())
		return nil
	},
}
