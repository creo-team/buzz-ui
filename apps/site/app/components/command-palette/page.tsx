"use client"
import React, { useState } from 'react'
import { Breadcrumbs } from '@creo-team/buzz-ui/server'
import { Button, CommandPalette } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '@/components/code-block'
import { ApiTable } from '@/components/api-table'
import Link from 'next/link'

export default function CommandPalettePage() {
	const [open, setOpen] = useState(false)

	const commands = [
		{
			id: 'new-file',
			label: 'New File',
			description: 'Create a new file',
			group: 'File',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			),
			keywords: ['create', 'document'],
			onSelect: () => alert('Creating new file...'),
		},
		{
			id: 'open-file',
			label: 'Open File',
			description: 'Open an existing file',
			group: 'File',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
				</svg>
			),
			keywords: ['browse', 'load'],
			onSelect: () => alert('Opening file browser...'),
		},
		{
			id: 'save',
			label: 'Save',
			description: 'Save the current file',
			group: 'File',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
				</svg>
			),
			keywords: ['store', 'persist'],
			onSelect: () => alert('Saving file...'),
		},
		{
			id: 'copy',
			label: 'Copy',
			description: 'Copy selection to clipboard',
			group: 'Edit',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
			),
			keywords: ['duplicate', 'clipboard'],
			onSelect: () => alert('Copied to clipboard'),
		},
		{
			id: 'paste',
			label: 'Paste',
			description: 'Paste from clipboard',
			group: 'Edit',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
			),
			keywords: ['clipboard', 'insert'],
			onSelect: () => alert('Pasted from clipboard'),
		},
		{
			id: 'find',
			label: 'Find',
			description: 'Search in current file',
			group: 'Edit',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			),
			keywords: ['search', 'locate'],
			onSelect: () => alert('Opening search...'),
		},
		{
			id: 'settings',
			label: 'Open Settings',
			description: 'Configure application preferences',
			group: 'View',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			),
			keywords: ['preferences', 'config', 'options'],
			onSelect: () => alert('Opening settings...'),
		},
		{
			id: 'toggle-theme',
			label: 'Toggle Theme',
			description: 'Switch between light and dark mode',
			group: 'View',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
			),
			keywords: ['dark', 'light', 'appearance'],
			onSelect: () => alert('Toggling theme...'),
		},
		{
			id: 'help',
			label: 'Show Help',
			description: 'View documentation and shortcuts',
			group: 'Help',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			),
			keywords: ['documentation', 'support', 'shortcuts'],
			onSelect: () => alert('Opening help...'),
		},
		{
			id: 'about',
			label: 'About',
			description: 'Information about this application',
			group: 'Help',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			),
			keywords: ['info', 'version'],
			onSelect: () => alert('Showing about dialog...'),
		},
	]

	// Simulate opening with keyboard shortcut
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setOpen(true)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<div>
			<Breadcrumbs items={[
				{ key: 'home', label: 'Home', href: '/' },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'command-palette', label: 'Command Palette' }
			]} />
			
			<h1 className="mt-6 text-4xl font-bold text-[var(--c-text)]">Command Palette</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				A searchable command interface for quick access to actions and navigation.
			</p>

			<div className="mt-10">
				<h2 className="text-2xl font-bold text-[var(--c-text)]">Examples</h2>

				<div className="mt-6">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Basic Usage</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						Open the command palette to search and execute commands. Try typing "file", "copy", or "theme".
					</p>
					
					<div className="mt-4 flex flex-wrap gap-4">
						<Button onClick={() => setOpen(true)}>
							Open Command Palette
						</Button>
						<div className="flex items-center gap-2 text-sm text-[var(--c-text-secondary)]">
							<span>Or press</span>
							<kbd className="px-2 py-1 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-xs">
								⌘K
							</kbd>
						</div>
					</div>

					<CodeBlock code={`import { useState } from 'react'
import { Button, CommandPalette } from '@creo-team/buzz-ui/client'

const commands = [
	{
		id: 'new-file',
		label: 'New File',
		description: 'Create a new file',
		group: 'File',
		icon: <FileIcon className="h-4 w-4" />,
		keywords: ['create', 'document'],
		onSelect: () => console.log('Creating new file...'),
	},
	{
		id: 'open-settings',
		label: 'Open Settings',
		description: 'Configure application preferences',
		group: 'View',
		icon: <SettingsIcon className="h-4 w-4" />,
		keywords: ['preferences', 'config'],
		onSelect: () => console.log('Opening settings...'),
	},
]

export default function Example() {
	const [open, setOpen] = useState(false)

	// Open with Cmd+K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setOpen(true)
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				Open Command Palette
			</Button>
			
			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				items={commands}
				placeholder="Type a command or search..."
			/>
		</>
	)
`} />
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Features</h3>
					<ul className="mt-2 space-y-2 text-[var(--c-text-secondary)]">
						<li>• Fuzzy search across command labels, descriptions, and keywords</li>
						<li>• Keyboard navigation with arrow keys</li>
						<li>• Grouped commands for better organization</li>
						<li>• Icons and descriptions for visual clarity</li>
						<li>• ESC to close, Enter to execute</li>
						<li>• Automatic result counting</li>
					</ul>
				</div>

				<ApiTable
					rows={[
						{
							prop: "open",
							type: "boolean",
							required: true,
							description: "Whether the command palette is open"
						},
						{
							prop: "onOpenChange",
							type: "(open: boolean) => void",
							required: true,
							description: "Callback when open state changes"
						},
						{
							prop: "items",
							type: "CommandItem[]",
							required: true,
							description: "Array of command items"
						},
						{
							prop: "placeholder",
							type: "string",
							default: '"Type a command or search..."',
							description: "Placeholder text for search input"
						},
						{
							prop: "emptyMessage",
							type: "string",
							default: '"No results found."',
							description: "Message shown when no results match"
						}
					]}
				/>
			</div>

			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				items={commands}
				placeholder="Type a command or search..."
				emptyMessage="No commands found. Try 'file', 'edit', or 'help'."
			/>
		</div>
	)
}
