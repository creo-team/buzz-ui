"use client"
import React from 'react'
import { Card } from '@creo-team/buzz-ui/server'
import { Pagination } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function PaginationDocs() {
	const [page, setPage] = React.useState(5)
	const [compactPage, setCompactPage] = React.useState(2)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Pagination</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Numbered page navigation with ellipsis collapsing, edge pages, and{' '}
				<code>aria-current</code> on the active page.
			</p>

			<Card className="mt-6" header="Numbered">
				<Pagination page={page} pageCount={20} onPageChange={setPage} />
				<div className="mt-4">
					<CodeBlock
						code={`import { Pagination } from '@creo-team/buzz-ui/client'

<Pagination page={page} pageCount={20} onPageChange={setPage} />`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="More siblings">
				<Pagination page={page} pageCount={20} onPageChange={setPage} siblingCount={2} />
				<div className="mt-4">
					<CodeBlock code={`<Pagination page={page} pageCount={20} siblingCount={2} onPageChange={setPage} />`} />
				</div>
			</Card>

			<Card className="mt-6" header="Compact">
				<Pagination page={compactPage} pageCount={9} compact onPageChange={setCompactPage} />
				<div className="mt-4">
					<CodeBlock code={`<Pagination page={page} pageCount={9} compact onPageChange={setPage} />`} />
				</div>
			</Card>
		</div>
	)
}
