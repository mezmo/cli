package storage

import (
	"context"
	"path/filepath"
	"strings"
	"testing"

	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitemigration"
	"zombiezen.com/go/sqlite/sqlitex"
)

func openAt(t *testing.T, path string, n int) *KV {
	t.Helper()
	kv, err := openWith(path, sqlitemigration.Schema{Migrations: schema.Migrations[:n]})
	if err != nil {
		t.Fatal(err)
	}
	return kv
}

func scalar(t *testing.T, kv *KV, query string) int64 {
	t.Helper()
	conn, err := kv.pool.Take(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	defer kv.pool.Put(conn)
	var n int64
	err = sqlitex.ExecuteTransient(conn, query, &sqlitex.ExecOptions{
		ResultFunc: func(stmt *sqlite.Stmt) error { n = stmt.ColumnInt64(0); return nil },
	})
	if err != nil {
		t.Fatal(err)
	}
	return n
}

func has(t *testing.T, kv *KV, key string) bool {
	t.Helper()
	_, ok, err := kv.GetValue(key)
	if err != nil {
		t.Fatal(err)
	}
	return ok
}

func TestFreshDatabaseHasDefaults(t *testing.T) {
	t.Parallel()
	kv := open(t)
	want := map[string]any{
		"core.host.api":        "https://api.mezmo.com",
		"core.host.stream":     "https://tail.mezmo.com",
		"core.log.level":       "ERROR",
		"search.page.ttl":      60000.0,
		"search.page.limit":    100.0,
		"core.upgrade.timeout": 300000.0,
	}
	for key, w := range want {
		got, ok, err := kv.GetValue(key)
		if err != nil || !ok || got != w {
			t.Errorf("%s = %#v ok=%v err=%v, want %#v", key, got, ok, err, w)
		}
	}
	if v := scalar(t, kv, "PRAGMA user_version;"); v != int64(len(schema.Migrations)) {
		t.Errorf("user_version = %d, want %d", v, len(schema.Migrations))
	}
}

func TestStepwise(t *testing.T) {
	t.Parallel()
	for n := 1; n <= len(schema.Migrations); n++ {
		kv := openAt(t, filepath.Join(t.TempDir(), "s.db"), n)
		if v := scalar(t, kv, "PRAGMA user_version;"); v != int64(n) {
			t.Errorf("n=%d user_version = %d", n, v)
		}
		if !has(t, kv, "core.host.api") {
			t.Errorf("n=%d missing v1 seeds", n)
		}
		tables := scalar(t, kv, "select count(*) from sqlite_master where name = 'conversation';")
		if (tables == 1) != (n >= 2) {
			t.Errorf("n=%d conversation table present=%d", n, tables)
		}
		if has(t, kv, "core.upgrade.timeout") != (n >= 3) {
			t.Errorf("n=%d unexpected core.upgrade.timeout state", n)
		}
		kv.Close()
	}
}

func TestUpgradePreservesUserValues(t *testing.T) {
	t.Parallel()
	path := filepath.Join(t.TempDir(), "u.db")
	old := openAt(t, path, 1)
	if err := old.SetValue("core.log.level", "DEBUG"); err != nil {
		t.Fatal(err)
	}
	old.Close()

	kv, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer kv.Close()
	if got, _, _ := kv.GetValue("core.log.level"); got != "DEBUG" {
		t.Errorf("user value lost: %#v", got)
	}
	if !has(t, kv, "core.upgrade.timeout") {
		t.Error("later migration did not run")
	}
}

func TestReopenIsIdempotent(t *testing.T) {
	t.Parallel()
	path := filepath.Join(t.TempDir(), "i.db")
	first, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	first.SetValue("core.host.api", "https://example.test")
	first.Close()

	second, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer second.Close()
	if got, _, _ := second.GetValue("core.host.api"); got != "https://example.test" {
		t.Errorf("reopen overwrote value: %#v", got)
	}
}

func TestMigrationFilesAreContiguous(t *testing.T) {
	t.Parallel()
	s, err := loadSchema()
	if err != nil {
		t.Fatal(err)
	}
	if len(s.Migrations) == 0 {
		t.Fatal("no migrations embedded")
	}
}

func TestMigrationFilesAreNotEmpty(t *testing.T) {
	t.Parallel()
	for i, m := range schema.Migrations {
		if strings.TrimSpace(m) == "" {
			t.Errorf("migration %04d is empty", i+1)
		}
	}
}
