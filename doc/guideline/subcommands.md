### Subcommands

If you’ve got a tool that’s sufficiently complex, you can reduce its complexity by making a set of subcommands.
If you have several tools that are very closely related, you can make them easier to use and discover by combining them into a single command (for example, RCS vs. Git).

They’re useful for sharing stuff—global flags, help text, configuration, storage mechanisms.

**Be consistent across subcommands.**
Use the same flag names for the same things, have similar output formatting, etc. 

**Use consistent names for multiple levels of subcommand.**
If a complex piece of software has lots of objects and operations that can be performed on those objects, it is a common pattern to use two levels of subcommand for this, where one is a noun and one is a verb.
For example, `docker container create`.
Be consistent with the verbs you use across different types of objects.

Either `noun verb` or `verb noun` ordering works, but `noun verb` seems to be more common.

**Don’t have ambiguous or similarly-named commands.**
For example, having two subcommands called “update” and “upgrade” is quite confusing.
You might want to use different words, or disambiguate with extra words.

#### Further Reading

* [User experience, CLIs, and breaking the world, by John Starich](https://uxdesign.cc/user-experience-clis-and-breaking-the-world-baed8709244f)
