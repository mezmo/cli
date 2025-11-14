### The Basics

There are a few basic rules you need to follow.
Get these wrong, and your program will be either very hard to use, or flat-out broken.

**Use a command-line argument parsing library where you can.**
Either your language’s built-in one, or a good third-party one.
They will normally handle arguments, flag parsing, help text, and even spelling suggestions in a sensible way.

Here are some that we like:
* Multi-platform: [docopt](http://docopt.org)
* Bash: [argbash](https://argbash.dev)
* Go: [Cobra](https://github.com/spf13/cobra), [cli](https://github.com/urfave/cli)
* Haskell: [optparse-applicative](https://hackage.haskell.org/package/optparse-applicative)
* Java: [picocli](https://picocli.info/)
* Julia: [ArgParse.jl](https://github.com/carlobaldassi/ArgParse.jl), [Comonicon.jl](https://github.com/comonicon/Comonicon.jl)
* Kotlin: [clikt](https://ajalt.github.io/clikt/)
* Node: [oclif](https://oclif.io/), [seeli](https://github.com/esatterwhite/node-seeli)
* Deno: [parseArgs](https://jsr.io/@std/cli/doc/parse-args/~/parseArgs)
* Perl: [Getopt::Long](https://metacpan.org/pod/Getopt::Long)
* PHP: [console](https://github.com/symfony/console), [CLImate](https://climate.thephpleague.com)
* Python: [Argparse](https://docs.python.org/3/library/argparse.html), [Click](https://click.palletsprojects.com/), [Typer](https://github.com/tiangolo/typer)
* Ruby: [TTY](https://ttytoolkit.org/)
* Rust: [clap](https://docs.rs/clap)
* Swift: [swift-argument-parser](https://github.com/apple/swift-argument-parser)

**Return zero exit code on success, non-zero on failure.**
Exit codes are how scripts determine whether a program succeeded or failed, so you should report this correctly.
Map the non-zero exit codes to the most important failure modes.

**Send output to `stdout`.**
The primary output for your command should go to `stdout`.
Anything that is machine readable should also go to `stdout`—this is where piping sends things by default.

**Send messaging to `stderr`.**
Log messages, errors, and so on should all be sent to `stderr`.
This means that when commands are piped together, these messages are displayed to the user and not fed into the next command.
