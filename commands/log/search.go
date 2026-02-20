/*
Copyright © 2026 NAME HERE <EMAIL ADDRESS>
*/
package log

import (
	JSON "encoding/json"
	fmt "fmt"
	"mzm/core"
	en "mzm/core/chrono/en" // TODO(esatterwhite): handle more locales
	resource "mzm/core/resource"
	"mzm/core/storage"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/spf13/cobra"
)

var prefer searchDirection = tail // defined in enum.go
var (
	to   string
	from string
)

type SearchResult struct {
	PaginationID string    `json:"pagination_id,omitempty"`
	Lines        []Message `json:"lines"`
}

type SearchParams struct {
	Query        string          `json:"query"`
	Size         int32           `json:"size"`
	To           int             `json:"to"`
	From         int             `json:"from"`
	Prefer       searchDirection `json:"prefer"`
	Hosts        []string        `json:"hosts,omitempty"`
	Tags         []string        `json:"tags,omitempty"`
	Levels       []string        `json:"levels,omitempty"`
	Apps         []string        `json:"apps,omitempty"`
	PaginationID string          `json:"pagination_id,omitempty"`
}

type Alias SearchParams

// Convert struct to map for query string input
func (p *SearchParams) ToMap() map[string]string {
	opts := make(map[string]string)
	opts["query"] = p.Query
	opts["size"] = strconv.Itoa(int(p.Size))
	if p.To > 0 {
		opts["to"] = strconv.Itoa(int(p.To))
	}
	if p.From > 0 {
		opts["from"] = strconv.Itoa(int(p.From))
	}

	opts["prefer"] = p.Prefer.String()

	if len(p.Hosts) > 0 {
		opts["hosts"] = strings.Join(p.Hosts, ",")
	}

	if len(p.Tags) > 0 {
		opts["tags"] = strings.Join(p.Tags, ",")
	}

	if len(p.Levels) > 0 {
		opts["levels"] = strings.Join(p.Levels, ",")
	}

	if len(p.Apps) > 0 {
		opts["apps"] = strings.Join(p.Apps, ",")
	}

	if p.PaginationID != "" {
		opts["pagination_id"] = p.PaginationID
	}
	return opts
}

func init() {
	now := time.Now()
	start := 2 * time.Hour
	str := strconv.Itoa(int(now.Add(-start).UnixMilli()))
	searchCmd.Flags().Int32P("limit", "n", 100, "Maximum number of lines to request")
	searchCmd.Flags().StringVar(&from, "from", str, "Unix timestamp of beginning of search timeframe.")
	searchCmd.Flags().StringVar(&to, "to", "", "Unix timestamp of end of search timeframe.")
	searchCmd.Flags().Bool("all", false, "Automatically scroll through all pages until search results are exhausted")
	searchCmd.Flags().Bool("next", false, "Get next chunk of lines (after last search). This is a convenience wrapper around the --from and --to parameters.")
	searchCmd.Flags().VarP(&prefer, "prefer", "p", "Get lines from the beginning of the interval rather than the end")
	searchCmd.Flags().Bool("with-view", false, "Search with a predefined view")
}

