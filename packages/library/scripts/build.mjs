/**
 * Build pipeline for @creo-team/buzz-ui
 *
 * Emits per-file ESM via tsc so that:
 *  - "use client" directives are preserved exactly per module (RSC-correct)
 *  - tree-shaking works at file granularity
 *  - output is valid native ESM (source imports carry explicit .js extensions)
 * Then copies the stylesheet and verifies the invariants below.
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const src = join(root, 'src')

const walk = (dir, ext) =>
	readdirSync(dir).flatMap(name => {
		const p = join(dir, name)
		return statSync(p).isDirectory() ? walk(p, ext) : ext.some(e => p.endsWith(e)) ? [p] : []
	})

const fail = (title, items) => {
	console.error(`\n${title}`)
	for (const item of items) console.error('  - ' + item)
	process.exit(1)
}

// 0. Verify the native-ESM invariant at the source: every relative import
//    must carry an explicit .js extension (tsc emits specifiers verbatim).
const extensionless = []
for (const file of walk(src, ['.ts', '.tsx'])) {
	const text = readFileSync(file, 'utf8')
	for (const match of text.matchAll(/from\s+['"](\.[^'"]*)['"]/g)) {
		if (!match[1].endsWith('.js') && !match[1].endsWith('.css')) {
			extensionless.push(`${file.replace(src + '/', 'src/')} → '${match[1]}'`)
		}
	}
}
if (extensionless.length) {
	fail('Relative imports must use explicit .js extensions (native ESM):', extensionless)
}

// 1. Clean
rmSync(dist, { recursive: true, force: true })

// 2. Type-emit
execSync('npx tsc -p tsconfig.build.json', { cwd: root, stdio: 'inherit' })

// 3. Ship the stylesheet
cpSync(join(src, 'styles/buzz.css'), join(dist, 'styles.css'))

// 4. Verify the RSC boundary: every emitted file that uses client-only React
//    APIs must begin with "use client".
const CLIENT_ONLY_APIS =
	/\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useSyncExternalStore|useTransition|useDeferredValue|useImperativeHandle|useInsertionEffect|useOptimistic|useActionState|useFormStatus|createPortal)\s*\(/
const problems = []
for (const file of walk(dist, ['.js'])) {
	const text = readFileSync(file, 'utf8')
	const hasDirective = /^["']use client["']/.test(text.trimStart())
	if (!hasDirective && CLIENT_ONLY_APIS.test(text)) {
		problems.push(file.replace(dist + '/', 'dist/'))
	}
}
if (problems.length) {
	fail('RSC boundary violation — client APIs without "use client":', problems)
}

if (!existsSync(join(dist, 'index.js'))) {
	fail('Build incomplete', ['dist/index.js was not produced'])
}

console.log('\n✓ build complete (per-file ESM, directives verified, styles.css shipped)')
