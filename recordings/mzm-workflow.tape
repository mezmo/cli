Output mzm-workflow.mp4

Require mzm
Require nvim
Require bat

Set Width 1200
Set Height 600

Env EDITOR nvim
Env BAT_PAGING never

Type@0.2 'mzm get view' Enter
Sleep 2s

Type@0.2 'bat view.yaml' Enter
Sleep 2s

Type@0.2 'mzm create -f view.yaml' Enter
Sleep 2s

Type@0.2 'mzm get view' Enter
Sleep 2s

Type@0.2 'mzm log tail --with-view' Enter
Down@1s
Right@1s
Down@1s
Down@1s
Enter
Sleep 10s
Ctrl+C

Type@0.2 'mzm edit v1/view/$(mzm get view -q "a new view")' Enter
Type@0.2 '/info' Enter
Sleep 1s

Type@0.2 'dd' Enter
Sleep 1s

Type@0.2 ':wq' Enter
Sleep 1s

Sleep 1s

Type@0.2 'mzm log tail --with-view' Enter
Down@1s
Right@1s
Down@1s
Down@1s
Enter
Sleep 10s
Ctrl+C

Type@0.2 'mzm delete -f view.yaml' Enter
Sleep 2s

Type@0.2 'mzm get view' Enter
Sleep 2s

