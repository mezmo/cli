Output mzm-delete.mp4

Require mzm

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

Type@0.2 'mzm delete -f view.yaml' Enter
Sleep 2s

Type@0.2 'mzm get view' Enter
Sleep 2s