// log/tailCmd represents the log/tail command
var searchCmd = &cobra.Command{
	Use:   "search 'hello OR bye'",
	Short: "execute search queries over your data",
	Long: `Perform paginated search queries over indexed historical data.
If the --to and --from flags are omitted the last 2 hours will be searched.
`,
	Example: core.NewExampleRenderer().
		Example(
			"Start new paginated search query using unix timestamps",
			"mzm log search --from=1762198107863 --to=1762198113902 podwidget-server",
		).
		Example(
			"Start new paginated using natural language time frames",
			`mzm log search --from "last wednesday" --to "now" --with-view`,
		).
		Example(
			"Start new paginated with a view",
			"mzm log search --from=1762198107863 --with-view",
		).
		Example(
			"Start new paginated with a subset of views",
			"mzm log search --from 1762198107863 --to 1762198113902 --with-view proxy",
		).
		Example(
			"Start new paginated with a specific view",
			`mzm log search --from "yesterday at 3pm" --to "now" --with-view a2dfe012b`,
		).
		Example(
			"Start new paginated using a sub command to find a view by name",
			`mzm log search --from "yesterday at 3pm" --to "now" --with-view $(mzm get view "only errors" -q)`,
		).
		Example(
			"Start search query and page throuh all results",
			`mzm log search --from "one hour ago" --all podwidget-server`,
		).
		Example(
			"Get the next page of the last search query",
			"mzm log search --next",
		).
		Example(
			"Page through all remaining pages of a search query",
			"mzm log search --next --all",
		).
		Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		var pagination_id string = ""
		var params = SearchParams{}
		db, err := storage.Store()

		if err != nil {
			return err
		}

		flags := cmd.Flags()
		withView, err := flags.GetBool("with-view")

		if err != nil {
			return err
		}

		if withView == true {
			view, err := promptView()

			if err != nil {
				return fmt.Errorf("Unable retrieve views:%s", err)
			}

			if view != nil {
				params.Query = view.Query
				params.Hosts = view.Hosts
				params.Tags = view.Tags
				params.Levels = view.Levels
				params.Apps = view.Apps
			}
		}

		if to == "" {
			params.To = int(time.Now().UnixMilli())
		} else {
			nlpTo := en.ParseDate(to, time.Now(), nil)
			if nlpTo != nil {
				params.From = int(nlpTo.UnixMilli())
			} else {
				parsed, err := strconv.Atoi(from)
				if err != nil {
					return err
				}
				params.From = parsed
			}
		}

		nlpFrom := en.ParseDate(from, time.Now(), nil)

		if nlpFrom != nil {
			params.From = int(nlpFrom.UnixMilli())
		} else {
			parsed, err := strconv.Atoi(from)
			if err != nil {
				return err
			}
			params.From = parsed
		}

		params.Prefer = prefer

		if len(args) > 0 {
			params.Query = args[0]
		} else {
			params.Query = "_account:*"
		}

		all, err := flags.GetBool("all")
		if err != nil {
			all = false
		}

		limit, err := flags.GetInt32("limit")
		if err == nil && limit > 0 {
			params.Size = limit
		}

		hosts, err := flags.GetStringArray("host")
		if err == nil && len(hosts) > 0 {
			params.Hosts = hosts
		}

		tags, err := cmd.Flags().GetStringArray("tag")
		if err == nil && len(tags) > 0 {
			params.Tags = tags
		}

		levels, err := cmd.Flags().GetStringArray("level")
		if err == nil && len(levels) > 0 {
			params.Levels = levels
		}

		apps, err := cmd.Flags().GetStringArray("app")
		if err == nil && len(apps) > 0 {
			params.Apps = apps
		}

		want_next, err := cmd.Flags().GetBool("next")

		if err == nil && want_next == true {
			last_search, err := db.Get("search.page.params")
			if err != nil {
				return err
			}

			if last_search != "" {
				err = JSON.Unmarshal([]byte(last_search), &params)
			}

			if err != nil {
				return fmt.Errorf("failed to unmarshal search params: %w", err)
			}

			previous_pagination_id, err := db.Get("search.page.next")
			if err != nil {
				return err
			}

			if previous_pagination_id != "" {
				params.PaginationID = previous_pagination_id
			}
		}

		controller := make(chan os.Signal, 1)

		signal.Notify(controller, syscall.SIGTERM, os.Interrupt)

		if err != nil {
			return err
		}
		for {
			select {
			case <-controller:
				return nil
			default:
				var newparams = params.ToMap()
				res, err := resource.Client().
					R().
					SetResult(&SearchResult{}).
					SetQueryParams(newparams).
					Get("/v2/export")

				if err != nil {
					return err
				}

				// the error response from this endpoint is just plain text :|
				if !res.IsSuccess() {
					fmt.Println(res.String())
					return nil
				}

				result := res.Result().(*SearchResult)
				pagination_id = result.PaginationID
				if pagination_id != "" {
					jsonData, err := JSON.Marshal(&params)
					if err == nil {
						db.Set("search.page.next", pagination_id)
						db.Set("search.page.params", string(jsonData))
					} else {
						return nil
					}
					params.PaginationID = pagination_id
				} else {
					db.Delete("search.page.next")
					db.Delete("search.page.params")
				}

				if len(result.Lines) == 0 {
					fmt.Println("Nothing to display")
					return nil
				}

				for _, line := range result.Lines {
					fmt.Println(pprint(line, format == json))
				}

				if pagination_id != "" && all == true {
					continue
				}

				controller <- os.Interrupt
			}
		}
	},
}
