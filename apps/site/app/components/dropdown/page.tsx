"use client"
import { Breadcrumbs } from '@creo-team/buzz-ui/client'
import { Button, Dropdown } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '@/components/code-block'
import { ApiTable } from '@/components/api-table'
import Link from 'next/link'

export default function DropdownPage() {
	const basicItems = [
		{
			key: 'profile',
			label: 'Profile',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			),
			onClick: () => alert('Profile clicked'),
		},
		{
			key: 'settings',
			label: 'Settings',
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			),
			onClick: () => alert('Settings clicked'),
		},
		'separator' as const,
		{
			key: 'logout',
			label: 'Sign Out',
			variant: 'destructive' as const,
			icon: (
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
			),
			onClick: () => alert('Sign out clicked'),
		},
	]

	const fileItems = [
		{
			key: 'new',
			label: 'New File',
			onClick: () => alert('New file'),
		},
		{
			key: 'open',
			label: 'Open...',
			onClick: () => alert('Open file'),
		},
		'separator' as const,
		{
			key: 'save',
			label: 'Save',
			onClick: () => alert('Save'),
		},
		{
			key: 'save-as',
			label: 'Save As...',
			onClick: () => alert('Save as'),
		},
		'separator' as const,
		{
			key: 'export',
			label: 'Export',
			onClick: () => alert('Export'),
		},
		{
			key: 'print',
			label: 'Print',
			disabled: true,
			onClick: () => alert('Print'),
		},
	]

	return (
		<div>
			<Breadcrumbs items={[
				{ key: 'home', label: 'Home', href: '/' },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'dropdown', label: 'Dropdown' }
			]} />
			
			<h1 className="mt-6 text-4xl font-bold text-[var(--c-text)]">Dropdown</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				A contextual menu that appears when triggered, containing a list of actions or options.
			</p>

			<div className="mt-10">
				<h2 className="text-2xl font-bold text-[var(--c-text)]">Examples</h2>

				<div className="mt-6">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Basic Usage</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						A simple dropdown with icons and actions.
					</p>
					
					<div className="mt-4 flex flex-wrap gap-4">
						<Dropdown
							trigger={<Button>User Menu</Button>}
							items={basicItems}
						/>

						<Dropdown
							trigger={<Button variant="outline">File Menu</Button>}
							items={fileItems}
							align="end"
						/>

						<Dropdown
							trigger={
								<Button variant="text" size="sm">
									<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
									</svg>
								</Button>
							}
							items={[
								{ key: 'edit', label: 'Edit', onClick: () => alert('Edit') },
								{ key: 'duplicate', label: 'Duplicate', onClick: () => alert('Duplicate') },
								'separator' as const,
								{ key: 'delete', label: 'Delete', variant: 'destructive' as const, onClick: () => alert('Delete') },
							]}
							align="end"
						/>
					</div>

					<CodeBlock 
						code={`import { Button, Dropdown } from '@creo-team/buzz-ui/client'

const items = [
	{
		key: 'profile',
		label: 'Profile',
		icon: <UserIcon className="h-4 w-4" />,
		onClick: () => console.log('Profile clicked'),
	},
	{
		key: 'settings',
		label: 'Settings',
		icon: <SettingsIcon className="h-4 w-4" />,
		onClick: () => console.log('Settings clicked'),
	},
	'separator',
	{
		key: 'logout',
		label: 'Sign Out',
		variant: 'destructive',
		onClick: () => console.log('Sign out'),
	},
]

export default function Example() {
	return (
		<Dropdown
			trigger={<Button>Open Menu</Button>}
			items={items}
		/>
	)
}`}
						label="Dropdown Example"
					/>
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Positioning</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						Control where the dropdown appears relative to the trigger.
					</p>
					
					<div className="mt-4 flex flex-wrap gap-4">
						<Dropdown
							trigger={<Button variant="outline">Top</Button>}
							items={[
								{ key: '1', label: 'Item 1', onClick: () => {} },
								{ key: '2', label: 'Item 2', onClick: () => {} },
							]}
							side="top"
						/>

						<Dropdown
							trigger={<Button variant="outline">Right</Button>}
							items={[
								{ key: '1', label: 'Item 1', onClick: () => {} },
								{ key: '2', label: 'Item 2', onClick: () => {} },
							]}
							side="right"
						/>

						<Dropdown
							trigger={<Button variant="outline">Left</Button>}
							items={[
								{ key: '1', label: 'Item 1', onClick: () => {} },
								{ key: '2', label: 'Item 2', onClick: () => {} },
							]}
							side="left"
						/>
					</div>
				</div>

				<ApiTable
					rows={[
						{
							prop: "trigger",
							type: "React.ReactElement",
							required: true,
							description: "Element that triggers the dropdown"
						},
						{
							prop: "items",
							type: "(DropdownItem | 'separator')[]",
							required: true,
							description: "Array of menu items and separators"
						},
						{
							prop: "align",
							type: "'start' | 'center' | 'end'",
							default: "'start'",
							description: "Alignment of dropdown relative to trigger"
						},
						{
							prop: "side",
							type: "'top' | 'right' | 'bottom' | 'left'",
							default: "'bottom'",
							description: "Side of trigger where dropdown appears"
						                                                }
                                        ]}
                                />

                                <div className="mt-8">
                                        <p className="text-sm text-[var(--c-text-secondary)]">
                                                Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/dropdown/api">/components/dropdown/api</Link>
                                        </p>
                                </div>
                        </div>
                </div>
        )
}
