package main

import (
	"log"

	_ "mzm/boot"
	"mzm/commands"
	"mzm/core/storage"
)

func main() {
	// the config store is opened lazily by the commands that need it
	defer func() {
		if err := storage.Close(); err != nil {
			log.Print(err)
		}
	}()
	commands.Execute()
}
