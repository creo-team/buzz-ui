"use client"

import { SidebarNavWrapper } from '../../components/sidebar-nav-wrapper'

/**
 * One entry per docs page, grouped by what the component is for — a flat
 * 38-item alphabet was unscannable. Grouping lives here (data), ordering
 * in GROUP_ORDER, rendering in the library's SidebarNav.
 */
const componentItems = [
	// Actions
	{ key: 'button', label: 'Button', href: '/components/button', category: 'Actions', badge: 'Updated' },
	{ key: 'fab', label: 'Fab', href: '/components/fab', category: 'Actions' },

	// Forms
	{ key: 'forms', label: 'Forms Overview', href: '/components/forms', category: 'Forms' },
	{ key: 'form', label: 'Form', href: '/components/form', category: 'Forms', badge: 'New' },
	{ key: 'dropzone', label: 'Dropzone', href: '/components/dropzone', category: 'Forms', badge: 'New' },
	{ key: 'input', label: 'Input', href: '/components/input', category: 'Forms' },
	{ key: 'textarea', label: 'Textarea', href: '/components/textarea', category: 'Forms' },
	{ key: 'select', label: 'Select', href: '/components/select', category: 'Forms' },
	{ key: 'combobox', label: 'Combobox', href: '/components/combobox', category: 'Forms' },
	{ key: 'slider', label: 'Slider', href: '/components/slider', category: 'Forms' },

	// Overlays
	{ key: 'modal', label: 'Modal', href: '/components/modal', category: 'Overlays' },
	{ key: 'drawer', label: 'Drawer', href: '/components/drawer', category: 'Overlays' },
	{ key: 'sheet', label: 'Sheet', href: '/components/sheet', category: 'Overlays' },
	{ key: 'popover', label: 'Popover', href: '/components/popover', category: 'Overlays' },
	{ key: 'dropdown', label: 'Dropdown', href: '/components/dropdown', category: 'Overlays' },
	{ key: 'command-palette', label: 'Command Palette', href: '/components/command-palette', category: 'Overlays' },
	{ key: 'tooltip', label: 'Tooltip', href: '/components/tooltip', category: 'Overlays' },
	{ key: 'infotip', label: 'Infotip', href: '/components/infotip', category: 'Overlays' },
	{ key: 'toast', label: 'Toast', href: '/components/toast', category: 'Overlays' },

	// Navigation
	{ key: 'top-nav', label: 'Top Nav', href: '/components/top-nav', category: 'Navigation' },
	{ key: 'sidebar-nav', label: 'Sidebar Nav', href: '/components/sidebar-nav', category: 'Navigation' },
	{ key: 'tabs', label: 'Tabs', href: '/components/tabs', category: 'Navigation' },
	{ key: 'breadcrumbs', label: 'Breadcrumbs', href: '/components/breadcrumbs', category: 'Navigation' },
	{ key: 'pagination', label: 'Pagination', href: '/components/pagination', category: 'Navigation' },
	{ key: 'menu', label: 'Menu', href: '/components/menu', category: 'Navigation' },

	// Feedback
	{ key: 'alert', label: 'Alert', href: '/components/alert', category: 'Feedback' },
	{ key: 'banner', label: 'Banner', href: '/components/banner', category: 'Feedback' },
	{ key: 'progress', label: 'Progress', href: '/components/progress', category: 'Feedback' },
	{ key: 'skeleton', label: 'Skeleton', href: '/components/skeleton', category: 'Feedback' },
	{ key: 'stepper', label: 'Stepper', href: '/components/stepper', category: 'Feedback' },

	// Data & Display
	{ key: 'card', label: 'Card', href: '/components/card', category: 'Data & Display' },
	{ key: 'table', label: 'Table', href: '/components/table', category: 'Data & Display' },
	{ key: 'badge', label: 'Badge', href: '/components/badge', category: 'Data & Display' },
	{ key: 'chip', label: 'Chip', href: '/components/chip', category: 'Data & Display' },
	{ key: 'avatar', label: 'Avatar', href: '/components/avatar', category: 'Data & Display' },
	{ key: 'accordion', label: 'Accordion', href: '/components/accordion', category: 'Data & Display' },
	{ key: 'code-box', label: 'Code Box', href: '/components/code-box', category: 'Data & Display' },
	{ key: 'timestamp', label: 'Timestamp', href: '/components/timestamp', category: 'Data & Display', badge: 'New' },

	// Layout
	{ key: 'section', label: 'Section & PageHeader', href: '/components/section', category: 'Layout', badge: 'New' },
	{ key: 'footer', label: 'Footer', href: '/components/footer', category: 'Layout' },
	{ key: 'primitives', label: 'Primitives', href: '/components/primitives', category: 'Layout' },
]

const GROUP_ORDER = ['Actions', 'Forms', 'Overlays', 'Navigation', 'Feedback', 'Data & Display', 'Layout']

const categoryOf = new Map(componentItems.map(item => [item.key, item.category]))

export default function ComponentsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen overflow-x-hidden">
			{/* Sidebar */}
			<aside className="hidden w-64 flex-shrink-0 border-r border-[var(--c-border)] bg-[var(--c-surface)] md:block">
				<div className="sticky top-[6.5rem] p-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
					<SidebarNavWrapper
						items={componentItems}
						title="Components"
						sortAlphabetically={true}
						showSearch={true}
						groupBy={item => categoryOf.get(item.key) ?? 'Other'}
						groupOrder={GROUP_ORDER}
						variant="default"
						stickyHeader={false}
						scrollable={false}
					/>
				</div>
			</aside>

			{/* Main content */}
			<main className="min-w-0 flex-1 px-8 py-12">
				<div className="max-w-5xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	)
}
