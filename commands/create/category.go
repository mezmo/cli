package create

import (
	"fmt"
	"mzm/core"
	"mzm/core/resource"
	cat "mzm/core/resource/v1/category"

	"github.com/spf13/cobra"
)

var categoryCommand = &cobra.Command{
	Use:   "category",
	Short: "Create new mezmo category",
	Long: `
    The category subcommand allows you to create a single category resource from a template.
    It will open the resource in a text editor as specified by the EDITOR
    Environment variable, or fallback to vi on unix platform and notepad on windows.
    The default format is yaml. To edit in JSON, specifiy "-o json"
		`,
	Example: core.NewExampleRenderer().Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		resourceInterface, err := resource.Registry.GetResource("v1", "category")
		if err != nil {
			return fmt.Errorf("failed to get category resource: %w", err)
		}

		api, ok := resourceInterface.(resource.IResource[cat.Category, cat.Category])
		if !ok {
			return fmt.Errorf("unexpected resource type: %T", resourceInterface)
		}

		templateContent := api.GetTemplate()

		// Open in editor and get the edited content
		content, err := resource.FromString(
			templateContent,
			inputFormat,
			"category",
		)

		if err != nil {
			return err
		}

		template, err := resource.ParseAndValidate[cat.Category](content)
		if err != nil {
			return fmt.Errorf("failed to parse template: %w", err)
		}

		result, err := api.Create(*template)
		if err != nil {
			return fmt.Errorf("failed to create category: %w", err)
		}

		fmt.Printf("Successfully created category: %v\n", result)
		return nil
	},
}
