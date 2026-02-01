package storage

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/a-h/sqlitekv"
	"zombiezen.com/go/sqlite/sqlitex"
)

var once sync.Once
var kvStore *KV

type KV struct {
	*sqlitekv.Store
	pool *sqlitex.Pool
}

// Pool returns the underlying SQLite connection pool
func (kv *KV) Pool() *sqlitex.Pool {
	return kv.pool
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

func Store() (*KV, error) {
	var initErr error
	once.Do(func() {
		ctx := context.Background()
		homedir, err := os.UserHomeDir()
		if err != nil {
			initErr = err
			return
		}
		configDir := filepath.Join(homedir, ".config", "mezmo")
		os.MkdirAll(configDir, 0755)
		pool, err := sqlitex.NewPool(filepath.Join(configDir, "mzmg.cfgx"), sqlitex.PoolOptions{})
		if err != nil {
			initErr = err
			log.Fatal("unable to initialize database storage database")
			return
		}
		// Create the Sqlite instance using the constructor
		sqliteDB := sqlitekv.NewSqlite(pool)

		// Create the Store using the Sqlite instance
		store := sqlitekv.NewStore(sqliteDB)
		err = store.Init(ctx)
		if err != nil {
			log.Fatal("unable to initialize database storage database")
			return
		}

		// Create the KV struct with proper composition
		kvStore = &KV{
			Store: store,
			pool:  pool,
		}
	})

	if initErr != nil {
		return nil, initErr
	}
	return kvStore, nil
}
