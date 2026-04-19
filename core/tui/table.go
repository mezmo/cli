package tui

import (
	"os"

	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/renderer"
	"github.com/olekukonko/tablewriter/tw"
)

func NewTable() *tablewriter.Table {

	table := tablewriter.NewTable(
		os.Stdout,
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
	)
	return table
}
