### Conversation as the norm

GUI design, particularly in its early days, made heavy use of _metaphor_: desktops, files, folders, recycle bins.
It made a lot of sense, because computers were still trying to bootstrap themselves into legitimacy.
The ease of implementation of metaphors was one of the huge advantages GUIs wielded over CLIs.
Ironically, though, the CLI has embodied an accidental metaphor all along: it’s a conversation.

Beyond the most utterly simple commands, running a program usually involves more than one invocation.
Usually, this is because it’s hard to get it right the first time: the user types a command, gets an error, changes the command, gets a different error, and so on, until it works.
This mode of learning through repeated failure is like a conversation the user is having with the program.

Trial-and-error isn’t the only type of conversational interaction, though.
There are others:

- Running one command to set up a tool and then learning what commands to run to actually start using it.
- Running several commands to set up an operation, and then a final command to run it (e.g. multiple `git add`s, followed by a `git commit`).
- Exploring a system—for example, doing a lot of `cd` and `ls` to get a sense of a directory structure, or `git log` and `git show` to explore the history of a file.
- Doing a dry-run of a complex operation before running it for real.

Acknowledging the conversational nature of command-line interaction means you can bring relevant techniques to bear on its design.
You can suggest possible corrections when user input is invalid, you can make the intermediate state clear when the user is going through a multi-step process, you can confirm for them that everything looks good before they do something scary.

The user is conversing with your software, whether you intended it or not.
At worst, it’s a hostile conversation which makes them feel stupid and resentful.
At best, it’s a pleasant exchange that speeds them on their way with newfound knowledge and a feeling of achievement.

#### Further Reading

* [The Anti-Mac User Interface (Don Gentner and Jakob Nielsen)](https://www.nngroup.com/articles/anti-mac-interface/)

