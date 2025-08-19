"use client"

import { Card } from '@creo-team/buzz-ui/server'
import { SidebarNavEnhanced } from '@creo-team/buzz-ui/client'
import { SidebarNavWrapper } from '../../../components/sidebar-nav-wrapper'
import { CodeBlock } from '../../../components/code-block'
import { Home, Users, Settings, FileText, BarChart, Bell, Calendar, Mail, Shield, Heart } from 'lucide-react'

export default function SidebarNavDocs() {
	const exampleItems = [
		{ key: 'home', label: 'Home', href: '#home', icon: <Home className="h-4 w-4" /> },
		{ key: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: <BarChart className="h-4 w-4" />, badge: '3' },
		{ key: 'users', label: 'Users', href: '#users', icon: <Users className="h-4 w-4" /> },
		{ key: 'documents', label: 'Documents', href: '#documents', icon: <FileText className="h-4 w-4" /> },
		{ key: 'calendar', label: 'Calendar', href: '#calendar', icon: <Calendar className="h-4 w-4" /> },
		{ key: 'messages', label: 'Messages', href: '#messages', icon: <Mail className="h-4 w-4" />, badge: 'New' },
		{ key: 'notifications', label: 'Notifications', href: '#notifications', icon: <Bell className="h-4 w-4" /> },
		{ key: 'security', label: 'Security', href: '#security', icon: <Shield className="h-4 w-4" /> },
		{ key: 'favorites', label: 'Favorites', href: '#favorites', icon: <Heart className="h-4 w-4" /> },
		{ key: 'settings', label: 'Settings', href: '#settings', icon: <Settings className="h-4 w-4" /> },
	]

	const groupingExample = [
		{ key: 'overview', label: 'Overview', href: '#overview', description: 'General dashboard view' },
		{ key: 'analytics', label: 'Analytics', href: '#analytics', description: 'Data and insights' },
		{ key: 'reports', label: 'Reports', href: '#reports', description: 'Generated reports' },
		{ key: 'team', label: 'Team Members', href: '#team', description: 'Manage team' },
		{ key: 'roles', label: 'Roles & Permissions', href: '#roles', description: 'Access control' },
		{ key: 'billing', label: 'Billing', href: '#billing', description: 'Subscription details' },
		{ key: 'api', label: 'API Keys', href: '#api', description: 'Developer settings' },
		{ key: 'webhooks', label: 'Webhooks', href: '#webhooks', description: 'Event subscriptions' },
		{ key: 'general', label: 'General', href: '#general', description: 'Basic settings' },
		{ key: 'appearance', label: 'Appearance', href: '#appearance', description: 'Theme and display' },
	]

	const groupByCategory = (item: any) => {
		if (['overview', 'analytics', 'reports'].includes(item.key)) return 'Dashboard'
		if (['team', 'roles'].includes(item.key)) return 'Team'
		if (['billing', 'api', 'webhooks'].includes(item.key)) return 'Developer'
		return 'Settings'
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-[var(--c-text)] mb-4">Sidebar Navigation</h1>
				<p className="text-[var(--c-text-secondary)] text-lg">
					Enhanced sidebar navigation with search, filtering, sorting, and grouping capabilities.
				</p>
			</div>

			{/* Default Example */}
			<Card className="p-0 overflow-hidden">
				<div className="flex">
					<div className="w-64 border-r border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
						<SidebarNavWrapper
							items={exampleItems}
							title="Navigation"
							sortAlphabetically={false}
							showSearch={false}
							variant="default"
						/>
					</div>
					<div className="flex-1 p-6">
						<h3 className="text-lg font-semibold mb-2">Default Sidebar</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Basic sidebar with icons and badges.
						</p>
						<CodeBlock code={`import { SidebarNavEnhanced } from '@creo-team/buzz-ui/client'
import { Home, Users, Settings } from 'lucide-react'

const items = [
  { key: 'home', label: 'Home', href: '/home', icon: <Home className="h-4 w-4" /> },
  { key: 'users', label: 'Users', href: '/users', icon: <Users className="h-4 w-4" /> },
  { key: 'settings', label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" />, badge: 'New' },
]

<SidebarNavEnhanced
  items={items}
  title="Navigation"
/>`} />
					</div>
				</div>
			</Card>

			{/* With Search and Alphabetical Sort */}
			<Card className="p-0 overflow-hidden">
				<div className="flex">
					<div className="w-64 border-r border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
						<SidebarNavWrapper
							items={exampleItems}
							title="Searchable & Sorted"
							sortAlphabetically={true}
							showSearch={true}
							variant="default"
						/>
					</div>
					<div className="flex-1 p-6">
						<h3 className="text-lg font-semibold mb-2">With Search & Alphabetical Sort</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Enable search filtering and alphabetical sorting for easier navigation.
						</p>
						<CodeBlock code={`<SidebarNavEnhanced
  items={items}
  title="Navigation"
  sortAlphabetically={true}
  showSearch={true}
/>`} />
					</div>
				</div>
			</Card>

			{/* Grouped Navigation */}
			<Card className="p-0 overflow-hidden">
				<div className="flex">
					<div className="w-64 border-r border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
						<SidebarNavWrapper
							items={groupingExample}
							title="Grouped Navigation"
							sortAlphabetically={false}
							showSearch={true}
							groupBy={groupByCategory}
							variant="default"
						/>
					</div>
					<div className="flex-1 p-6">
						<h3 className="text-lg font-semibold mb-2">Grouped Navigation</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Group items by category using a custom grouping function.
						</p>
						<CodeBlock code={`const groupByCategory = (item) => {
  if (['overview', 'analytics'].includes(item.key)) return 'Dashboard'
  if (['team', 'roles'].includes(item.key)) return 'Team'
  return 'Settings'
}

<SidebarNavEnhanced
  items={items}
  title="Grouped Navigation"
  groupBy={groupByCategory}
  showSearch={true}
/>`} />
					</div>
				</div>
			</Card>

			{/* Variants */}
			<Card>
				<h2 className="text-xl font-semibold mb-6">Variants</h2>
				<div className="grid grid-cols-3 gap-6">
					<div className="border border-[var(--c-border)] rounded-lg p-4">
						<h3 className="font-medium mb-3">Compact</h3>
						<SidebarNavEnhanced
							items={exampleItems.slice(0, 5)}
							variant="compact"
							sortAlphabetically={true}
						/>
					</div>
					<div className="border border-[var(--c-border)] rounded-lg p-4">
						<h3 className="font-medium mb-3">Default</h3>
						<SidebarNavEnhanced
							items={exampleItems.slice(0, 5)}
							variant="default"
							sortAlphabetically={true}
						/>
					</div>
					<div className="border border-[var(--c-border)] rounded-lg p-4">
						<h3 className="font-medium mb-3">Spacious</h3>
						<SidebarNavEnhanced
							items={groupingExample.slice(0, 5)}
							variant="spacious"
							sortAlphabetically={true}
						/>
					</div>
				</div>
			</Card>

			{/* API Reference */}
			<Card>
				<h2 className="text-xl font-semibold mb-4">API Reference</h2>
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-[var(--c-border)]">
							<th className="text-left py-2 text-[var(--c-text-secondary)]">Prop</th>
							<th className="text-left py-2 text-[var(--c-text-secondary)]">Type</th>
							<th className="text-left py-2 text-[var(--c-text-secondary)]">Default</th>
							<th className="text-left py-2 text-[var(--c-text-secondary)]">Description</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>items</code></td>
							<td className="py-2">SidebarNavItem[]</td>
							<td className="py-2">required</td>
							<td className="py-2">Array of navigation items</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>title</code></td>
							<td className="py-2">string</td>
							<td className="py-2">"Navigation"</td>
							<td className="py-2">Title displayed at the top</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>sortAlphabetically</code></td>
							<td className="py-2">boolean</td>
							<td className="py-2">false</td>
							<td className="py-2">Sort items alphabetically</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>showSearch</code></td>
							<td className="py-2">boolean</td>
							<td className="py-2">true</td>
							<td className="py-2">Show search/filter input</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>groupBy</code></td>
							<td className="py-2">(item) =&gt; string</td>
							<td className="py-2">undefined</td>
							<td className="py-2">Function to group items</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>variant</code></td>
							<td className="py-2">'compact' | 'default' | 'spacious'</td>
							<td className="py-2">'default'</td>
							<td className="py-2">Size variant</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>stickyHeader</code></td>
							<td className="py-2">boolean</td>
							<td className="py-2">true</td>
							<td className="py-2">Sticky title and search</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2"><code>scrollable</code></td>
							<td className="py-2">boolean</td>
							<td className="py-2">false</td>
							<td className="py-2">Enable scrolling within the sidebar</td>
						</tr>
					</tbody>
				</table>
			</Card>

			{/* Item Structure */}
			<Card>
				<h2 className="text-xl font-semibold mb-4">Item Structure</h2>
				<CodeBlock code={`interface SidebarNavItem {
  key: string           // Unique identifier
  label: string         // Display text
  href: string          // Link destination
  description?: string  // Optional description (shown in spacious variant)
  badge?: string        // Optional badge text
  icon?: ReactNode      // Optional icon component
}`} />
			</Card>
		</div>
	)
}
