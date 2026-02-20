package log

import (
	"fmt"
	"log"
	"mzm/core"
	"mzm/core/logging"
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

var tailExamples core.ExampleRender = core.ExampleRender{}

func init() {
	tailCmd.Flags().Bool("with-view", false, "Search with a predefined view")
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
	Example: tailExamples.
		Example(
			`Tail error logs for a specific application`,
			`mzm log tail -a <app> -l error`,
		).
		Example(
			`Tail for a specific application with a query filter`,
			`mzm log tail -a <app> "level:-(debug OR trace) missing cred"`,
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
