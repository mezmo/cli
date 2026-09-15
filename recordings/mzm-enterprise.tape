# Enterprise access keys: working across the accounts of an enterprise
#
# Requires an enterprise access key (MZM_ACCESS_KEY, prefixed ste_) to already
# be set in the environment this tape is run from. The tape never sets, reads
# back, or prints the key itself.

Output assets/mzm-enterprise.gif
Output assets/mzm-enterprise.mp4

Require mzm

Set Shell "bash"
Set FontSize 14
Set FontFamily "Inconsolata Nerd Font Mono"
Set Width 1200
Set Height 600
Set BorderRadius 12
Set WindowBar ColorfulRight
Set TypingSpeed 75ms

# The accounts of the enterprise. The active account is marked with *
Type "mzm get account" Enter
Sleep 3s

Type "mzm get account -o json" Enter
Sleep 3s
Ctrl+L

# Switch accounts by id, by name, or by a loose match on the name.
# When more than one account matches, you choose from the matches.
Type "mzm set account 71c7b3b74f" Enter
Sleep 2s

Type 'mzm set account "Test Company B"' Enter
Sleep 2s

Type 'mzm set account "sattrwhite & co"' Enter
Sleep 1500ms
Down@500ms
Up@500ms
Sleep 500ms
Enter
Sleep 2s

# Or choose from every account of the enterprise
Type "mzm set account" Enter
Sleep 1500ms
Down@500ms
Down@500ms
Up@500ms
Sleep 500ms
Enter
Sleep 2s

# Commands run as the active account
Type "mzm get view" Enter
Sleep 2s

# or as any other account, without switching
Type 'mzm get view --account $(mzm get account "test company a" -q)' Enter
Sleep 3s
Ctrl+L

# Search the logs of the active account
Type "mzm log search --from '1 hour ago' --to now -n 10" Enter
Sleep 4s

# Search another account without switching
Type "mzm log search --account 2150506f3e --from '1 hour ago' --to now -n 10" Enter
Sleep 4s
