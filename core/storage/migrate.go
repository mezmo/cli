package storage

import (
	"embed"
	"fmt"
	"io/fs"
	"regexp"
	"strconv"

	"zombiezen.com/go/sqlite/sqlitemigration"
)

// Migrations are forward-only SQL files applied in filename order. The applied
// version is tracked in `PRAGMA user_version`. Never edit a shipped file; add
// the next number instead. Numbering matches the Deno migrations in
// @mzm/config/migration.
//
//go:embed migrations/*.sql
var migrationFS embed.FS

var migrationName = regexp.MustCompile(`^(\d{4})_[a-z0-9_]+\.sql$`)

// loadSchema reads the embedded migrations and validates that they are named
// 0001_x.sql, 0002_y.sql, ... with no gaps or duplicates.
func loadSchema() (sqlitemigration.Schema, error) {
	entries, err := fs.ReadDir(migrationFS, "migrations")
	if err != nil {
		return sqlitemigration.Schema{}, err
	}

	var s sqlitemigration.Schema
	for i, entry := range entries { // ReadDir returns entries sorted by filename
		match := migrationName.FindStringSubmatch(entry.Name())
		if match == nil {
			return s, fmt.Errorf("migration %q does not match NNNN_name.sql", entry.Name())
		}
		if n, _ := strconv.Atoi(match[1]); n != i+1 {
			return s, fmt.Errorf("migration %q: expected number %04d", entry.Name(), i+1)
		}
		body, err := migrationFS.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return s, err
		}
		s.Migrations = append(s.Migrations, string(body))
	}
	return s, nil
}

func mustLoadSchema() sqlitemigration.Schema {
	s, err := loadSchema()
	if err != nil {
		panic(err)
	}
	return s
}

var schema = mustLoadSchema()
