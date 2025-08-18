import { SidebarNavClient } from '@buzz-ui/library'

const items = [
	{ key: 'button', label: 'Button', href: '/components/button' },
	{ key: 'tooltip', label: 'Tooltip', href: '/components/tooltip' },
	{ key: 'tooltip-advanced', label: 'Tooltip (Advanced)', href: '/components/tooltip-advanced' },
	{ key: 'infotip', label: 'Infotip', href: '/components/infotip' },
	{ key: 'card', label: 'Card', href: '/components/card' },
	{ key: 'top-nav', label: 'TopNav', href: '/components/top-nav' },
	{ key: 'footer', label: 'Footer', href: '/components/footer' },
	{ key: 'badge', label: 'Badge', href: '/components/badge' },
	{ key: 'alert', label: 'Alert', href: '/components/alert' },
	{ key: 'modal', label: 'Modal', href: '/components/modal' },
	{ key: 'tabs', label: 'Tabs', href: '/components/tabs' },
	{ key: 'breadcrumbs', label: 'Breadcrumbs', href: '/components/breadcrumbs' },
	{ key: 'select', label: 'Select', href: '/components/select' },
	{ key: 'radio-group', label: 'RadioGroup', href: '/components/radio-group' },
	{ key: 'input', label: 'TextInput', href: '/components/input' },
	{ key: 'textarea', label: 'Textarea', href: '/components/textarea' },
	{ key: 'toast', label: 'Toast', href: '/components/toast' },
	{ key: 'switch', label: 'Switch', href: '/components/switch' },
	{ key: 'skeleton', label: 'Skeleton', href: '/components/skeleton' },
	{ key: 'progress', label: 'Progress', href: '/components/progress' },
	{ key: 'accordion', label: 'Accordion', href: '/components/accordion' },
	{ key: 'menu', label: 'Menu', href: '/components/menu' },
	{ key: 'sheet', label: 'Sheet', href: '/components/sheet' },
	{ key: 'avatar', label: 'Avatar', href: '/components/avatar' },
	{ key: 'chip', label: 'Chip', href: '/components/chip' },
	{ key: 'pagination', label: 'Pagination', href: '/components/pagination' },
	{ key: 'table', label: 'Table', href: '/components/table' },
	{ key: 'stepper', label: 'Stepper', href: '/components/stepper' },
	{ key: 'forms', label: 'Forms & Validation', href: '/components/forms' },
	{ key: 'theme', label: 'Theming', href: '/docs/theme' },
]

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto max-w-7xl px-6 py-8">
			<div className="flex gap-8">
				<SidebarNavClient items={items} title="Components" />
				<div className="min-w-0 flex-1">
					{children}
				</div>
			</div>
		</div>
	)
}
