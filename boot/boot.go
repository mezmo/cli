// Package boot tunes the Go runtime for a short lived CLI process. It must be
// imported by main for its side effect.
//
// On machines with many CPUs the runtime reserves a couple of MB for per-P
// scheduler state before any user code runs. That pushes the heap past the
// default 4MB first-GC trigger during package init, and a GC cycle across
// every P costs tens of milliseconds. A CLI normally exits long before garbage
// matters, so collection is deferred until the heap nears a memory limit.
//
// Package init order is by import path once dependencies are ready, so this
// package is named to sort ahead of the other mzm packages ("mzm/boot" sorts
// before "mzm/commands" and "mzm/core"). Keep it free of mzm imports.
package boot

import (
	"os"
	"runtime/debug"
)

// memoryLimit is the soft limit at which the GC starts running again.
const memoryLimit = 256 << 20

func init() {
	// respect explicit user tuning
	if os.Getenv("GOGC") == "" {
		debug.SetGCPercent(-1)
	}
	if os.Getenv("GOMEMLIMIT") == "" {
		debug.SetMemoryLimit(memoryLimit)
	}
}
