import fs from 'node:fs'
import path from 'node:path'

// Dev-only dynamic docgen for a given slug. In production, returns empty.
export async function getDocgenForSlug(slug: string): Promise<Record<string, any>> {
	try {
		// Try pre-generated file first for speed; if present and has matches, use it
		const pregen = readGeneratedApi()
		const matches = filterMatchesForSlug(slug, pregen)
		if (matches && Object.keys(matches).length > 0) return matches
	} catch {}

	return await generateOnDemandForSlug(slug)
}

function readGeneratedApi(): Record<string, any> {
	const p = path.join(process.cwd(), 'public/api/components.json')
	const raw = fs.readFileSync(p, 'utf8')
	return JSON.parse(raw) as Record<string, any>
}

function filterMatchesForSlug(slug: string, api: Record<string, any>): Record<string, any> {
	const normalized = slug.replace(/-/g, '').toLowerCase()
	const entries = Object.entries(api).filter(([file]) => file.toLowerCase().includes(normalized))
	return Object.fromEntries(entries)
}

async function generateOnDemandForSlug(slug: string): Promise<Record<string, any>> {
	// Resolve paths relative to the site package
	const repoRoot = path.resolve(process.cwd(), '..', '..')
	const librarySrc = path.join(repoRoot, 'packages', 'library', 'src')
	const tsconfig = path.join(repoRoot, 'packages', 'library', 'tsconfig.json')

	// Lazy import to avoid bundling in the client
	const { withCustomConfig } = await import('react-docgen-typescript')
	const parser = withCustomConfig(tsconfig, { savePropValueAsString: true, skipChildrenPropWithoutDoc: false })

	const files = listTsx(librarySrc)
	const normalized = slug.replace(/-/g, '').toLowerCase()
	const candidates = files.filter(f => f.replace(librarySrc + '/', '').toLowerCase().includes(normalized))

	const results: Record<string, any> = {}
	for (const file of candidates) {
		try {
			const docs = parser.parse(file)
			if (docs.length > 0) {
				results[file.replace(librarySrc + '/', '')] = pruneProps(docs)
			}
		} catch {}
	}
	return results
}

function listTsx(dir: string, acc: string[] = []): string[] {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		const stat = fs.statSync(p)
		if (stat.isDirectory()) listTsx(p, acc)
		else if (stat.isFile() && p.endsWith('.tsx')) acc.push(p)
	}
	return acc
}

const nativePropPrefixes = ['aria-', 'data-', 'on', 'role', 'tabIndex', 'id', 'className', 'style', 'title', 'type', 'disabled', 'name', 'value', 'default']

function isNativeProp(name: string) {
	return nativePropPrefixes.some(p => name === p || name.startsWith(p))
}

function pruneProps(docs: any[]) {
	return docs.map(d => {
		const props = d.props ?? {}
		const custom: Record<string, any> = {}
		const native: Record<string, any> = {}
		for (const [k, v] of Object.entries(props)) {
			if (isNativeProp(k)) native[k] = v
			else custom[k] = v
		}
		return { ...d, props: custom, _nativeProps: native }
	})
}


