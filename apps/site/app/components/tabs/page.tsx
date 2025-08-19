"use client"
import { useState } from 'react'
import { Card, Tabs, TabPanel } from '@creo-team/buzz-ui/server'
import { Button } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import { Home, Users, Settings, FileText, BarChart, Bell } from 'lucide-react'

export default function TabsDocs() {
	const [basicTab, setBasicTab] = useState('overview')
	const [variantTab, setVariantTab] = useState('default')
	const [iconTab, setIconTab] = useState('home')
	const [fullWidthTab, setFullWidthTab] = useState('tab1')
	
	const basicItems = [
		{ key: 'overview', label: 'Overview' },
		{ key: 'features', label: 'Features' },
		{ key: 'pricing', label: 'Pricing' },
		{ key: 'support', label: 'Support' }
	]
	
	const iconItems = [
		{ key: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
		{ key: 'users', label: 'Users', icon: <Users className="h-4 w-4" />, badge: 12 },
		{ key: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
		{ key: 'analytics', label: 'Analytics', icon: <BarChart className="h-4 w-4" />, badge: 'New' },
		{ key: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, disabled: true },
		{ key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
	]
	
	// Create a button group that works like tabs
	const [buttonGroupValue, setButtonGroupValue] = useState('grid')
	const buttonGroupOptions = [
		{ value: 'grid', label: 'Grid', icon: '⊞' },
		{ value: 'list', label: 'List', icon: '☰' },
		{ value: 'cards', label: 'Cards', icon: '▦' }
	]
	
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Tabs</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Organize content into switchable panels with various styles and layouts.
			</p>
			
			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Basic Tabs</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Tabs items={basicItems} value={basicTab} onChange={setBasicTab} />
					
					<div className="rounded-xl border border-[var(--c-border)] p-6 bg-[var(--c-surface-2)]">
						<TabPanel value="overview" selectedValue={basicTab}>
							<h3 className="text-lg font-semibold mb-2">Overview</h3>
							<p className="text-[var(--c-text-secondary)]">
								This is the overview content. Tabs help organize related content into separate views.
							</p>
						</TabPanel>
						<TabPanel value="features" selectedValue={basicTab}>
							<h3 className="text-lg font-semibold mb-2">Features</h3>
							<ul className="list-disc list-inside text-[var(--c-text-secondary)] space-y-1">
								<li>Multiple style variants</li>
								<li>Icon and badge support</li>
								<li>Keyboard navigation</li>
								<li>Accessible by default</li>
							</ul>
						</TabPanel>
						<TabPanel value="pricing" selectedValue={basicTab}>
							<h3 className="text-lg font-semibold mb-2">Pricing</h3>
							<p className="text-[var(--c-text-secondary)]">
								Free and open source forever. MIT licensed.
							</p>
						</TabPanel>
						<TabPanel value="support" selectedValue={basicTab}>
							<h3 className="text-lg font-semibold mb-2">Support</h3>
							<p className="text-[var(--c-text-secondary)]">
								Get help via GitHub issues or our Discord community.
							</p>
						</TabPanel>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { Tabs, TabPanel } from '@creo-team/buzz-ui/server'

const [tab, setTab] = useState('overview')

<Tabs 
  items={[
    { key: 'overview', label: 'Overview' },
    { key: 'features', label: 'Features' }
  ]} 
  value={tab} 
  onChange={setTab} 
/>

<TabPanel value="overview" selectedValue={tab}>
  <p>Overview content</p>
</TabPanel>
<TabPanel value="features" selectedValue={tab}>
  <p>Features content</p>
</TabPanel>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Variants</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-6">
					<div>
						<p className="text-sm text-[var(--c-text-secondary)] mb-3">Default</p>
						<Tabs items={basicItems} value={variantTab} onChange={setVariantTab} variant="default" />
					</div>
					
					<div>
						<p className="text-sm text-[var(--c-text-secondary)] mb-3">Pills</p>
						<Tabs items={basicItems} value={variantTab} onChange={setVariantTab} variant="pills" />
					</div>
					
					<div>
						<p className="text-sm text-[var(--c-text-secondary)] mb-3">Underline</p>
						<Tabs items={basicItems} value={variantTab} onChange={setVariantTab} variant="underline" />
					</div>
					
					<div>
						<p className="text-sm text-[var(--c-text-secondary)] mb-3">Buttons</p>
						<Tabs items={basicItems} value={variantTab} onChange={setVariantTab} variant="buttons" />
					</div>
					
					<div>
						<p className="text-sm text-[var(--c-text-secondary)] mb-3">Glass</p>
						<Tabs items={basicItems} value={variantTab} onChange={setVariantTab} variant="glass" />
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Tabs variant="default" ... />
<Tabs variant="pills" ... />
<Tabs variant="underline" ... />
<Tabs variant="buttons" ... />
<Tabs variant="glass" ... />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Sizes</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Tabs items={basicItems.slice(0, 3)} value={basicTab} onChange={setBasicTab} size="sm" />
					<Tabs items={basicItems.slice(0, 3)} value={basicTab} onChange={setBasicTab} size="md" />
					<Tabs items={basicItems.slice(0, 3)} value={basicTab} onChange={setBasicTab} size="lg" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Tabs size="sm" ... />
<Tabs size="md" ... />
<Tabs size="lg" ... />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">With Icons & Badges</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Tabs items={iconItems} value={iconTab} onChange={setIconTab} />
					<Tabs items={iconItems} value={iconTab} onChange={setIconTab} variant="pills" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`const items = [
  { 
    key: 'home', 
    label: 'Home', 
    icon: <Home className="h-4 w-4" /> 
  },
  { 
    key: 'users', 
    label: 'Users', 
    icon: <Users className="h-4 w-4" />, 
    badge: 12 
  },
  { 
    key: 'notifications', 
    label: 'Notifications', 
    icon: <Bell className="h-4 w-4" />, 
    disabled: true 
  }
]

<Tabs items={items} value={tab} onChange={setTab} />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Full Width</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Tabs 
						items={[
							{ key: 'tab1', label: 'Tab 1' },
							{ key: 'tab2', label: 'Tab 2' },
							{ key: 'tab3', label: 'Tab 3' }
						]} 
						value={fullWidthTab} 
						onChange={setFullWidthTab} 
						fullWidth 
					/>
					<Tabs 
						items={[
							{ key: 'tab1', label: 'Tab 1' },
							{ key: 'tab2', label: 'Tab 2' },
							{ key: 'tab3', label: 'Tab 3' }
						]} 
						value={fullWidthTab} 
						onChange={setFullWidthTab} 
						variant="underline"
						fullWidth 
					/>
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Tabs items={items} value={tab} onChange={setTab} fullWidth />
<Tabs items={items} value={tab} onChange={setTab} variant="underline" fullWidth />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Using Button Groups as Tabs</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<p className="text-sm text-[var(--c-text-secondary)]">
						You can achieve tab-like behavior using button groups for simpler use cases:
					</p>
					
					<div className="inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/50 p-0.5">
						{buttonGroupOptions.map((option) => (
							<Button
								key={option.value}
								variant={buttonGroupValue === option.value ? "subtle" : "ghost"}
								size="sm"
								selected={buttonGroupValue === option.value}
								onClick={() => setButtonGroupValue(option.value)}
								className="rounded-lg gap-1.5"
							>
								<span>{option.icon}</span>
								<span>{option.label}</span>
							</Button>
						))}
					</div>
					
					<div className="rounded-xl border border-[var(--c-border)] p-4 bg-[var(--c-surface-2)]">
						{buttonGroupValue === 'grid' && <p>Grid view selected</p>}
						{buttonGroupValue === 'list' && <p>List view selected</p>}
						{buttonGroupValue === 'cards' && <p>Cards view selected</p>}
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { Button } from '@creo-team/buzz-ui/client'

const [view, setView] = useState('grid')

<div className="inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/50 p-0.5">
  {options.map((option) => (
    <Button
      key={option.value}
      variant={view === option.value ? "subtle" : "ghost"}
      size="sm"
      selected={view === option.value}
      onClick={() => setView(option.value)}
    >
      {option.label}
    </Button>
  ))}
</div>`} />
				</div>
			</Card>

			<ApiTable
				title="Tabs API Reference"
				className="mt-12"
				rows={[
					{
						prop: "items",
						type: "TabItem[]",
						required: true,
						description: "Array of tab items"
					},
					{
						prop: "value",
						type: "string",
						required: true,
						description: "Currently selected tab key"
					},
					{
						prop: "onChange",
						type: "(key: string) => void",
						required: true,
						description: "Callback when tab is selected"
					},
					{
						prop: "variant",
						type: "'default' | 'pills' | 'underline' | 'buttons' | 'glass'",
						default: "'default'",
						description: "Visual style variant"
					},
					{
						prop: "size",
						type: "'sm' | 'md' | 'lg'",
						default: "'md'",
						description: "Size variant"
					},
					{
						prop: "fullWidth",
						type: "boolean",
						default: "false",
						description: "Stretch tabs to full container width"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<ApiTable
				title="TabItem Interface"
				className="mt-8"
				rows={[
					{
						prop: "key",
						type: "string",
						required: true,
						description: "Unique identifier for the tab"
					},
					{
						prop: "label",
						type: "React.ReactNode",
						required: true,
						description: "Tab label content"
					},
					{
						prop: "icon",
						type: "React.ReactNode",
						description: "Optional icon element"
					},
					{
						prop: "badge",
						type: "string | number",
						description: "Optional badge content"
					},
					{
						prop: "disabled",
						type: "boolean",
						description: "Disable tab interaction"
					}
				]}
			/>

			<ApiTable
				title="TabPanel API Reference"
				className="mt-8"
				rows={[
					{
						prop: "value",
						type: "string",
						required: true,
						description: "Tab key this panel corresponds to"
					},
					{
						prop: "selectedValue",
						type: "string",
						required: true,
						description: "Currently selected tab key"
					},
					{
						prop: "children",
						type: "React.ReactNode",
						required: true,
						description: "Panel content"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<div className="mt-8 p-4 bg-[var(--c-surface-3)] rounded-lg">
				<p className="text-sm text-[var(--c-text-secondary)]">
					<strong>Accessibility Note:</strong> Tabs are fully accessible with proper ARIA attributes,
					keyboard navigation support, and focus management. The active tab is clearly indicated
					visually and programmatically.
				</p>
			</div>
		</div>
	)
}