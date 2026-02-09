package create

import (
	"fmt"
	"github.com/spf13/cobra"
	"mzm/core"
	"mzm/core/resource"
	resourceView "mzm/core/resource/v1/view"
)

var viewCommand = &cobra.Command{
	Use:   "view",
	Short: "Create new mezmo view",
	Long: `
    The view subcommand allows you to create a single view resource from a template.
    It will open the resource in a text editor as specified by the EDITOR
    Environment variable, or fallback to vi on unix platform and notepad on windows.
    The default format is yaml. To edit in JSON, specifiy "-o json"
		`,
	Example: core.NewExampleRenderer().Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		resourceInterface, err := resource.Registry.GetResource("v1", "view")
		if err != nil {
			return fmt.Errorf("failed to get view resource: %w", err)
		}

		api, ok := resourceInterface.(resource.IResource[resourceView.View, resourceView.View])
		if !ok {
			return fmt.Errorf("unexpected resource type: %T", resourceInterface)
		}

		templateContent := api.GetTemplate()

		// Open in editor and get the edited content
		content, err := resource.FromString(
			templateContent,
			inputFormat,
			"view",
		)

		if err != nil {
			return err
		}

		template, err := resource.ParseAndValidate[resourceView.View](content)
		if err != nil {
			return fmt.Errorf("failed to parse template: %w", err)
		}

		result, err := api.Create(*template)
		if err != nil {
			return fmt.Errorf("failed to create view: %w", err)
		}

		fmt.Printf("Successfully created view: %v\n", result)
		return nil
	},
}
