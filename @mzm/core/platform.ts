import * as path from 'node:path'

// The names deno used for the operating system and cpu architecture.
// Release assets and the asset maps of binaries that are already installed
// are keyed by these names, so they are kept rather than the ones node / bun use
export type OS = 'linux' | 'darwin' | 'windows'
export type Arch = 'x86_64' | 'aarch64'

const OS_NAMES: Record<string, OS> = {
  win32: 'windows'
}

const ARCH_NAMES: Record<string, Arch> = {
  x64: 'x86_64'
, arm64: 'aarch64'
}

const RUNTIME_NAMES: Set<string> = new Set(['bun', 'bunx', 'bun-debug', 'bun-profile'])

/**
 * Converts a node style platform name (process.platform) to the name used for release assets
 * @returns the normalized name. Platforms without a release are returned as they were given
 */
export function normalizeOS(platform: string): string {
  return OS_NAMES[platform] ?? platform
}

/**
 * Converts a node style architecture name (process.arch) to the name used for release assets
 * @returns the normalized name. Architectures without a release are returned as they were given
 */
export function normalizeArch(architecture: string): string {
  return ARCH_NAMES[architecture] ?? architecture
}

/**
 * Determines if an executable is a compiled release rather than the bun runtime running the source
 * @param exec_path - location of the executable running the current process
 */
export function isCompiled(exec_path: string = process.execPath): boolean {
  // the windows path module understands both kinds of separator
  const name = path.win32.parse(exec_path).name.toLowerCase()
  return !RUNTIME_NAMES.has(name)
}

export const os: string = normalizeOS(process.platform)
export const arch: string = normalizeArch(process.arch)
export const WINDOWS: boolean = os === 'windows'
