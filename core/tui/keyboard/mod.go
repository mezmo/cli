package keyboard

// Key constants - Navigation
const (
	KeyUp        = "↑"
	KeyDown      = "↓"
	KeyLeft      = "←"
	KeyRight     = "→"
	KeyK         = "k" // Vim-style up
	KeyJ         = "j" // Vim-style down
	KeyH         = "h" // Vim-style left
	KeyL         = "l" // Vim-style right
	KeyBackspace = "backspace"

	// Key constants - Selection
	KeyEnter = "enter"

	// Key constants - Exit
	KeyQ     = "q"
	KeyEsc   = "esc"
	KeyCtrlC = "ctrl+c"
)

// Action constants
const (
	ActionMoveUp      = "move_up"
	ActionMoveDown    = "move_down"
	ActionMoveBack    = "move_back"
	ActionMoveLeft    = "move_left"
	ActionMoveRight   = "move_right"
	ActionMoveForward = "move_forward"
	ActionSelect      = "select"
	ActionQuit        = "quit"
)
