"use client"
import React from 'react'
import { Card } from '@creo-team/buzz-ui/server'
import { Pagination } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function PaginationDocs() {
	const [page, setPage] = React.useState(1)
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Pagination</h1>
			<Card>
				<Pagination page={page} pageCount={10} onPageChange={setPage} />
				<div className="mt-4">
					<CodeBlock code={`import { Pagination } from '@creo-team/buzz-ui/client'

<Pagination page={page} pageCount={10} onPageChange={setPage} />`} />
				</div>
			</Card>
		</div>
	)
}


