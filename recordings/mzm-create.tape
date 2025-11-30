Output assets/mzm-create.gif
Output assets/mzm-create.mp4

Require mzm

Set Shell "bash"
Set FontSize 14
Set FontFamily "Inconsolata Nerd Font Mono"
Set Width 1200
Set Height 600
Set BorderRadius 12
Set WindowBar ColorfulRight

Env EDITOR nvim
Env BAT_PAGING never

Sleep 2s
Type "mzm create category"
Enter
Sleep 500ms
Down@0.2s 6
Right@0.2s 8
Delete 6
Sleep 500ms
Type 'i'
Type@0.1 'Sample'
Escape 2
Down@0.2s 2
Shift+B
Type '/string' Enter
Delete 6
Sleep 1s
Type 'i'
Type@0.1s "views"
Escape 2
Sleep 500ms

Type ':wq' Enter
Sleep 500ms

Type@0.1s "mzm get category" Enter
Sleep 2s

Type@0.1s "mzm create view" Enter
Sleep 1s

# update name
Down@0.2s 6
Type@0.2s ':s/string/My First View/' Enter
Sleep 500ms

# update query
Type@0.1 '/query:' Enter
Right 7
Delete 6
Type 'i'
Type@0.2s 'foobar AND widget'
Escape 2
Sleep 500ms

# remove hosts
Type@0.1s '/hosts:' Enter
Type@0.1s 'dd'
Type@0.1s 'dd'
Sleep 500ms

# edit apps
Type@0.1 '/apps:/' Enter
Down@0.22
Right 4
Delete 6
Type 'i'
Type@0.2s 'python-test'
Escape 2
Sleep 1s

#edit levels
Type@0.1s '/levels:' Enter
Down@0.2s
Right 4
Delete 6
Type 'i'
Type@0.1s 'info'
Escape 2
Shift+A Enter
Type@0.1s '- debug' Enter
Escape 2
Sleep 1s

# remove tags
Type@0.1s '/tags:' Enter
Type 'dd'
Type 'dd'

# remove presetid
Type@0.1s '/presetid:' Enter
Type@0.1s 'dd'
Sleep 500ms

# remove channels
Type '/channels:' Enter
Type 'dd'
Sleep 500ms

# edit category

Type '/category:' Enter
Down 1
Right 4
Delete 6
Type 'i'
Type@0.1 'sample'
Escape
Sleep 500ms
Type ':wq' Enter

# check view
Sleep 500ms
Type@0.1 'mzm get view' Enter
Sleep 2s

Type@0.1s 'mzm log search --from "7 days ago" --with-view "my first view"' Enter
Sleep 2s

Type@0.2s 'mzm edit view "my first view"' Enter
Sleep 1s

Type@0.1s '/query:' Enter
Type@0.2s ':s/AND/OR/' Enter
Sleep 500ms
Type@0.1s ':wq' Enter
Sleep 500ms

Type@0.1s 'mzm log search --from "7 days ago" --with-view "my first view"' Enter
Sleep 5s
