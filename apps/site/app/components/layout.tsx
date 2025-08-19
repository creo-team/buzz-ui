"use client"

import { SidebarNavWrapper } from '../../components/sidebar-nav-wrapper'

const componentItems = [
	{ key: 'accordion', label: 'Accordion', href: '/components/accordion' },
	{ key: 'alert', label: 'Alert', href: '/components/alert' },
	{ key: 'avatar', label: 'Avatar', href: '/components/avatar' },
	{ key: 'badge', label: 'Badge', href: '/components/badge' },
	{ key: 'banner', label: 'Banner', href: '/components/banner' },
	{ key: 'breadcrumbs', label: 'Breadcrumbs', href: '/components/breadcrumbs' },
	{ key: 'button', label: 'Button', href: '/components/button', badge: 'Updated' },
	{ key: 'card', label: 'Card', href: '/components/card' },
	{ key: 'checkbox', label: 'Checkbox', href: '/components/checkbox' },
	{ key: 'chip', label: 'Chip', href: '/components/chip' },
	{ key: 'code-box', label: 'Code Box', href: '/components/code-box' },
	{ key: 'command-palette', label: 'Command Palette', href: '/components/command-palette' },
	{ key: 'drawer', label: 'Drawer', href: '/components/drawer' },
	{ key: 'dropdown', label: 'Dropdown', href: '/components/dropdown' },
	{ key: 'footer', label: 'Footer', href: '/components/footer' },
	{ key: 'forms', label: 'Forms', href: '/components/forms' },
	{ key: 'infotip', label: 'Infotip', href: '/components/infotip' },
	{ key: 'input', label: 'Input', href: '/components/input' },
	{ key: 'menu', label: 'Menu', href: '/components/menu' },
	{ key: 'modal', label: 'Modal', href: '/components/modal' },

	{ key: 'progress', label: 'Progress', href: '/components/progress' },

	{ key: 'select', label: 'Select', href: '/components/select' },
	{ key: 'sheet', label: 'Sheet', href: '/components/sheet' },
	{ key: 'sidebar-nav', label: 'Sidebar Nav', href: '/components/sidebar-nav', badge: 'New' },
	{ key: 'skeleton', label: 'Skeleton', href: '/components/skeleton' },


	{ key: 'table', label: 'Table', href: '/components/table' },
	{ key: 'tabs', label: 'Tabs', href: '/components/tabs' },
	{ key: 'textarea', label: 'Textarea', href: '/components/textarea' },
	{ key: 'toast', label: 'Toast', href: '/components/toast', badge: 'Updated' },
	{ key: 'tooltip', label: 'Tooltip', href: '/components/tooltip', badge: 'Updated' },
	{ key: 'top-nav', label: 'Top Nav', href: '/components/top-nav' },
]

export default function ComponentsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="w-64 flex-shrink-0 border-r border-[var(--c-border)] bg-[var(--c-surface)]">
				<div className="sticky top-[6.5rem] p-4">
					<SidebarNavWrapper
						items={componentItems}
						title="Components"
						sortAlphabetically={true}
						showSearch={true}
						variant="default"
						stickyHeader={false}
						scrollable={false}
					/>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 px-8 py-12">
				<div className="max-w-5xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	)
}