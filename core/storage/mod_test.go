package storage

import (
	"path/filepath"
	"reflect"
	"testing"
)

func open(t *testing.T) *KV {
	t.Helper()
	kv, err := Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { kv.Close() })
	return kv
}

func keys(entries []Entry) []string {
	out := []string{}
	for _, e := range entries {
		out = append(out, e.Key)
	}
	return out
}

func TestValueRoundTrip(t *testing.T) {
	t.Parallel()
	kv := open(t)
	for key, want := range map[string]any{"t.str": "hello", "t.num": 42.5, "t.bool": true} {
		if err := kv.SetValue(key, want); err != nil {
			t.Fatal(err)
		}
		got, ok, err := kv.GetValue(key)
		if err != nil || !ok || got != want {
			t.Errorf("%s: got %#v ok=%v err=%v, want %#v", key, got, ok, err, want)
		}
	}
	if _, ok, _ := kv.GetValue("missing"); ok {
		t.Error("missing key reported as found")
	}
}

func TestList(t *testing.T) {
	t.Parallel()
	kv := open(t)
	kv.SetValue("corex.y", "decoy")

	cases := []struct {
		pattern string
		want    []string
	}{
		{"core.host.*", []string{"core.host.api", "core.host.stream"}},
		{"core.host.api", []string{"core.host.api"}},
		{"nope.nothing", []string{}},
		{"nope.*", []string{}},
	}
	for _, c := range cases {
		got, err := kv.List(c.pattern)
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(keys(got), c.want) {
			t.Errorf("List(%q) = %v, want %v", c.pattern, keys(got), c.want)
		}
	}

	core, _ := kv.List("core.*")
	for _, k := range keys(core) {
		if k == "corex.y" {
			t.Error("core.* matched corex.y")
		}
	}
	all, _ := kv.List("*")
	if len(all) <= len(core) {
		t.Errorf("* returned %d entries, core.* returned %d", len(all), len(core))
	}
}

func TestStringGetSetDelete(t *testing.T) {
	t.Parallel()
	kv := open(t)
	if err := kv.Set("search.page.next", "abc"); err != nil {
		t.Fatal(err)
	}
	if got, _ := kv.Get("search.page.next"); got != "abc" {
		t.Errorf("Get = %q", got)
	}
	kv.Delete("search.page.next")
	if got, _ := kv.Get("search.page.next"); got != "" {
		t.Errorf("Get after delete = %q", got)
	}
}

func TestIsolation(t *testing.T) {
	t.Parallel()
	a, b := open(t), open(t)
	a.SetValue("only.a", 1.0)
	if _, ok, _ := b.GetValue("only.a"); ok {
		t.Error("store b saw a key written to store a")
	}
}
