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
	Run: func(cmd *cobra.Command, args []string) {
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

		hosts, err := cmd.Flags().GetStringArray("host")
		if err == nil {
			params.Set("hosts", strings.Join(hosts, ","))
		}

		tags, err := cmd.Flags().GetStringArray("tag")
		if err == nil {
			params.Set("tags", strings.Join(tags, ","))
		}

		levels, err := cmd.Flags().GetStringArray("level")
		if err == nil {
			params.Set("levels", strings.Join(levels, ","))
		}

		apps, err := cmd.Flags().GetStringArray("app")
		if err == nil {
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
				return
			case sig := <-interrupt:
				logger.Trace("Signal recieved %s", sig)
				return
			}
		}
	},
}
