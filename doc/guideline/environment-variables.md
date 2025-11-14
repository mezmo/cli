### Environment variables

**Environment variables are for behavior that _varies with the context_ in which a command is run.**
The “environment” of an environment variable is the terminal session—the context in which the command is running.
So, an env var might change each time a command runs, or between terminal sessions on one machine, or between instantiations of one project across several machines.

Environment variables may duplicate the functionality of flags or configuration parameters, or they may be distinct from those things.
See [Configuration](./configuration.md) for a breakdown of common types of configuration and recommendations on when environment variables are most appropriate.

**For maximum portability, environment variable names must only contain uppercase letters, numbers, and underscores (and mustn't start with a number).**
Which means `O_O` and `OWO` are the only emoticons that are also valid environment variable names.

**Aim for single-line environment variable values.**
While multi-line values are possible, they create usability issues with the `env` command.

**Avoid commandeering widely used names.**
Here’s a [list of POSIX standard env vars](https://pubs.opengroup.org/onlinepubs/009695399/basedefs/xbd_chap08.html).

**Check general-purpose environment variables for configuration values when possible:**

- `NO_COLOR`, to disable color (see [Output](./output.md)) or `FORCE_COLOR` to enable it and ignore the detection logic
- `DEBUG`, to enable more verbose output
- `EDITOR`, if you need to prompt the user to edit a file or input more than a single line
- `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY` and `NO_PROXY`, if you’re going to perform network operations
  (The HTTP library you’re using might already check for these.)
- `SHELL`, if you need to open up an interactive session of the user's preferred shell
  (If you need to execute a shell script, use a specific interpreter like `/bin/sh`)
- `TERM`, `TERMINFO` and `TERMCAP`, if you’re going to use terminal-specific escape sequences
- `TMPDIR`, if you’re going to create temporary files
- `HOME`, for locating configuration files
- `PAGER`, if you want to automatically page output
- `LINES` and `COLUMNS`, for output that’s dependent on screen size (e.g. tables)

**Read environment variables from `.env` where appropriate.**
If a command defines environment variables that are unlikely to change as long as the user is working in a particular directory,
then it should also read them from a local `.env` file so users can configure it differently for different projects without having to specify them every time.
Many languages have libraries for reading `.env` files ([Rust](https://crates.io/crates/dotenv), [Node](https://www.npmjs.com/package/dotenv), [Ruby](https://github.com/bkeepers/dotenv)).

**Don’t use `.env` as a substitute for a proper [configuration file](./configuration.md).**
`.env` files have a lot of limitations:

- A `.env` file is not commonly stored in source control
- (Therefore, any configuration stored in it has no history)
- It has only one data type: string
- It lends itself to being poorly organized
- It makes encoding issues easy to introduce
- It often contains sensitive credentials & key material that would be better stored more securely

If it seems like these limitations will hamper usability or security, then a dedicated config file might be more appropriate.

**Do not read secrets from environment variables.**
While environment variables may be convenient for storing secrets, they have proven too prone to leakage:
- Exported environment variables are sent to every process, and from there can easily leak into logs or be exfiltrated
- Shell substitutions like `curl -H "Authorization: Bearer $BEARER_TOKEN"` will leak into globally-readable process state.
  (cURL offers the `-H @filename` alternative for reading sensitive headers from a file.)
- Docker container environment variables can be viewed by anyone with Docker daemon access via `docker inspect`
- Environment variables in systemd units are globally readable via `systemctl show`

Secrets should only be accepted via credential files, pipes, `AF_UNIX` sockets, secret management services, or another IPC mechanism.

