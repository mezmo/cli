package main

import (
	"log"
	"mzm/commands"
	"mzm/core/storage"
)

func main() {
	db, err := storage.Store()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Pool().Close()
	commands.Execute()
}
