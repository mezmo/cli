Output mzm-chat.mp4

Require mzm
Set Shell "bash"
Set FontSize 14
Set FontFamily "Inconsolata Nerd Font Mono"
Set Width 1200
Set Height 600
Set BorderRadius 12
Set WindowBar ColorfulRight

Type@0.2 'mzm get conversation' Enter
Sleep 2s

Type@0.2 'mzm ask' Enter
Sleep 6s

Type@0.2 'what time is it?' Enter
Sleep 6s

Type@0.2 'What is the difference between an app and a host?' Enter
Sleep 10s
Ctrl+C

Type@0.2 'mzm get conversation' Enter
Sleep 2s

Type@0.2 'mzm ask --continue cs_dd45bae3f3e94ef89a815645b59f062b' Enter
Sleep 5s

Type@0.2 'Update that query to include the warning log level' Enter
Sleep 10s
Ctrl+C

Type@0.2 'mzm ask --continue $(mzm get conversation  -o json | jq -r ". | last .conversation_session_id")' Enter
Sleep 2s

Type@0.2 'What were we talking about?' Enter
Sleep 10s
Ctrl+C

Type@0.2 'mzm get conversation' Enter
Sleep 2s

Type@0.2 'mzm get conversation cs_dd45bae3f3e94ef89a815645b59f062b -o json | jq .' Enter
Sleep 2s
