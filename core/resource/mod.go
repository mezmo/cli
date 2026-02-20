package resource

import (
	"errors"
	"github.com/spf13/viper"
	"sync"
	"time"

	resty "resty.dev/v3"
)

var (
	client *resty.Client
	once   sync.Once
)

func Client() *resty.Client {
	once.Do(func() {
		client = resty.New()
		client.SetBaseURL("https://api.use.int.mezmo.it")
		client.SetTimeout(10 * time.Second)
		client.AddRequestMiddleware(authMiddleware)
	})
	return client
}

func authMiddleware(c *resty.Client, req *resty.Request) error {
	key := viper.GetString("access-key")

	if key == "" {
		return errors.New("Missing environment variable MZM_ACCESS_KEY")
	}

	req.SetAuthScheme("Token")
	req.SetAuthToken(key)
	return nil
}
