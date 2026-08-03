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
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Accessible tooltips: shown on hover <em>and</em> keyboard focus, dismissed with Escape,
				positioned in a portal with collision handling — never clipped by overflow containers.
			</p>
			<Card className="mt-4">
				<div className="space-y-6">
					<div>
						<h3 className="text-sm font-medium text-[var(--c-text)] mb-3">Direction Examples</h3>
						<div className="flex flex-wrap gap-3">
							<Tooltip content="Top tooltip" placement="top"><Button variant="text">Top</Button></Tooltip>
							<Tooltip content="Right tooltip" placement="right"><Button variant="text">Right</Button></Tooltip>
							<Tooltip content="Bottom tooltip" placement="bottom"><Button variant="text">Bottom</Button></Tooltip>
							<Tooltip content="Left tooltip" placement="left"><Button variant="text">Left</Button></Tooltip>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-[var(--c-text)] mb-3">Size Examples</h3>
						<div className="flex flex-wrap gap-3">
							<Tooltip content="Small tooltip" size="sm"><Button variant="outline" size="sm">Small</Button></Tooltip>
							<Tooltip content="Medium tooltip" size="md"><Button variant="outline">Medium</Button></Tooltip>
							<Tooltip content="Large tooltip with more content" size="lg"><Button variant="outline" size="lg">Large</Button></Tooltip>
							<Tooltip
								content="Extra large tooltip with way more content than you probably need, but hey, sometimes you gotta explain the whole tech stack in a tooltip because your PM thinks users want to know that this button uses React with TypeScript compiled via Turbo and deployed on Vercel's edge network. Classic PM move, am I right? 🤷‍♂️"
								size="lg"
								delayMs={200}
							>
								<Button variant="subtle" size="lg">Extra Large</Button>
							</Tooltip>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-[var(--c-text)] mb-3">Delay Example</h3>
						<div className="flex flex-wrap gap-3">
							<Tooltip content="Quick tooltip" delayMs={100}><Button variant="subtle">Fast (100ms)</Button></Tooltip>
							<Tooltip content="Standard tooltip" delayMs={400}><Button variant="subtle">Standard (400ms)</Button></Tooltip>
							<Tooltip content="Slow tooltip" delayMs={1000}><Button variant="subtle">Slow (1000ms)</Button></Tooltip>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-[var(--c-text)] mb-3">Rich content & titles</h3>
						<div className="flex flex-wrap gap-3">
							<Tooltip title="Keyboard friendly" content="Tab to this button — the tooltip shows on focus too, and Escape dismisses it." size="md">
								<Button variant="outline">Focus me (Tab)</Button>
							</Tooltip>
							<Tooltip
								size="md"
								content={
									<div className="space-y-1">
										<div className="font-semibold">Deploy status</div>
										<div>Last deploy finished 4 minutes ago. The pointer can travel into this bubble.</div>
									</div>
								}
							>
								<Button variant="outline">Rich content</Button>
							</Tooltip>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<CodeBlock code={`import { Tooltip, TooltipDirection, TooltipSize } from '@creo-team/buzz-ui/client'

// Basic usage — hover and keyboard focus both show it
<Tooltip content="Simple tooltip">
	<Button>Hover me</Button>
</Tooltip>

// Positioning and size
<Tooltip content="Right side" placement="right" size="md">
	<Button>Right</Button>
</Tooltip>

// Optional bold title above the content
<Tooltip title="Heads up" content="Rich explanation lives here." size="md">
	<Button>With title</Button>
</Tooltip>

// Controlled
<Tooltip content="Always visible" open onOpenChange={setOpen}>
	<Button>Controlled</Button>
</Tooltip>

// Animations are CSS-driven — override the styling hooks if you want a
// different feel (no animation library involved):
// .bz-tooltip { animation: my-entrance 200ms ease; }`} />
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
						description: "Tooltip content (text or React elements)"
					},
					{
						prop: "title",
						type: "string",
						description: "Optional bold heading rendered above the content"
					},
					{
						prop: "direction",
						type: "TooltipDirection",
						default: "TooltipDirection.Bottom",
						description: "Preferred side; flips automatically when there is no room"
					},
					{
						prop: "placement",
						type: "'top' | 'right' | 'bottom' | 'left'",
						default: "'bottom'",
						description: "Legacy alias for direction (still supported)"
					},
					{
						prop: "size",
						type: "TooltipSize | 'sm' | 'md' | 'lg' | 'xl'",
						default: "TooltipSize.Compact",
						description: "Size preset (padding + max width)"
					},
					{
						prop: "delayMs",
						type: "number",
						default: "400",
						description: "Hover delay before showing (focus shows immediately)"
					},
					{
						prop: "open",
						type: "boolean",
						description: "Controlled visibility"
					},
					{
						prop: "onOpenChange",
						type: "(open: boolean) => void",
						description: "Visibility change callback"
					},
					{
						prop: "widthClassName / contentClassName",
						type: "string",
						description: "Extra classes for the bubble"
					}
				]}
			/>
			<p className="mt-6 text-sm text-[var(--c-text-secondary)]">See the full API: <Link className="text-[var(--c-link)]" href="/components/tooltip/api">/components/tooltip/api</Link></p>
		</div>
	)
}
