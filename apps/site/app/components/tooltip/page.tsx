"use client"
import { Button, Tooltip } from '@creo-team/buzz-ui/client'
import { Card } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function TooltipDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Tooltip</h1>
			<p className="mt-2 text-sm text-white/70">Hover to reveal inline hints. Supports placement, delay, long text, and custom rendering.</p>
			<Card>
				<div className="flex flex-wrap gap-3">
					<Tooltip content="Top" placement="top"><Button variant="text">Top</Button></Tooltip>
					<Tooltip content="Right" placement="right"><Button variant="text">Right</Button></Tooltip>
					<Tooltip content="Bottom" placement="bottom"><Button variant="text">Bottom</Button></Tooltip>
					<Tooltip content="Left" placement="left"><Button variant="text">Left</Button></Tooltip>
					<Tooltip content="Delayed 1s" delayMs={1000}><Button variant="outline">Delay</Button></Tooltip>
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Tooltip } from '@creo-team/buzz-ui/client'

<Tooltip content="Hint" placement="top">
  <Button variant="text">Hover me</Button>
</Tooltip>`} />
				</div>
			</Card>
			<ApiTable
				title="API"
				className="mt-8"
				rows={[
					{
						prop: "content",
						type: "ReactNode",
						required: true,
						description: "Tooltip content"
					},
					{
						prop: "placement",
						type: "'top' | 'right' | 'bottom' | 'left'",
						default: "'bottom'",
						description: "Where the tooltip appears"
					},
					{
						prop: "delayMs",
						type: "number",
						default: "300",
						description: "Open delay"
					},
					{
						prop: "contentClassName",
						type: "string",
						default: "'whitespace-nowrap'",
						description: "Content container classes"
					}
				]}
			/>
			<p className="mt-6 text-sm text-white/70">See the full API: <Link className="text-[var(--c-link)]" href="/components/tooltip/api">/components/tooltip/api</Link></p>
		</div>
	)
}

