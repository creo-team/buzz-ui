/**
 * Monorepo dev: the site consumes the library's built dist, so local
 * iteration needs the library rebuilding on change alongside `next dev`.
 *
 *  1. one full library build (dist must exist before the site boots)
 *  2. `tsc --watch` re-emitting the library per save
 *  3. a watcher copying src/styles/buzz.css → dist/styles.css (tsc ignores css)
 *  4. `next dev` for the site
 */
import { spawn, execSync } from 'node:child_process'
import { copyFileSync, watch } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const library = join(root, 'packages/library')

execSync('npm run build -w @creo-team/buzz-ui', { cwd: root, stdio: 'inherit' })

const children = [
	spawn('npx', ['tsc', '-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'], {
		cwd: library,
		stdio: 'inherit',
	}),
	spawn('npm', ['run', 'dev', '-w', '@buzz-ui/site'], { cwd: root, stdio: 'inherit' }),
]

watch(join(library, 'src/styles/buzz.css'), () => {
	try {
		copyFileSync(join(library, 'src/styles/buzz.css'), join(library, 'dist/styles.css'))
		console.log('[dev] styles.css → dist')
	} catch {
		// transient editor rename/save race; the next event will copy
	}
})

const stop = () => {
	for (const child of children) child.kill('SIGINT')
	process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
