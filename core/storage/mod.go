package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/a-h/sqlitekv"
	"zombiezen.com/go/sqlite/sqlitemigration"
	"zombiezen.com/go/sqlite/sqlitex"
)

// poolSize is deliberately small: the CLI issues sequential queries, and every
// pooled connection is opened eagerly at startup.
const poolSize = 2

var (
	mu        sync.Mutex
	defaultKV *KV
)

type KV struct {
	*sqlitekv.Store
	pool *sqlitex.Pool
}

// Entry is a single decoded configuration record.
type Entry struct {
	Key   string
	Value any
}

// Pool returns the underlying SQLite connection pool
func (kv *KV) Pool() *sqlitex.Pool {
	return kv.pool
}

// Close releases the underlying connection pool.
func (kv *KV) Close() error {
	return kv.pool.Close()
}

// Get retrieves a value by key (simplified interface)
func (kv *KV) Get(key string) (string, error) {
	ctx := context.Background()
	var value string
	_, ok, err := kv.Store.Get(ctx, key, &value)
	if err != nil {
		return "", err
	}
	if !ok {
		return "", nil
	}
	return value, nil
}

// Set stores a key-value pair (simplified interface)
func (kv *KV) Set(key string, value string) error {
	ctx := context.Background()
	return kv.Store.Put(ctx, key, -1, value)
}

// Delete removes a key-value pair
func (kv *KV) Delete(key string) error {
	ctx := context.Background()
	_, err := kv.Store.Delete(ctx, key)
	return err
}

// GetValue retrieves a typed value. Numbers decode as float64.
func (kv *KV) GetValue(key string) (any, bool, error) {
	var value any
	_, ok, err := kv.Store.Get(context.Background(), key, &value)
	if err != nil || !ok {
		return nil, false, err
	}
	return value, true, nil
}

// SetValue stores any JSON serializable value.
func (kv *KV) SetValue(key string, value any) error {
	return kv.Store.Put(context.Background(), key, -1, value)
}

// List returns entries matching a pattern: "*" for everything, "a.b.*" for a
// prefix, or an exact key (zero or one entry).
func (kv *KV) List(pattern string) ([]Entry, error) {
	ctx := context.Background()
	if pattern != "*" && !strings.HasSuffix(pattern, ".*") {
		value, ok, err := kv.GetValue(pattern)
		if err != nil || !ok {
			return nil, err
		}
		return []Entry{{Key: pattern, Value: value}}, nil
	}

	prefix := ""
	if pattern != "*" {
		prefix = strings.TrimSuffix(pattern, "*")
	}

	records, err := kv.Store.GetPrefix(ctx, prefix, 0, -1)
	if err != nil {
		return nil, err
	}

	entries := make([]Entry, 0, len(records))
	for _, record := range records {
		var value any
		if err := json.Unmarshal(record.Value, &value); err != nil {
			return nil, fmt.Errorf("decode %q: %w", record.Key, err)
		}
		entries = append(entries, Entry{Key: record.Key, Value: value})
	}
	return entries, nil
}

// Open opens an independent, fully migrated store at path.
func Open(path string) (*KV, error) {
	return openWith(path, schema)
}

func openWith(path string, s sqlitemigration.Schema) (*KV, error) {
	ctx := context.Background()
	pool, err := sqlitex.NewPool(path, sqlitex.PoolOptions{PoolSize: poolSize})
	if err != nil {
		return nil, fmt.Errorf("unable to open storage database: %w", err)
	}

	store := sqlitekv.NewStore(sqlitekv.NewSqlite(pool))
	if err := store.Init(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to initialize storage database: %w", err)
	}

	conn, err := pool.Take(ctx)
	if err != nil {
		pool.Close()
		return nil, err
	}
	err = sqlitemigration.Migrate(ctx, conn, s)
	pool.Put(conn)
	if err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to migrate storage database: %w", err)
	}

	return &KV{Store: store, pool: pool}, nil
}

// Store returns the process wide store, opening it on first use.
func Store() (*KV, error) {
	mu.Lock()
	defer mu.Unlock()
	if defaultKV != nil {
		return defaultKV, nil
	}

	homedir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	configDir := filepath.Join(homedir, ".config", "mezmo")
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return nil, err
	}
	kv, err := Open(filepath.Join(configDir, "mzmg.cfgx"))
	if err != nil {
		return nil, err
	}
	defaultKV = kv
	return defaultKV, nil
}

// Close closes the process wide store if it was opened.
func Close() error {
	mu.Lock()
	defer mu.Unlock()
	if defaultKV == nil {
		return nil
	}
	err := defaultKV.Close()
	defaultKV = nil
	return err
}

// SetDefault replaces the store returned by Store and returns a function that
// restores the previous one. Intended for tests.
func SetDefault(kv *KV) (restore func()) {
	mu.Lock()
	defer mu.Unlock()
	previous := defaultKV
	defaultKV = kv
	return func() {
		mu.Lock()
		defer mu.Unlock()
		defaultKV = previous
	}
}
