"use client"
import { Card } from '@creo-team/buzz-ui/server'
import { Accordion } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

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
		</div>
	)
}


