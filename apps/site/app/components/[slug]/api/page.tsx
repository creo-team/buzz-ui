import { getDocgenForSlug } from '../../../../lib/docgen'

export default async function ApiPage({ params }: { params: { slug: string } }) {
	let api
	try {
		api = await getDocgenForSlug(params.slug)
	} catch (error) {
		console.warn('Failed to generate API docs:', error)
		api = {}
	}
	
	const entries = Object.entries(api)
	
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">{params.slug} API</h1>
			{entries.length === 0 && (
				<div className="mt-8 text-center">
					<p className="text-lg text-[var(--c-text-secondary)]">
						{process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' 
							? 'API documentation will be generated at runtime.'
							: 'No API data found.'
						}
					</p>
					<p className="mt-2 text-sm text-[var(--c-text-muted)]">
						This component's API documentation is generated dynamically from the source code.
					</p>
				</div>
			)}
			{entries.map(([file, docs]: any) => (
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
