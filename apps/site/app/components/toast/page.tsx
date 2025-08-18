"use client"
import React from 'react'
import { Card, Button } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function ToastDocs() {
	const handleShowToast = () => {
		alert('Saved successfully')
	}

	const handleCustomToast = () => {
		alert('Custom content example')
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Toast</h1>
			<Card>
				<div className="flex items-center gap-3">
					<Button onClick={handleShowToast}>Show toast</Button>
					<Button variant="subtle" onClick={handleCustomToast}>Custom content</Button>
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { useToast } from '@creo-team/buzz-ui/client'

const { push } = useToast()
push('Saved successfully')`} />
				</div>
			</Card>
			<h2 className="mt-8 text-lg font-semibold">API</h2>
			<table className="mt-2 w-full text-left text-sm">
				<thead><tr className="text-white/60"><th className="py-2 pr-4">Hook</th><th className="py-2 pr-4">Type</th><th className="py-2">Description</th></tr></thead>
				<tbody>
					<tr><td className="py-2 pr-4">useToast().push</td><td className="py-2 pr-4">(node: ReactNode) =&gt; void</td><td className="py-2">Enqueue a toast</td></tr>
				</tbody>
			</table>
		</div>
	)
}
