package assets

import (
	"strings"

	style "github.com/phoenix-tui/phoenix/style"
)

// Logo returns the ASCII art logo for the Mezmo CLI
func Logo() string {
	bold := style.New().Bold(true)
	gold := style.RGB(255, 215, 0) // Gold color
	goldStyle := style.New().Foreground(gold)

	lines := []string{
		style.Render(goldStyle, "                                                                ,,,,,           "),
		style.Render(goldStyle, "                                                               ,,,,,,,          "),
		style.Render(goldStyle, "                                                              ,,,,,,,,,         "),
		style.Render(goldStyle, "                                                             ,,,,,,,,,,,        "),
		style.Render(goldStyle, "                                                         ,,,,,,,,,,,,,,,,,,     "),
		style.Render(goldStyle, "                                                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,"),
		style.Render(goldStyle, "                                                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,"),
		style.Render(goldStyle, "                                                         ,,,,,,,,,,,,,,,,,,     "),
		style.Render(goldStyle, "                                                             ,,,,,,,,,,,        "),
		style.Render(goldStyle, "                                                              ,,,,,,,,,         "),
		style.Render(bold, "@@@@@@@@     @@@@@@@@@@@@         @@@@@@@@@@@@@") + style.Render(goldStyle, "                ,,,,,,,          "),
		style.Render(bold, "@@@@@@@@  @@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@") + style.Render(goldStyle, "              ,,,,,           "),
		style.Render(bold, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                             "),
		style.Render(bold, "@@@@@@@@@@           @@@@@@@@@@@           @@@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
		style.Render(bold, "@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            "),
	}

	return strings.Join(lines, "\n")
}
