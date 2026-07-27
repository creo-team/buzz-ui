/**
 * Build pipeline for @creo-team/buzz-ui
 *
 * Emits per-file ESM via tsc so that:
 *  - "use client" directives are preserved exactly per module (RSC-correct)
 *  - tree-shaking works at file granularity
 *  - output is valid native ESM (source imports carry explicit .js extensions)
 * Then copies the stylesheet and verifies the RSC boundary.
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

// 1. Clean
rmSync(dist, { recursive: true, force: true })

// 2. Type-emit
execSync('npx tsc -p tsconfig.build.json', { cwd: root, stdio: 'inherit' })

// 3. Ship the stylesheet
cpSync(join(root, 'src/styles/buzz.css'), join(dist, 'styles.css'))

// 4. Verify the RSC boundary: every emitted file that uses client-only React
//    APIs must begin with "use client".
const CLIENT_APIS = /\buse(State|Effect|LayoutEffect|Reducer|Ref|SyncExternalStore|Transition|ImperativeHandle|OptimisticState)?\s*\(/
const walk = dir =>
	readdirSync(dir).flatMap(name => {
		const p = join(dir, name)
		return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []
	})

const problems = []
for (const file of walk(dist)) {
	const src = readFileSync(file, 'utf8')
	const hasDirective = /^["']use client["']/.test(src.trimStart())
	const usesClientApis = /\b(useState|useEffect|useLayoutEffect|useReducer|useSyncExternalStore|useTransition|useImperativeHandle|createPortal)\s*\(/.test(src)
	if (usesClientApis && !hasDirective) {
		problems.push(file.replace(dist + '/', ''))
	}
}
if (problems.length) {
	console.error('\nRSC boundary violation — client APIs without "use client":')
	for (const p of problems) console.error('  - ' + p)
	process.exit(1)
}

if (!existsSync(join(dist, 'index.js'))) {
	console.error('Build did not produce dist/index.js')
	process.exit(1)
}

console.log('\n✓ build complete (per-file ESM, directives preserved, styles.css shipped)')
