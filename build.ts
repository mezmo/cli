/**
 * Compiles the mzm command into a standalone executable
 *
 * usage: bun build.ts <target> [target...]
 *
 * A target is one of the names in {@link TARGETS}, `local` for the machine
 * doing the build, or `all` for everything that gets released
 * @module
 */
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

type Target = {
  // the platform to compile for. The machine doing the build when omitted
  platform?: Bun.Build.CompileTarget
, outfile: string
}

const ROOT = import.meta.dir
const ENTRYPOINT = path.join(ROOT, 'main.ts')

// The file names are what released versions of the upgrade command ask for.
// Changing one leaves those versions unable to upgrade
const TARGETS: Record<string, Target> = {
  ['linux-x86_64']: {platform: 'bun-linux-x64', outfile: 'dist/mzm-linux-x86_64'}
, ['linux-aarch64']: {platform: 'bun-linux-arm64', outfile: 'dist/mzm-linux-aarch64'}
, ['darwin-x86_64']: {platform: 'bun-darwin-x64', outfile: 'dist/mzm-darwin-x86_64'}
, ['darwin-aarch64']: {platform: 'bun-darwin-arm64', outfile: 'dist/mzm-darwin-aarch64'}
, ['windows-x86_64']: {platform: 'bun-windows-x64', outfile: 'dist/mzm-windows-x86_64.exe'}
, ['local']: {outfile: 'mzm'}
}

const RELEASE_TARGETS = Object.keys(TARGETS).filter((name) => {
  return name !== 'local'
})

function usage(): string {
  return [
    'usage: bun build.ts <target> [target...]'
  , ''
  , 'targets:'
  , ...Object.keys(TARGETS).map((name) => {
      return `  ${name}`
    })
  , '  all'
  ].join('\n')
}

// The command must behave the same way no matter where it is run from.
// Nothing is read from the working directory when it starts
const COMPILE_FLAGS: Array<string> = [
  '--no-compile-autoload-dotenv'
, '--no-compile-autoload-bunfig'
, '--no-compile-autoload-tsconfig'
, '--no-compile-autoload-package-json'
]

/**
 * Compiles the command for a single target
 *
 * This runs `bun build` rather than calling `Bun.build()`. As of bun 1.4.3 a windows
 * executable compiled through `Bun.build()` starts with `import.meta.main` set to false,
 * which leaves main.ts with nothing to do. It exits cleanly without doing anything
 * @param name - the name of the target as found in {@link TARGETS}
 * @returns the location of the executable that was written
 */
async function compile(name: string): Promise<string> {
  const target = TARGETS[name]
  const outfile = path.join(ROOT, target.outfile)
  await fs.mkdir(path.dirname(outfile), {recursive: true})

  const args = ['build', '--compile', ...COMPILE_FLAGS, '--outfile', outfile]
  if (target.platform) args.push(`--target=${target.platform}`)
  args.push(ENTRYPOINT)

  const child = Bun.spawn([process.execPath, ...args], {
    cwd: ROOT
  , stdin: 'ignore'
  , stdout: 'pipe'
  , stderr: 'pipe'
  })

  const [exit_code, stdout, stderr] = await Promise.all([
    child.exited
  , new Response(child.stdout).text()
  , new Response(child.stderr).text()
  ])

  if (exit_code !== 0) {
    console.error(stdout + stderr)
    throw new Error(`Unable to compile ${name}`)
  }

  const {size} = await fs.stat(outfile)
  console.log('%s %s (%d MB)', name.padEnd(16), target.outfile, Math.round(size / 1024 / 1024))
  return outfile
}

async function main(args: Array<string>): Promise<void> {
  const names = new Set<string>()
  for (const arg of args) {
    if (arg === 'all') {
      for (const name of RELEASE_TARGETS) names.add(name)
      continue
    }

    if (!TARGETS[arg]) {
      console.error('Unknown target "%s"\n\n%s', arg, usage())
      process.exitCode = 2
      return
    }
    names.add(arg)
  }

  if (!names.size) {
    console.error(usage())
    process.exitCode = 2
    return
  }


  // one at a time. Each target downloads its own runtime the first time it is built
  for (const name of names) await compile(name)
}

if (import.meta.main) {
  await main(process.argv.slice(2))
}
