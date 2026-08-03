"use client"
import React from 'react'
import { Card, Spinner, Separator, VisuallyHidden, Field, TextInput, Avatar, AvatarGroup } from '@creo-team/buzz-ui/server'
import { Kbd, formatHotkey } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function PrimitivesDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Primitives</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Small building blocks that keep apps consistent — all server-component safe.
			</p>

			<Card className="mt-6" header="Kbd">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					Keyboard-key chips. Pair with <code>formatHotkey</code> to render registered shortcuts
					(<code>mod</code> becomes ⌘ on macOS, Ctrl elsewhere).
				</p>
				<div className="flex items-center gap-2 text-sm">
					<Kbd>{formatHotkey('mod+k')}</Kbd>
					<Kbd>Esc</Kbd>
					<Kbd>↵</Kbd>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Kbd, formatHotkey } from '@creo-team/buzz-ui/client'

<Kbd>{formatHotkey('mod+k')}</Kbd>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Spinner">
				<div className="flex items-center gap-4">
					<Spinner size="xs" />
					<Spinner size="sm" />
					<Spinner size="md" />
					<Spinner size="lg" />
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Spinner } from '@creo-team/buzz-ui/server'

<Spinner size="md" label="Loading results" />`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Separator">
				<div className="text-sm text-[var(--c-text-secondary)]">
					Above the line
					<Separator className="my-3" />
					Below the line
				</div>
				<div className="flex items-center gap-3 mt-4 text-sm">
					<span>Left</span>
					<Separator orientation="vertical" className="h-4" />
					<span>Right</span>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`<Separator />
<Separator orientation="vertical" className="h-4" />`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="AvatarGroup">
				<AvatarGroup max={3}>
					<Avatar name="Ada Lovelace" />
					<Avatar name="Grace Hopper" />
					<Avatar name="Alan Turing" />
					<Avatar name="Katherine Johnson" />
					<Avatar name="Edsger Dijkstra" />
				</AvatarGroup>
				<div className="mt-4">
					<CodeBlock
						code={`import { Avatar, AvatarGroup } from '@creo-team/buzz-ui/server'

<AvatarGroup max={3}>
	<Avatar name="Ada Lovelace" />
	<Avatar name="Grace Hopper" />
	<Avatar name="Alan Turing" />
	<Avatar name="Katherine Johnson" />
	<Avatar name="Edsger Dijkstra" />
</AvatarGroup>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Field">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					The label/help/error chrome all Buzz UI form controls use — wrap your own controls to
					get identical wiring.
				</p>
				<Field htmlFor="custom-control" label="Custom control" helpText="Anything can live inside a Field">
					<input id="custom-control" className="bz-input" placeholder="A hand-rolled input" />
				</Field>
				<div className="mt-4">
					<CodeBlock
						code={`import { Field } from '@creo-team/buzz-ui/server'

<Field htmlFor="volume" label="Volume" error={error}>
	<MyCustomControl id="volume" />
</Field>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="VisuallyHidden">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					Screen-reader-only content — this card contains a hidden heading you can hear but not
					see.
				</p>
				<VisuallyHidden>Example hidden announcement for screen readers</VisuallyHidden>
				<CodeBlock
					code={`import { VisuallyHidden } from '@creo-team/buzz-ui/server'

<button>
	<TrashIcon aria-hidden />
	<VisuallyHidden>Delete item</VisuallyHidden>
</button>`}
				/>
			</Card>
		</div>
	)
}
