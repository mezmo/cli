### Future-proofing

In software of any kind, it’s crucial that interfaces don’t change without a lengthy and well-documented deprecation process.
Subcommands, arguments, flags, configuration files, environment variables: these are all interfaces, and you’re committing to keeping them working.
([Semantic versioning](https://semver.org/) can only excuse so much change; if you’re putting out a major version bump every month, it’s meaningless.)

**Keep changes additive where you can.**
Rather than modify the behavior of a flag in a backwards-incompatible way, maybe you can add a new flag—as long as it doesn’t bloat the interface too much.
(See also: [Prefer flags to args](#arguments-and-flags).)

**Warn before you make a non-additive change.**
Eventually, you’ll find that you can’t avoid breaking an interface.
Before you do, forewarn your users in the program itself: when they pass the flag you’re looking to deprecate, tell them it’s going to change soon.
Make sure there’s a way they can modify their usage today to make it future-proof, and tell them how to do it.

If possible, you should detect when they’ve changed their usage and not show the warning any more: now they won’t notice a thing when you finally roll out the change.

**Changing output for humans is usually OK.**
The only way to make an interface easy to use is to iterate on it, and if the output is considered an interface, then you can’t iterate on it.
Encourage your users to use `--plain` or `--json` in scripts to keep output stable (see [Output](./output.md)).

**Don’t have a catch-all subcommand.**
If you have a subcommand that’s likely to be the most-used one, you might be tempted to let people omit it entirely for brevity’s sake.
For example, say you have a `run` command that wraps an arbitrary shell command:

    $ mycmd run echo "hello world"

You could make it so that if the first argument to `mycmd` isn’t the name of an existing subcommand, you assume the user means `run`, so they can just type this:

    $ mycmd echo "hello world"

This has a serious drawback, though: now you can never add a subcommand named `echo`—or _anything at all_—without risking breaking existing usages.
If there’s a script out there that uses `mycmd echo`, it will do something entirely different after that user upgrades to the new version of your tool.

**Don’t allow arbitrary abbreviations of subcommands.**
For example, say your command has an `install` subcommand.
When you added it, you wanted to save users some typing, so you allowed them to type any non-ambiguous prefix, like `mycmd ins`, or even just `mycmd i`, and have it be an alias for `mycmd install`.
Now you’re stuck: you can’t add any more commands beginning with `i`, because there are scripts out there that assume `i` means `install`.

There’s nothing wrong with aliases—saving on typing is good—but they should be explicit and remain stable.

**Don’t create a “time bomb.”**
Imagine it’s 20 years from now.
Will your command still run the same as it does today, or will it stop working because some external dependency on the internet has changed or is no longer maintained?
The server most likely to not exist in 20 years is the one that you are maintaining right now.
(But don’t build in a blocking call to Google Analytics either.)
