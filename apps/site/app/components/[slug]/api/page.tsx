import { getDocgenForSlug } from '../../../../lib/docgen'
import { ApiTable } from '../../../../components/api-table'

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
							
							{/* Custom props table */}
							{d.props && Object.keys(d.props).length > 0 && (
								<ApiTable
									title="Props"
									className="mt-4"
									rows={Object.entries(d.props).map(([propName, p]: any) => ({
										prop: propName,
										type: p.type?.name || 'any',
										required: p.required || false,
										default: p.defaultValue?.value || undefined,
										description: p.description || ''
									}))}
								/>
							)}
							
							{/* Native props table */}
							{d._nativeProps && Object.keys(d._nativeProps).length > 0 && (
								<details className="mt-4">
									<summary className="cursor-pointer text-sm text-[var(--c-text-secondary)] hover:text-[var(--c-text)]">
										Show native HTML props
									</summary>
									<ApiTable
										title="Native HTML Props"
										className="mt-2"
										rows={Object.entries(d._nativeProps).map(([propName, p]: any) => ({
											prop: propName,
											type: p.type?.name || 'any',
											required: p.required || false,
											default: p.defaultValue?.value || undefined,
											description: p.description || ''
										}))}
									/>
								</details>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
