### Simple parts that work together

A core tenet of [the original UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) is the idea that small, simple programs with clean interfaces can be combined to build larger systems.
Rather than stuff more and more features into those programs, you make programs that are modular enough to be recombined as needed.

In the old days, pipes and shell scripts played a crucial role in the process of composing programs together.
Their role might have diminished with the rise of general-purpose interpreted languages, but they certainly haven’t gone away.
What’s more, large-scale automation—in the form of CI/CD, orchestration and configuration management—has flourished.
Making programs composable is just as important as ever.

Fortunately, the long-established conventions of the UNIX environment, designed for this exact purpose, still help us today.
Standard in/out/err, signals, exit codes and other mechanisms ensure that different programs click together nicely.
Plain, line-based text is easy to pipe between commands.
JSON, a much more recent invention, affords us more structure when we need it, and lets us more easily integrate command-line tools with the web.

Whatever software you’re building, you can be absolutely certain that people will use it in ways you didn’t anticipate.
Your software _will_ become a part in a larger system—your only choice is over whether it will be a well-behaved part.

Most importantly, designing for composability does not need to be at odds with designing for humans first.
Much of the advice in this document is about how to achieve both.
