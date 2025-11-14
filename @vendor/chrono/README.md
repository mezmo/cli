This is used to translate the chrono npm package to a deno native package and vendor the output
We do this because including a npm package from npm in a deno compiled app adds 20 - 30MB to the
final output. Doing the bundle adds a few KB

To build this package

```bash
deno bundle --platform deno @vendor/chrono/main.ts  > chrono.ts
