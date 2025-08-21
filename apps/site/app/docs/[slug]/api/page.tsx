import fs from 'node:fs'
import path from 'node:path'
import { getDocgenForSlug } from '../../../../lib/docgen'

function readApi() {
	try {
		const p = path.join(process.cwd(), 'public/api/components.json')
		const raw = fs.readFileSync(p, 'utf8')
		return JSON.parse(raw) as Record<string, any>
	} catch {
		return {}
	}
}

function findDocsFor(slug: string, api: Record<string, any>) {
	const name = slug.replace(/-/g, '')
	const entries = Object.entries(api)
	return entries.filter(([file]) => file.toLowerCase().includes(name))
}

export default async function ApiPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	let api = readApi()
	let matches = findDocsFor(slug, api)
	if (matches.length === 0) {
		api = await getDocgenForSlug(slug)
		const entries = Object.entries(api)
		matches = entries
	}
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">{slug} API</h1>
			{matches.length === 0 && <p className="mt-2 text-sm text-white/70">No API data found.</p>}
			{matches.map(([file, docs]: any) => (
				<div key={file} className="mt-6">
					<h2 className="text-lg font-semibold">{file}</h2>
					{docs.map((d: any) => (
						<div key={d.displayName} className="mt-4">
							<h3 className="text-base font-semibold">{d.displayName}</h3>
							<table className="mt-2 w-full text-left text-sm">
								<thead><tr className="text-white/60"><th className="py-2 pr-4">Prop</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Required</th><th className="py-2">Description</th></tr></thead>
								<tbody>
									{Object.entries(d.props ?? {}).map(([propName, p]: any) => (
										<tr key={propName}><td className="py-2 pr-4">{propName}</td><td className="py-2 pr-4"><code>{p.type?.name}</code></td><td className="py-2 pr-4">{p.required ? 'yes' : 'no'}</td><td className="py-2">{p.description}</td></tr>
									))}
								</tbody>
							</table>
							{d._nativeProps && Object.keys(d._nativeProps).length > 0 && (
								<details className="mt-4">
									<summary className="cursor-pointer text-sm text-white/70 hover:text-white">Show native HTML props</summary>
									<table className="mt-2 w-full text-left text-sm">
										<thead><tr className="text-white/60"><th className="py-2 pr-4">Prop</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Required</th><th className="py-2">Description</th></tr></thead>
										<tbody>
											{Object.entries(d._nativeProps).map(([propName, p]: any) => (
												<tr key={propName}><td className="py-2 pr-4">{propName}</td><td className="py-2 pr-4"><code>{p.type?.name}</code></td><td className="py-2 pr-4">{p.required ? 'yes' : 'no'}</td><td className="py-2">{p.description}</td></tr>
											))}
										</tbody>
									</table>
								</details>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
