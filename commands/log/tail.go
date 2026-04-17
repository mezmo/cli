package log

import (
	"fmt"
	"log"
	"mzm/core"
	"mzm/core/logging"
	viewlib "mzm/core/resource/v1/view"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type WebsocketEvent struct {
	Event   string    `json:"e"`
	Payload []Message `json:"p"`
}

var tailViewSelection = &ViewSelection{}

func init() {
	tailCmd.Flags().Var(searchViewSelection, "with-view", "Filter the log stream with a predefined view")
	tailCmd.Flags().Lookup("with-view").NoOptDefVal = PROMPT_TRIGGER
}

// log/tailCmd represents the log/tail command
var tailCmd = &cobra.Command{
	Use:   "tail",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Example: core.NewExampleRenderer().
		Example(
			`Tail error logs for a specific application`,
			`mzm log tail -a <app> -l error`,
		).
		Example(
			`Tail logs for a specific application with a query filter`,
			`mzm log tail -a <app> "level:-(debug OR trace) missing cred"`,
		).
		Example(
			"Tail logs using a predefined view from a list",
			`mzm log tail --with-view`,
		).
		Example(
			"Tail logs using a specific predefined view by its id",
			`mzm log tail --with-view=a2dfe012b`,
		).
		Example(
			"Tail logs using a specific predefined view by its id",
			`mzm log tail --with-view=$(mzm log get view "only errors" -q)`,
		).
		Render(),
	RunE: func(cmd *cobra.Command, args []string) error {
		logger, ok := cmd.Context().Value("log").(logging.Logger)
		if ok {
			logger = logger.Child("log.tail")
		}

		interrupt := make(chan os.Signal, 1)
		signal.Notify(interrupt, os.Interrupt)

		u := url.URL{Scheme: "wss", Host: "tail.use.dev.mezmo.it", Path: "/ws/tail"}
		params := u.Query()

		if len(args) > 0 {
			params.Set("q", args[0])
		}

		flags := cmd.Flags()

		var view *viewlib.View
		var err error
		emptyViews := make([]viewlib.View, 0)

		if tailViewSelection.IsSet {
			if tailViewSelection.Prompt {
				view, err = promptView(emptyViews)
				if err != nil {
					return fmt.Errorf("Unable retrieve views:%s", err)
				}
			} else {
				view, err = findView(tailViewSelection.ID)
				if err != nil {
					return fmt.Errorf("Unable retrieve views:%s", err)
				}
			}

			if view != nil {
				params.Set("q", view.Query)
				params.Set("hosts", strings.Join(view.Hosts, ","))
				params.Set("tags", strings.Join(view.Tags, ","))
				params.Set("levels", strings.Join(view.Levels, ","))
				params.Set("apps", strings.Join(view.Apps, ","))
			}
		}
		hosts, err := flags.GetStringArray("host")
		if err == nil && len(hosts) > 0 {
			params.Set("hosts", strings.Join(hosts, ","))
		}

		tags, err := flags.GetStringArray("tag")
		if err == nil && len(tags) > 0 {
			params.Set("tags", strings.Join(tags, ","))
		}

		levels, err := flags.GetStringArray("level")
		if err == nil && len(levels) > 0 {
			params.Set("levels", strings.Join(levels, ","))
		}

		apps, err := flags.GetStringArray("app")
		if err == nil && len(apps) > 0 {
			params.Set("apps", strings.Join(apps, ","))
		}

		u.RawQuery = params.Encode()
		logger.Print("Connecting to %s", u.String())

		headers := make(http.Header)
		headers.Add("Authorization", "Token "+viper.GetString("access-key"))
		conn, _, err := websocket.DefaultDialer.Dial(u.String(), headers)

		if err != nil {
			log.Fatal("dial ", err)
		}

		defer conn.Close()

		done := make(chan struct{})
		var msg WebsocketEvent
		go func() {
			defer close(done)
			for {
				err := conn.ReadJSON(&msg)
				if err != nil {
					logger.Error("error reading json: %v", err)
					return
				}
				if msg.Event == "meta" {
					continue
				}
				for _, message := range msg.Payload {
					fmt.Println(pprint(message, format == json))
				}
			}
		}()

		for {
			select {
			case <-done:
				logger.Debug("channel closed")
				return nil
			case sig := <-interrupt:
				logger.Trace("Signal recieved %s", sig)
				return nil
			}
		}
	},
}
