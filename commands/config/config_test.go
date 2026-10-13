package config

import (
	"bytes"
	"strings"
	"testing"

	"mzm/core/storage/storagetest"
)

func run(t *testing.T, args ...string) (string, error) {
	t.Helper()
	out := &bytes.Buffer{}
	Command.SetOut(out)
	Command.SetErr(out)
	Command.SetArgs(args)
	err := Command.Execute()
	return out.String(), err
}

func TestGetAllListsNamespaces(t *testing.T) {
	storagetest.New(t)
	out, err := run(t, "get")
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{"core", "search", "core.host.api", "search.page.limit", "100", "60000"} {
		if !strings.Contains(out, want) {
			t.Errorf("output missing %q:\n%s", want, out)
		}
	}
}

func TestGetPrefix(t *testing.T) {
	storagetest.New(t)
	out, err := run(t, "get", "core.host.*")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(out, "core.host.api") || !strings.Contains(out, "core.host.stream") {
		t.Errorf("missing hosts:\n%s", out)
	}
	if strings.Contains(out, "core.log.level") {
		t.Errorf("prefix leaked other keys:\n%s", out)
	}
}

func TestGetExactAndMissing(t *testing.T) {
	storagetest.New(t)
	out, err := run(t, "get", "core.host.api")
	if err != nil || !strings.Contains(out, "https://api.mezmo.com") {
		t.Fatalf("exact get: err=%v out=%s", err, out)
	}
	if _, err := run(t, "get", "no.such.key"); err == nil {
		t.Error("expected error for unknown key")
	}
}

func TestSetThenGet(t *testing.T) {
	kv := storagetest.New(t)
	if _, err := run(t, "set", "core.log.level", "DEBUG"); err != nil {
		t.Fatal(err)
	}
	if got, _, _ := kv.GetValue("core.log.level"); got != "DEBUG" {
		t.Errorf("stored %#v", got)
	}
	out, _ := run(t, "get", "core.log.level")
	if !strings.Contains(out, "DEBUG") {
		t.Errorf("get after set:\n%s", out)
	}

	if _, err := run(t, "set", "search.page.limit", "250"); err != nil {
		t.Fatal(err)
	}
	if got, _, _ := kv.GetValue("search.page.limit"); got != 250.0 {
		t.Errorf("number stored as %#v", got)
	}
	if _, err := run(t, "set", "feature.on", "true"); err != nil {
		t.Fatal(err)
	}
	if got, _, _ := kv.GetValue("feature.on"); got != true {
		t.Errorf("bool stored as %#v", got)
	}
}

func TestSetValidation(t *testing.T) {
	storagetest.New(t)
	if _, err := run(t, "set", "x", "null"); err == nil || !strings.Contains(err.Error(), "number, string, or boolean") {
		t.Errorf("null should be rejected, got %v", err)
	}
	if _, err := run(t, "set", "only-key"); err == nil {
		t.Error("expected arg count error")
	}
}

func TestComplexValuesRender(t *testing.T) {
	kv := storagetest.New(t)
	kv.SetValue("x.obj", map[string]any{"a": 1})
	kv.SetValue("x.list", []any{1, 2, 3})
	out, err := run(t, "get", "x.*")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(out, "<object>") || !strings.Contains(out, "<list: 3>") {
		t.Errorf("complex rendering:\n%s", out)
	}
}

func TestAlias(t *testing.T) {
	if !Command.HasAlias("cfg") {
		t.Error("cfg alias missing")
	}
}
