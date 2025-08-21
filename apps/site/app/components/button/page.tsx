"use client"
import { useState } from 'react'
import { Button as BuzzButton } from '@creo-team/buzz-ui/client'
import { Card } from '@creo-team/buzz-ui/client'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

const Button = BuzzButton as any

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
		{
			value: 'icon-only',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			),
		},
	]

	return (
		<div className="inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/30 backdrop-blur-sm p-0.5">
			{options.map((option) => (
				<Button
					key={option.value}
					variant="ghost"
					size="sm"
					selected={selected === option.value}
					onClick={() => setSelected(option.value)}
					className={`rounded-lg gap-1.5 ${
						selected === option.value 
							? 'bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm ring-1 ring-white/10 dark:ring-white/5' 
							: ''
					}`}
					iconOnly={!option.label}
				>
					{option.icon}
					{option.label}
				</Button>
			))}
		</div>
	)
}



export default function ButtonDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Button</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Trigger actions with consistent styling inspired by Umbro's clean design patterns. 
				Available in multiple variants and sizes with built-in loading states.
			</p>
			
			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Variants</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3">
						<Button variant="bold">Bold</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="subtle">Subtle</Button>
						<Button variant="glass">Glass</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button variant="success">Success</Button>
						<Button variant="danger">Danger</Button>
						<Button variant="nav">Navigation</Button>
						<Button variant="text">Text</Button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { Button } from '@creo-team/buzz-ui/client'

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button variant="bold">Bold</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="text">Text</Button>
    </div>
  )
}`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Sizes</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button variant="bold" size="sm">Small</Button>
					<Button variant="bold" size="md">Medium</Button>
					<Button variant="bold" size="lg">Large</Button>
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
						<Button variant="bold" disabled>Disabled</Button>
						<Button variant="bold" loading>Loading</Button>
						<Button variant="outline" disabled>Disabled Outline</Button>
					</div>
					<Button variant="bold" className="w-full">Full Width Button</Button>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button className="w-full">Full Width</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">With Icons</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button variant="bold">
							<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Add Item
						</Button>
						<Button variant="glass">
							<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							Save
						</Button>
						<Button variant="danger">
							<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							Delete
						</Button>
					</div>
					<h3 className="text-lg font-medium text-[var(--c-text)]">Icon Only Buttons</h3>
					<div className="flex flex-wrap items-center gap-3">
						<Button variant="icon" size="sm" iconOnly>
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
						</Button>
						<Button variant="icon" size="md" iconOnly>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</Button>
						<Button variant="icon" size="lg" iconOnly>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</Button>
						<Button variant="glass" size="md" iconOnly>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</Button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button variant="bold">
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>
<Button variant="text" size="sm">
  Download
  <DownloadIcon className="ml-2 h-4 w-4" />
</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Selected State</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button variant="bold" selected>
							Selected Bold
						</Button>
						<Button variant="outline" selected>
							Selected Outline
						</Button>
						<Button variant="subtle" selected>
							Selected Subtle
						</Button>
						<Button variant="nav" selected>
							Selected Nav
						</Button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button variant="bold" selected>
  Selected Bold
</Button>
<Button variant="outline" selected>
  Selected Outline
</Button>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Toggle Button Group</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<ToggleButtonGroup />
				</div>
				<div className="mt-6">
					<CodeBlock code={`function ToggleButtonGroup() {
  const [selected, setSelected] = useState('grid')

  return (
    <div className="flex rounded-lg border border-[var(--c-border)] p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="subtle"
          size="sm"
          selected={selected === option.value}
          onClick={() => setSelected(option.value)}
          className="rounded-md"
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



			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Interactive Examples</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button 
							variant="success" 
							onClick={() => alert('Success! 🎉')}
						>
							Click Me
						</Button>
						<Button 
							variant="outline"
							onClick={() => {
								const button = document.activeElement as HTMLButtonElement
								button.textContent = 'Clicked!'
								setTimeout(() => {
									button.textContent = 'Reset'
								}, 1000)
							}}
						>
							Reset
						</Button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Button 
  variant="success" 
  onClick={() => alert('Success! 🎉')}
>
  Click Me
</Button>`} />
				</div>
			</Card>



			<ApiTable
				title="API Reference"
				className="mt-12"
				rows={[
					{
						prop: "variant",
						type: "'bold' | 'outline' | 'subtle' | 'glass' | 'ghost' | 'icon' | 'text' | 'nav' | 'success' | 'danger'",
						default: "'bold'",
						description: "Visual style variant"
					},
					{
						prop: "size",
						type: "'sm' | 'md' | 'lg'",
						default: "'md'",
						description: "Size preset for padding and text"
					},
					{
						prop: "loading",
						type: "boolean",
						default: "false",
						description: "Shows spinner and disables button"
					},
					{
						prop: "selected",
						type: "boolean",
						default: "false",
						description: "Selected state for toggle buttons"
					},
					{
						prop: "iconOnly",
						type: "boolean",
						default: "false",
						description: "Renders button as circular icon-only button"
					},
					{
						prop: "...props",
						type: "HTMLMotionProps<'button'>",
						description: "All standard button attributes plus Framer Motion props"
					}
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					See the full API: <Link className="text-[var(--c-primary)] hover:underline" href="/components/button/api">/components/button/api</Link>
				</p>
			</div>
		</div>
	)
}

