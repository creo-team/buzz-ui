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
			<p className="mt-2 text-sm text-white/70">Elegant tooltips with smooth animations. Supports positioning, delays, and custom styling.</p>
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
							<Tooltip content="Standard tooltip" delayMs={500}><Button variant="subtle">Standard (500ms)</Button></Tooltip>
							<Tooltip content="Slow tooltip" delayMs={1000}><Button variant="subtle">Slow (1000ms)</Button></Tooltip>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-[var(--c-text)] mb-3">Custom Animations</h3>
						<div className="flex flex-wrap gap-3">
							<Tooltip 
								content="Bouncy spring entrance with scale" 
								animationVariants={{
									initial: { opacity: 0, y: 10, scale: 0.8 },
									animate: { opacity: 1, y: 0, scale: 1 },
									exit: { opacity: 0, y: -10, scale: 0.8 },
									transition: { type: "spring", bounce: 0.4, duration: 0.6 }
								}}
							>
								<Button variant="outline">Bouncy</Button>
							</Tooltip>
							<Tooltip 
								content="Smooth slide from the left" 
								animationVariants={{
									initial: { opacity: 0, x: -20 },
									animate: { opacity: 1, x: 0 },
									exit: { opacity: 0, x: 20 },
									transition: { type: "spring", stiffness: 300, damping: 30 }
								}}
							>
								<Button variant="outline">Slide</Button>
							</Tooltip>
							<Tooltip 
								content="Elegant fade with subtle scale" 
								animationVariants={{
									initial: { opacity: 0, scale: 0.95 },
									animate: { opacity: 1, scale: 1 },
									exit: { opacity: 0, scale: 0.95 },
									transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
								}}
							>
								<Button variant="outline">Fade</Button>
							</Tooltip>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<CodeBlock code={`import { 
  Tooltip, 
  TooltipDirection, 
  TooltipSize,
  AnimationPresets,
  type TooltipAnimationVariants 
} from '@creo-team/buzz-ui/client'

// Basic usage - uses elegant default animations
<Tooltip content="Simple tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Using animation presets
<Tooltip 
  content="Bouncy tooltip"
  animationVariants={AnimationPresets.tooltip.bouncy}
>
  <Button>Bouncy</Button>
</Tooltip>

// Custom animation with proper TypeScript types
const customAnimation: TooltipAnimationVariants = {
  initial: { opacity: 0, y: 10, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.8 },
  transition: { type: "spring", bounce: 0.4, duration: 0.6 }
}

<Tooltip 
  content="Custom animation" 
  animationVariants={customAnimation}
>
  <Button>Custom</Button>
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
						description: "Tooltip content (text or React elements)"
					},
					{
						prop: "direction",
						type: "TooltipDirection",
						default: "TooltipDirection.Bottom",
						description: "Direction where tooltip appears (new API)"
					},
					{
						prop: "placement",
						type: "'top' | 'right' | 'bottom' | 'left'",
						default: "'bottom'",
						description: "Where the tooltip appears (legacy, still supported)"
					},
					{
						prop: "size",
						type: "TooltipSize | 'sm' | 'md' | 'lg'",
						default: "TooltipSize.Compact",
						description: "Size of the tooltip"
					},
					{
						prop: "delayMs",
						type: "number",
						default: "500",
						description: "Show delay in milliseconds"
					},
					{
						prop: "open",
						type: "boolean",
						description: "Controlled open state (optional)"
					},
					{
						prop: "animationVariants",
						type: "TooltipAnimationVariants",
						description: "Custom Framer Motion animation variants with TypeScript support"
					}
				]}
			/>
			<p className="mt-6 text-sm text-white/70">See the full API: <Link className="text-[var(--c-link)]" href="/components/tooltip/api">/components/tooltip/api</Link></p>
		</div>
	)
}

