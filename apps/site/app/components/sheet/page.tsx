"use client"
import React from 'react'
import { Card, Button } from '@creo-team/buzz-ui/client'
import { Sheet } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function SheetDocs() {
	const [open, setOpen] = React.useState(false)
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Sheet</h1>
			<Card>
				<Button onClick={() => setOpen(true)}>Open sheet</Button>
				<div className="mt-4">
					<CodeBlock code={`import { Sheet } from '@creo-team/buzz-ui/client'

<Sheet open={open} onClose={() => setOpen(false)} header="Quick actions">
  ...
</Sheet>`} />
				</div>
			</Card>
			<Sheet open={open} onClose={() => setOpen(false)} header="Quick actions">
				<div className="grid gap-2 text-sm text-white/80">
					<button className="rounded-md border border-[var(--c-border)] px-3 py-1.5 hover:bg-[var(--c-hover)]">Create</button>
					<button className="rounded-md border border-[var(--c-border)] px-3 py-1.5 hover:bg-[var(--c-hover)]">Invite</button>
				</div>
			</Sheet>
		</div>
	)
}


