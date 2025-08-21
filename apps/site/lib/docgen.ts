import fs from 'node:fs'
import path from 'node:path'

// Dynamic docgen for a given slug - generates documentation on-demand
export async function getDocgenForSlug(slug: string): Promise<Record<string, any>> {
	// Try to generate docs, but gracefully fall back if file system access fails
	try {
		return await generateOnDemandForSlug(slug)
	} catch (error) {
		console.warn('Docgen failed for slug:', slug, error)
		return {}
	}
}

async function generateOnDemandForSlug(slug: string): Promise<Record<string, any>> {
	try {
		// Resolve paths relative to the site package
		const repoRoot = path.resolve(process.cwd(), '..', '..')
		const librarySrc = path.join(repoRoot, 'packages', 'library', 'src')
		const tsconfig = path.join(repoRoot, 'packages', 'library', 'tsconfig.json')

		// Check if the library source directory exists (won't exist during Vercel build)
		if (!fs.existsSync(librarySrc)) {
			return {}
		}

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
	} catch (error) {
		// If anything fails (like during build), return empty results
		console.warn('Docgen failed:', error)
		return {}
	}
}

function listTsx(dir: string, acc: string[] = []): string[] {
	try {
		for (const name of fs.readdirSync(dir)) {
			const p = path.join(dir, name)
			const stat = fs.statSync(p)
			if (stat.isDirectory()) listTsx(p, acc)
			else if (stat.isFile() && p.endsWith('.tsx')) acc.push(p)
		}
	} catch (error) {
		// If directory access fails, return empty array
		console.warn('Failed to list TSX files:', error)
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


