"use client"
import React from 'react'
import { Card, Badge } from '@creo-team/buzz-ui/server'
import { Fab } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function FabDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Fab</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				A Button pinned to a screen corner via <code>position: fixed</code> — every Button variant,
				size, hotkey and <code>asChild</code> polymorphism, just floating above page content instead
				of sitting in flow.
			</p>

			<Card className="mt-6" header="Try it">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Scroll this card — the two Fabs below are pinned to this preview panel's corners for
					the demo (in a real page they pin to the viewport).
				</p>
				<div className="relative mt-4 h-64 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-surface-2)]">
					<div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--c-text-muted)]">
						Page content
					</div>
					<Fab aria-label="Add" className="!absolute !bottom-4 !right-4">
						+
					</Fab>
					<Fab aria-label="Compose" variant="outline" position="bottom-left" className="!absolute !bottom-4 !left-4">
						✎ Compose
					</Fab>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Fab } from '@creo-team/buzz-ui/client'

// Classic circular FAB, bottom-right by default
<Fab aria-label="Add" iconOnly>+</Fab>

// Extended pill — icon + label children instead of iconOnly
<Fab aria-label="Compose" variant="outline">✎ Compose</Fab>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Position">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Five fixed positions. <code>bottom-center</code>/<code>top-center</code> center without
					using <code>transform</code>, so they don't fight Button's own hover-lift/press-scale
					animations.
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{(['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left'] as const).map(p => (
						<Badge key={p} variant="outline">
							{p}
						</Badge>
					))}
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`<Fab aria-label="Add" position="bottom-left">+</Fab>

// Distance from the viewport edge — default 24px
<Fab aria-label="Add" offset={40}>+</Fab>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Every Button feature, floating">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Fab wraps Button directly — variants, sizes, <code>loading</code>, <code>hotkey</code> and{' '}
					<code>asChild</code> all just work.
				</p>
				<CodeBlock
					code={`// A keyboard shortcut that also floats
<Fab aria-label="New note" hotkey="mod+j">+</Fab>

// asChild — a framework link styled and positioned as a Fab
<Fab asChild aria-label="Compose">
	<Link href="/compose">✎</Link>
</Fab>`}
				/>
			</Card>
		</div>
	)
}
