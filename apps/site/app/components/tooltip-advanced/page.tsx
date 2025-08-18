"use client"
import { Card, Button } from '@creo-team/buzz-ui/server'
import { Tooltip } from '@creo-team/buzz-ui/client'


export default function TooltipAdvancedDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Tooltip (Advanced)</h1>
			<p className="mt-2 text-sm text-white/70">Shows custom animation and long text wrapping.</p>
			<Card>
				<div className="grid gap-4">
					<Tooltip content="This tooltip contains more text to demonstrate wrapping behavior and spacing for multi-line content that is still easy to read." contentClassName="max-w-xs whitespace-normal">
						<Button variant="outline">Long text</Button>
					</Tooltip>
					<Tooltip content="Advanced tooltip with custom styling" size="md">
						<Button variant="outline">Advanced tooltip</Button>
					</Tooltip>
				</div>
			</Card>
		</div>
	)
}
