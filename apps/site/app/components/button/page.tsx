"use client"
import { useState } from 'react'
import { Button } from '@creo-team/buzz-ui/client'
import { Card } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

function ToggleButtonGroup() {
	const [selected, setSelected] = useState('grid')
	
	const options = [
		{
			value: 'grid',
			label: 'Grid',
			icon: (
				<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
			),
		},
		{
			value: 'list',
			label: 'List',
			icon: (
				<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
				</svg>
			),
		},
		{
			value: 'card',
			label: 'Card',
			icon: (
				<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
			),
		},
	]

	return (
		<div className="inline-flex rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-1">
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
}

function FloatingMenu() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="relative">
			<Button
				variant="bold"
				selected={isOpen}
				onClick={() => setIsOpen(!isOpen)}
				className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl"
			>
				<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
				</svg>
			</Button>
			
			{isOpen && (
				<div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-in slide-in-from-bottom-2">
					<Button variant="outline" size="sm" className="rounded-full h-10 w-10 shadow-md">
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</Button>
					<Button variant="outline" size="sm" className="rounded-full h-10 w-10 shadow-md">
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
					</Button>
					<Button variant="outline" size="sm" className="rounded-full h-10 w-10 shadow-md">
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</Button>
				</div>
			)}
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
						<Button variant="text">Text</Button>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button variant="success">Success</Button>
						<Button variant="danger">Danger</Button>
						<Button variant="nav">Navigation</Button>
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
						<Button variant="outline">
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
						<Button variant="text" size="sm">
							Download
							<svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Floating Action Menu</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<FloatingMenu />
				</div>
				<div className="mt-6">
					<CodeBlock code={`function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="bold"
        selected={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl"
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <FileIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <FolderIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
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
						type: "'bold' | 'outline' | 'subtle' | 'text' | 'nav' | 'success' | 'danger'",
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
						prop: "...props",
						type: "HTMLButtonElement",
						description: "All standard button attributes"
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

