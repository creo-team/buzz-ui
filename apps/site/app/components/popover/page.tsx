"use client"
import React from 'react'
import { Card, Button, TextInput } from '@creo-team/buzz-ui/server'
import { Popover, PopoverTrigger, PopoverContent } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function PopoverDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Popover</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				A composable anchored panel — the general-purpose building block for rich hovers, quick
				forms and filters. Rendered in a portal with collision-aware positioning; Escape and
				outside-press dismiss it, and focus returns to the trigger.
			</p>

			<Card className="mt-6" header="Basic">
				<div className="flex flex-wrap gap-4">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Open popover</Button>
						</PopoverTrigger>
						<PopoverContent>
							<div className="space-y-2 text-sm">
								<div className="font-semibold text-[var(--c-text)]">Quick note</div>
								<p className="text-[var(--c-text-secondary)]">
									Anything can live here — forms, actions, previews.
								</p>
							</div>
						</PopoverContent>
					</Popover>

					<Popover side="right" align="start">
						<PopoverTrigger asChild>
							<Button variant="subtle">Right / start</Button>
						</PopoverTrigger>
						<PopoverContent>Positioned to the right, aligned to the top.</PopoverContent>
					</Popover>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Popover, PopoverTrigger, PopoverContent } from '@creo-team/buzz-ui/client'

<Popover>
	<PopoverTrigger asChild>
		<Button variant="outline">Open popover</Button>
	</PopoverTrigger>
	<PopoverContent>Anything can live here.</PopoverContent>
</Popover>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="With a form">
				<Popover side="bottom" align="start">
					<PopoverTrigger asChild>
						<Button>Edit dimensions</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64">
						<div className="space-y-3">
							<TextInput label="Width" defaultValue="320" />
							<TextInput label="Height" defaultValue="180" />
						</div>
					</PopoverContent>
				</Popover>
				<div className="mt-4">
					<CodeBlock
						code={`<Popover side="bottom" align="start">
	<PopoverTrigger asChild>
		<Button>Edit dimensions</Button>
	</PopoverTrigger>
	<PopoverContent className="w-64">
		<TextInput label="Width" defaultValue="320" />
		<TextInput label="Height" defaultValue="180" />
	</PopoverContent>
</Popover>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Controlled">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					Drive it from state with <code>open</code> / <code>onOpenChange</code>, or start open
					with <code>defaultOpen</code>.
				</p>
				<CodeBlock
					code={`const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
	<PopoverTrigger asChild><Button>Toggle</Button></PopoverTrigger>
	<PopoverContent>Controlled content</PopoverContent>
</Popover>`}
				/>
			</Card>
		</div>
	)
}
