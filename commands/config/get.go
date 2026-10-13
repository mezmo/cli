package config

import (
	"fmt"
	"strconv"
	"strings"

	"mzm/core"
	"mzm/core/storage"

	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/tw"
	"github.com/spf13/cobra"
)

func display(value any) string {
	switch v := value.(type) {
	case map[string]any:
		return "<object>"
	case []any:
		return fmt.Sprintf("<list: %d>", len(v))
	case float64:
		return strconv.FormatFloat(v, 'f', -1, 64)
	case nil:
		return ""
	default:
		return fmt.Sprint(v)
	}
}

var getCommand = &cobra.Command{
	Use:   "get [key]",
	Short: "Get one or more configuration values",
	Long:  "Get one or more configuration values",
	Args:  cobra.RangeArgs(0, 1),
	Example: core.NewExampleRenderer().
		Example("Get specific key", "mzm config get core.host.api").
		Example("Get list of keys", "mzm config get core.*").
		Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		pattern := "*"
		if len(args) > 0 {
			pattern = args[0]
		}

		db, err := storage.Store()
		if err != nil {
			return err
		}

		entries, err := db.List(pattern)
		if err != nil {
			return err
		}
		if len(entries) == 0 && pattern != "*" && !strings.HasSuffix(pattern, ".*") {
			return fmt.Errorf("no configuration value for %q", pattern)
		}

		table := core.NewTable(
			cmd.OutOrStdout(),
			tablewriter.WithHeaderAutoFormat(tw.Off),
			tablewriter.WithPadding(tw.Padding{Left: "", Right: "    ", Overwrite: true}),
		)
		table.Header("Namespace", "Key", "Value")
		for _, entry := range entries {
			namespace := strings.SplitN(entry.Key, ".", 2)[0]
			table.Append(namespace, entry.Key, display(entry.Value))
		}
		return table.Render()
	},
}
