"use client"
import { useState } from 'react'
import { Button } from '@creo-team/buzz-ui/client'
import { Card } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

const WEIGHTS = ['solid', 'soft', 'outline', 'ghost', 'link'] as const
const TONES = ['primary', 'neutral', 'success', 'danger'] as const

function VariantToneMatrix() {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-separate border-spacing-y-3">
				<thead>
					<tr>
						<th className="w-24 text-left text-xs font-medium uppercase tracking-wide text-[var(--c-text-muted)]">
							tone ↓
						</th>
						{WEIGHTS.map(weight => (
							<th key={weight} className="text-left text-xs font-medium uppercase tracking-wide text-[var(--c-text-muted)]">
								{weight}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{TONES.map(tone => (
						<tr key={tone}>
							<td className="pr-4 text-sm text-[var(--c-text-secondary)]">{tone}</td>
							{WEIGHTS.map(weight => (
								<td key={weight} className="pr-3">
									<Button variant={weight} tone={tone} size="sm">
										Button
									</Button>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

function ToggleButtonGroup() {
	const [selected, setSelected] = useState('grid')

	const options = [
		{
			value: 'grid',
			label: 'Grid',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
			),
		},
		{
			value: 'list',
			label: 'List',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
				</svg>
			),
		},
		{
			value: 'card',
			label: 'Card',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
			),
		},
	]

	return (
		<div className="inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/30 backdrop-blur-xs p-0.5">
			{options.map(option => (
				<Button
					key={option.value}
					variant="ghost"
					size="sm"
					selected={selected === option.value}
					onClick={() => setSelected(option.value)}
					className="rounded-lg gap-1.5"
				>
					{option.icon}
					{option.label}
				</Button>
			))}
		</div>
	)
}

export default function ButtonDocs() {
	const [saving, setSaving] = useState(false)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Button</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				One button, two axes: <code className="text-[var(--c-primary)]">variant</code> sets the visual
				weight (how much attention it demands) and <code className="text-[var(--c-primary)]">tone</code>{' '}
				sets the meaning (brand, neutral, success, danger). Every pairing works — no more one-off
				variants for every color.
			</p>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Variants — visual weight</h2>
			<p className="mt-2 text-[var(--c-text-secondary)]">
				From strongest to quietest. A view usually wants exactly one <code>solid</code> button; support
				it with <code>outline</code>, <code>soft</code> or <code>ghost</code> neighbors.
			</p>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button>Solid</Button>
					<Button variant="soft">Soft</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
					<Button variant="glass">Glass</Button>
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { Button } from '@creo-team/buzz-ui/client'

<Button>Solid</Button>              {/* the default */}
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="glass">Glass</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Tones — meaning</h2>
			<p className="mt-2 text-[var(--c-text-secondary)]">
				Tones re-color any weight. Omitted, <code>solid</code> and <code>link</code> default to{' '}
				<code>primary</code> while the quieter weights default to <code>neutral</code> — chrome stays
				chrome unless you say otherwise.
			</p>
			<Card variant="elevated" className="mt-4">
				<VariantToneMatrix />
				<div className="mt-6">
					<CodeBlock code={`<Button tone="danger">Delete</Button>              {/* solid danger */}
<Button variant="soft" tone="success">Approve</Button>
<Button variant="outline" tone="danger">Remove</Button>
<Button variant="ghost" tone="primary">Learn more</Button>
<Button tone="neutral">High contrast</Button>      {/* inverse button */}`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Sizes</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">States</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button disabled>Disabled</Button>
						<Button loading>Loading</Button>
						<Button variant="outline" disabled>
							Disabled Outline
						</Button>
						<Button
							loading={saving}
							onClick={() => {
								setSaving(true)
								setTimeout(() => setSaving(false), 1500)
							}}
						>
							{saving ? 'Saving…' : 'Save changes'}
						</Button>
					</div>
					<Button fullWidth>Full Width Button</Button>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button fullWidth>Full Width</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">With icons</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button>
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Add Item
						</Button>
						<Button variant="outline">
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							Save
						</Button>
						<Button tone="danger">
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							Delete
						</Button>
					</div>
					<h3 className="text-lg font-medium text-[var(--c-text)]">Icon-only buttons</h3>
					<div className="flex flex-wrap items-center gap-3">
						<Button variant="ghost" size="sm" iconOnly aria-label="Add">
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
						</Button>
						<Button variant="ghost" size="md" iconOnly aria-label="Favorite">
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</Button>
						<Button variant="soft" size="md" iconOnly aria-label="Settings">
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</Button>
						<Button variant="glass" size="md" iconOnly aria-label="Search">
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</Button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button>
  <PlusIcon className="h-4 w-4" />
  Add Item
</Button>

{/* Icon-only: circular hit area; always label it for screen readers */}
<Button variant="ghost" iconOnly aria-label="Settings">
  <GearIcon className="h-5 w-5" />
</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Selected state</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button selected>Solid</Button>
					<Button variant="outline" selected>
						Outline
					</Button>
					<Button variant="soft" selected>
						Soft
					</Button>
					<Button variant="ghost" selected>
						Ghost
					</Button>
				</div>
				<div className="mt-6">
					<CodeBlock code={`{/* selected sets aria-pressed — use it for toggles */}
<Button variant="ghost" selected={view === 'grid'} onClick={() => setView('grid')}>
  Grid
</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Toggle button group</h2>
			<Card variant="elevated" className="mt-4">
				<ToggleButtonGroup />
				<div className="mt-6">
					<CodeBlock code={`function ToggleButtonGroup() {
  const [selected, setSelected] = useState('grid')

  return (
    <div className="inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] p-0.5">
      {options.map(option => (
        <Button
          key={option.value}
          variant="ghost"
          size="sm"
          selected={selected === option.value}
          onClick={() => setSelected(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  )
}`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Migrating from v0.6</h2>
			<Card variant="elevated" className="mt-4">
				<p className="text-[var(--c-text-secondary)]">
					The ten flat v0.6 variants keep working as deprecated aliases — no breakage — but new code
					should use the axes:
				</p>
				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-[var(--c-border)] text-[var(--c-text-muted)]">
								<th className="py-2 pr-6 font-medium">v0.6</th>
								<th className="py-2 font-medium">now</th>
							</tr>
						</thead>
						<tbody className="text-[var(--c-text-secondary)]">
							{[
								['variant="bold"', '(default — just <Button>)'],
								['variant="success"', 'tone="success"'],
								['variant="danger"', 'tone="danger"'],
								['variant="subtle"', 'variant="soft"'],
								['variant="text"', 'variant="link"'],
								['variant="nav"', 'variant="ghost"'],
								['variant="icon"', 'variant="ghost" iconOnly'],
							].map(([from, to]) => (
								<tr key={from} className="border-b border-[var(--c-border)]/50">
									<td className="py-2 pr-6">
										<code>{from}</code>
									</td>
									<td className="py-2">
										<code>{to}</code>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>

			<ApiTable
				title="API Reference"
				className="mt-12"
				rows={[
					{
						prop: 'variant',
						type: "'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'glass'",
						default: "'solid'",
						description: 'Visual weight. v0.6 names are accepted as deprecated aliases.',
					},
					{
						prop: 'tone',
						type: "'primary' | 'neutral' | 'success' | 'danger'",
						default: "'primary' (solid/link), 'neutral' otherwise",
						description: 'Semantic color, orthogonal to variant.',
					},
					{
						prop: 'size',
						type: "'sm' | 'md' | 'lg'",
						default: "'md'",
						description: 'Size preset for padding and text.',
					},
					{
						prop: 'loading',
						type: 'boolean',
						default: 'false',
						description: 'Shows a spinner, disables interaction, sets aria-busy.',
					},
					{
						prop: 'selected',
						type: 'boolean',
						description: 'Toggle state — sets aria-pressed and the selected styling.',
					},
					{
						prop: 'hotkey',
						type: "string | { key, description?, action? }",
						description: "Keyboard shortcut that clicks the button (e.g. 'mod+s').",
					},
					{
						prop: 'iconOnly',
						type: 'boolean',
						default: 'false',
						description: 'Circular icon button — pair with aria-label.',
					},
					{
						prop: 'fullWidth',
						type: 'boolean',
						default: 'false',
						description: "Stretch to the container's width.",
					},
					{
						prop: 'asChild',
						type: 'boolean',
						default: 'false',
						description: 'Render the child element (e.g. a framework Link) with button styling.',
					},
					{
						prop: '...props',
						type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
						description: 'All standard button attributes.',
					},
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					See the full API:{' '}
					<Link className="text-[var(--c-primary)] hover:underline" href="/components/button/api">
						/components/button/api
					</Link>
				</p>
			</div>
		</div>
	)
}
