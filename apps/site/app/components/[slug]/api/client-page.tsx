'use client'

import { useState, useEffect } from 'react'
import { parseComponentFromSource, getComponentSource } from '../../../../lib/client-docgen'
import { ApiTable } from '../../../../components/api-table'

export default function ClientApiPage({ params }: { params: { slug: string } }) {
	const [api, setApi] = useState<any>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function generateDocs() {
			try {
				setLoading(true)
				// Get the component source code
				const sourceCode = await getComponentSource(params.slug)
				
				// Parse it to extract API information
				const components = parseComponentFromSource(sourceCode)
				
				// Format the results to match the expected structure
				const results: Record<string, any> = {}
				if (components.length > 0) {
					results[`${params.slug}.tsx`] = components.map(comp => ({
						...comp,
						_nativeProps: {} // You could extract these too
					}))
				}
				
				setApi(results)
			} catch (err) {
				console.error('Failed to generate API docs:', err)
				setError('Failed to generate API documentation')
			} finally {
				setLoading(false)
			}
		}

		generateDocs()
	}, [params.slug])

	const entries = Object.entries(api)

	if (loading) {
		return (
			<div className="mx-auto max-w-6xl px-4 py-12">
				<h1 className="text-2xl font-semibold">{params.slug} API</h1>
				<div className="mt-8 text-center">
					<p className="text-lg text-[var(--c-text-secondary)]">
						Generating API documentation...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="mx-auto max-w-6xl px-4 py-12">
				<h1 className="text-2xl font-semibold">{params.slug} API</h1>
				<div className="mt-8 text-center">
					<p className="text-lg text-[var(--c-text-secondary)]">
						{error}
					</p>
					<p className="mt-2 text-sm text-[var(--c-text-muted)]">
						This component's API documentation is generated dynamically from the source code.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">{params.slug} API</h1>
			{entries.length === 0 && (
				<div className="mt-8 text-center">
					<p className="text-lg text-[var(--c-text-secondary)]">
						No API data found
					</p>
					<p className="mt-2 text-sm text-[var(--c-text-muted)]>
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
										default: undefined,
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
											default: undefined,
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
