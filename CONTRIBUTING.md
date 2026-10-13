# Contributing

## Process

We use a fork-and-PR process, also known as a triangular workflow. This process
is fairly common in open-source projects. Here's the basic workflow:

1. *Fork* the upstream repo to create your own repo. This repo is called the origin repo.
2. *Clone* the origin repo to create a working directory on your local machine. 
3. Work your changes on a branch in your working directory, then add, commit, and push your work to your origin repo.
4. Submit your changes as a PR against the upstream repo. You can use the upstream repo UI to do this.
5. Maintainers review your changes. If they ask for changes, you work on your
   origin repo's branch and then submit another PR. Otherwise, if no changes are made, 
   then the branch with your PR is merged to upstream's main trunk, the master branch.

When you work in a triangular workflow, you have the upstream repo, the origin
repo, and then your working directory (the clone of the origin repo). You do 
a `git fetch` from upstream to local, push from local to origin, and then do a PR from origin to
upstream&mdash;a triangle.

If this workflow is too much to understand to start, that's ok! You can use
GitHub's UI to make a change, which is autoset to do most of this process for
you. We just want you to be aware of how the entire process works before
proposing a change.

Thank you for your contributions; we appreciate you!

## Building

The command is built with [Bun](https://bun.com). The version it is expected
to be built with is found in `.bun-version`.

```bash
bun install            # install dependencies
bun run test           # run the tests
bun run local -- help  # run from source
bun run compile:local  # compile ./mzm for your machine
bun run compile        # compile every platform into dist/
```

Every platform is compiled on linux by the build, which means most of the executables
cannot be run where they are made. Each build makes up for that in a few ways:

* The linux executable is run through `release/smoke.sh`
* The macOS executables are run on a mac, as compiled and again after they are signed
* The windows executable is **not run by the build**

### Changes that need a run on windows

Until the build has a way to run the windows executable, it has to be done by hand.
Do this before opening a pull request that does any of the following:

* changes the version in `.bun-version`
* changes `build.ts`, or anything under `release/`
* changes the `upgrade` command, or anything under `@mzm/core/update`

```bash
bun run compile:windows

# from WSL
release/smoke.sh dist/mzm-windows-x86_64.exe

# from Git Bash on windows
release/smoke.sh dist/mzm-windows-x86_64.exe
```

Include the output in the pull request.

### Upgrading bun

The version of bun used for a release is the one set up as a tool on the build server.
`.bun-version` records that version, so everyone knows what to expect. Change it in a pull
request of its own when the tool changes.

## License

Note that we use a standard [MIT](./LICENSE) license on this repo.

## Questions?

The easiest way to get our attention is to comment on an existing, or open a new
[issue][].

[issue]: https://github.com/mezmo/cli/issues
