#!/usr/bin/env node
import path from 'node:path'
import fs from 'node:fs'
import { withCustomConfig } from 'react-docgen-typescript'

const root = path.resolve(__dirname, '../../..')
const tsconfig = path.join(root, 'packages/library/tsconfig.json')
const librarySrc = path.join(root, 'packages/library/src')
const outDir = path.join(root, 'apps/site/public/api')

const parser = withCustomConfig(tsconfig, { savePropValueAsString: true, skipChildrenPropWithoutDoc: false })

function listTsx(dir: string, acc: string[] = []): string[] {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		const stat = fs.statSync(p)
		if (stat.isDirectory()) listTsx(p, acc)
		else if (stat.isFile() && p.endsWith('.tsx')) acc.push(p)
	}
	return acc
}

function main() {
	fs.mkdirSync(outDir, { recursive: true })
	const files = listTsx(librarySrc)
	const results: Record<string, any> = {}
	for (const file of files) {
		try {
			const docs = parser.parse(file)
			if (docs.length > 0) results[file.replace(librarySrc + '/', '')] = docs
		} catch {}
	}
	fs.writeFileSync(path.join(outDir, 'components.json'), JSON.stringify(results, null, 2))
	console.log('Wrote API JSON for', Object.keys(results).length, 'files')
}

main()
