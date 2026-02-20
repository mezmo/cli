package nestedlist

import (
	tea "github.com/phoenix-tui/phoenix/tea"
	"mzm/core/tui/keyboard"
)

type KeyBinding struct {
	Key    string
	Action string
}

type KeyMap struct {
	bindings map[string]string
}

// NewKeyMap creates a new key map with default bindings
func NewKeyMap() KeyMap {
	bindings := map[string]string{
		keyboard.KeyUp:        keyboard.ActionMoveUp,
		keyboard.KeyDown:      keyboard.ActionMoveDown,
		keyboard.KeyLeft:      keyboard.ActionMoveBack,
		keyboard.KeyRight:     keyboard.ActionMoveForward,
		keyboard.KeyK:         keyboard.ActionMoveUp,
		keyboard.KeyJ:         keyboard.ActionMoveDown,
		keyboard.KeyH:         keyboard.ActionMoveBack,
		keyboard.KeyL:         keyboard.ActionMoveForward,
		keyboard.KeyBackspace: keyboard.ActionMoveBack,
		keyboard.KeyEnter:     keyboard.ActionSelect,
		keyboard.KeyQ:         keyboard.ActionQuit,
		keyboard.KeyEsc:       keyboard.ActionQuit,
		keyboard.KeyCtrlC:     keyboard.ActionQuit,
	}

	return KeyMap{bindings: bindings}
}

// GetAction returns the action for a given key message
func (k KeyMap) GetAction(msg tea.KeyMsg) string {
	keyStr := msg.String()
	if action, exists := k.bindings[keyStr]; exists {
		return action
	}
	return ""
}
