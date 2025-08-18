import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withCustomConfig } from 'react-docgen-typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../../..')
const tsconfig = path.join(root, 'packages/library/tsconfig.json')
const librarySrc = path.join(root, 'packages/library/src')
const outDir = path.join(root, 'apps/site/public/api')

const parser = withCustomConfig(tsconfig, { savePropValueAsString: true, skipChildrenPropWithoutDoc: false })

const nativePropPrefixes = ['aria-', 'data-', 'on', 'role', 'tabIndex', 'id', 'className', 'style', 'title', 'type', 'disabled', 'name', 'value', 'default']

function isNativeProp(name) {
	return nativePropPrefixes.some(p => name === p || name.startsWith(p))
}

function listTsx(dir, acc = []) {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		const stat = fs.statSync(p)
		if (stat.isDirectory()) listTsx(p, acc)
		else if (stat.isFile() && p.endsWith('.tsx')) acc.push(p)
	}
	return acc
}

function pruneProps(docs) {
	return docs.map(d => {
		const props = d.props ?? {}
		const custom = {}
		const native = {}
		for (const [k, v] of Object.entries(props)) {
			if (isNativeProp(k)) native[k] = v
			else custom[k] = v
		}
		return { ...d, props: custom, _nativeProps: native }
	})
}

function main() {
	fs.mkdirSync(outDir, { recursive: true })
	const files = listTsx(librarySrc)
	const results = {}
	for (const file of files) {
		try {
			const docs = parser.parse(file)
			if (docs.length > 0) results[file.replace(librarySrc + '/', '')] = pruneProps(docs)
		} catch {}
	}
	fs.writeFileSync(path.join(outDir, 'components.json'), JSON.stringify(results, null, 2))
	console.log('Wrote API JSON for', Object.keys(results).length, 'files')
}

main()
