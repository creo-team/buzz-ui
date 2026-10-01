/**
 * Fails the site typecheck unless `tsc` is the TypeScript 7 native compiler.
 *
 * The root installs Microsoft's side-by-side pair: `@typescript/native`
 * (typescript@7, bin `tsc`) and `typescript` → `@typescript/typescript6`
 * (bin `tsc6`). The 6.0 package depends on `@typescript/old`
 * (typescript@6), which also declares a `tsc` bin, so two packages claim
 * `node_modules/.bin/tsc` and npm links the 7 one only by sort order. Run
 * through npm, this script sees the same PATH as the `tsc` after it.
 */
import { execSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { delimiter, join } from 'node:path'

const REQUIRED_MAJOR = 7
const TSC_BIN = process.platform === 'win32' ? 'tsc.cmd' : 'tsc'

function findOnPath(bin) {
	const dir = (process.env.PATH ?? '').split(delimiter).find(entry => entry && existsSync(join(entry, bin)))
	return dir ? realpathSync(join(dir, bin)) : 'not found on PATH'
}

function getTscVersion() {
	try {
		return execSync('tsc --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
	} catch (error) {
		return `tsc failed to run: ${error instanceof Error ? error.message : String(error)}`
	}
}

const version = getTscVersion()
const major = Number(/^Version (\d+)\./.exec(version)?.[1])

if (major !== REQUIRED_MAJOR) {
	console.error(`Expected tsc to be TypeScript ${REQUIRED_MAJOR}, got: ${version}`)
	console.error(`Resolved tsc: ${findOnPath(TSC_BIN)}`)
	console.error('Reinstall with `npm ci`; if it persists, node_modules/.bin/tsc is linked to @typescript/old instead of @typescript/native.')
	process.exit(1)
}

console.log(`tsc: ${version}`)
