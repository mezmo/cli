### Naming

> “Note the obsessive use of abbreviations and avoidance of capital letters; [Unix] is a system invented by people to whom repetitive stress disorder is what black lung is to miners.
> Long names get worn down to three-letter nubbins, like stones smoothed by a river.”
> — Neal Stephenson, _[In the Beginning was the Command Line](https://web.stanford.edu/class/cs81n/command.txt)_

The name of your program is particularly important on the CLI: your users will be typing it all the time, and it needs to be easy to remember and type.

**Make it a simple, memorable word.**
But not too generic, or you’ll step on the toes of other commands and confuse users.
For example, both ImageMagick and Windows used the command `convert`.

**Use only lowercase letters, and dashes if you really need to.**
`curl` is a good name, `DownloadURL` is not.

**Keep it short.**
Users will be typing it all the time.
Don’t make it _too_ short: the very shortest commands are best reserved for the common utilities used all the time, such as `cd`, `ls`, `ps`.

**Make it easy to type.**
If you expect people to type your command name all day, make it easy on their hands.

A real-world example: long before Docker Compose was `docker compose`, it was [`plum`](https://github.com/aanand/fig/blob/0eb7d308615bae1ad4be1ca5112ac7b6b6cbfbaf/setup.py#L26).
This turned out to be such an awkward, one-handed hopscotch that it was immediately renamed to [`fig`](https://github.com/aanand/fig/commit/0cafdc9c6c19dab2ef2795979dc8b2f48f623379), which – as well as being shorter – flows much more easily.

#### Further Reading
* [The Poetics of CLI Command Names](https://smallstep.com/blog/the-poetics-of-cli-command-names/)

