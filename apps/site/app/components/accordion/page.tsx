"use client"
import { Card } from '@creo-team/buzz-ui/server'
import { Accordion } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function AccordionDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Accordion</h1>
			<Card>
				<Accordion items={[
					{ key: 'a', header: 'Section A', content: 'Content A' },
					{ key: 'b', header: 'Section B', content: 'Content B' },
				]} />
				<div className="mt-4">
					<CodeBlock code={`import { Accordion } from '@creo-team/buzz-ui/client'

<Accordion items={[
  { key: 'a', header: 'Section A', content: 'Content A' },
  { key: 'b', header: 'Section B', content: 'Content B' },
]} />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">API Reference</h2>
			<ApiTable
				title="Accordion Props"
				className="mt-4"
				rows={[
					{
						prop: "items",
						type: "AccordionItem[]",
						required: true,
						description: "Array of accordion items to display"
					},
					{
						prop: "defaultOpen",
						type: "string[]",
						description: "Array of item keys that should be open by default"
					},
					{
						prop: "allowMultiple",
						type: "boolean",
						default: "false",
						description: "Allow multiple items to be open simultaneously"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/accordion/api">/components/accordion/api</Link>
				</p>
			</div>
		</div>
	)
}


