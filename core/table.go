package core

import (
	"io"

	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/renderer"
	"github.com/olekukonko/tablewriter/tw"
)

// NewTable returns a borderless, left aligned table that merges repeated
// leading cells hierarchically. Extra options are applied after the defaults.
func NewTable(w io.Writer, opts ...tablewriter.Option) *tablewriter.Table {
	options := []tablewriter.Option{
		tablewriter.WithRenderer(
			renderer.NewBlueprint(
				tw.Rendition{
					Borders: tw.BorderNone,
					Settings: tw.Settings{
						Separators: tw.Separators{
							ShowHeader:     tw.Off,
							ShowFooter:     tw.Off,
							BetweenRows:    tw.Off,
							BetweenColumns: tw.Off,
						},
						Lines: tw.Lines{
							ShowTop:        tw.Off,
							ShowBottom:     tw.Off,
							ShowHeaderLine: tw.Off,
							ShowFooterLine: tw.Off,
						},
					},
				},
			),
		),
		tablewriter.WithConfig(
			tablewriter.Config{
				Header: tw.CellConfig{
					Alignment: tw.CellAlignment{Global: tw.AlignLeft},
				},
				Row: tw.CellConfig{
					Merging: tw.CellMerging{Mode: tw.MergeHierarchical},
				},
			},
		),
	}
	return tablewriter.NewTable(w, append(options, opts...)...)
}
