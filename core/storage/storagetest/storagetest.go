// Package storagetest provides throwaway storage for tests.
package storagetest

import (
	"path/filepath"
	"regexp"
	"testing"

	"mzm/core/storage"
)

var unsafe = regexp.MustCompile(`[^A-Za-z0-9_-]+`)

// New opens a fresh, fully migrated store in t.TempDir(), installs it as the
// default returned by storage.Store(), and closes and restores it on cleanup.
// Tests using it must not call t.Parallel().
func New(t testing.TB) *storage.KV {
	t.Helper()
	path := filepath.Join(t.TempDir(), unsafe.ReplaceAllString(t.Name(), "_")+".db")
	kv, err := storage.Open(path)
	if err != nil {
		t.Fatalf("open test store: %v", err)
	}
	restore := storage.SetDefault(kv)
	t.Cleanup(func() {
		restore()
		kv.Close()
	})
	return kv
}
