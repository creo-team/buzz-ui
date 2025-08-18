import Link from 'next/link'
import { Breadcrumbs, Button } from '@creo-team/buzz-ui/server'

export default function ComponentsPage() {
	const featuredComponents = [
		{ 
			key: 'button', 
			label: 'Button', 
			href: '/components/button', 
			description: 'Every variant, every state, just works',
			icon: '🎯',
			size: 'large'
		},
		{ 
			key: 'modal', 
			label: 'Modal', 
			href: '/components/modal', 
			description: 'Perfect overlays with focus management',
			icon: '⚡',
			size: 'large'
		},
		{ 
			key: 'forms', 
			label: 'Forms', 
			href: '/components/forms', 
			description: 'Validation that actually works',
			icon: '📝',
			size: 'medium'
		},
		{ 
			key: 'tooltip', 
			label: 'Tooltip', 
			href: '/components/tooltip', 
			description: 'Contextual help done right',
			icon: '💬',
			size: 'medium'
		},
		{ 
			key: 'table', 
			label: 'Table', 
			href: '/components/table', 
			description: 'Data display that scales',
			icon: '📊',
			size: 'medium'
		}
	]

	const allComponents = [
		{ key: 'accordion', label: 'Accordion', href: '/components/accordion' },
		{ key: 'alert', label: 'Alert', href: '/components/alert' },
		{ key: 'avatar', label: 'Avatar', href: '/components/avatar' },
		{ key: 'badge', label: 'Badge', href: '/components/badge' },
		{ key: 'breadcrumbs', label: 'Breadcrumbs', href: '/components/breadcrumbs' },
		{ key: 'card', label: 'Card', href: '/components/card' },
		{ key: 'chip', label: 'Chip', href: '/components/chip' },
		{ key: 'command-palette', label: 'Command Palette', href: '/components/command-palette' },
		{ key: 'drawer', label: 'Drawer', href: '/components/drawer' },
		{ key: 'dropdown', label: 'Dropdown', href: '/components/dropdown' },
		{ key: 'footer', label: 'Footer', href: '/components/footer' },
		{ key: 'infotip', label: 'Infotip', href: '/components/infotip' },
		{ key: 'input', label: 'Input', href: '/components/input' },
		{ key: 'menu', label: 'Menu', href: '/components/menu' },
		{ key: 'pagination', label: 'Pagination', href: '/components/pagination' },
		{ key: 'progress', label: 'Progress', href: '/components/progress' },
		{ key: 'radio-group', label: 'Radio Group', href: '/components/radio-group' },
		{ key: 'select', label: 'Select', href: '/components/select' },
		{ key: 'sheet', label: 'Sheet', href: '/components/sheet' },
		{ key: 'skeleton', label: 'Skeleton', href: '/components/skeleton' },
		{ key: 'stepper', label: 'Stepper', href: '/components/stepper' },
		{ key: 'switch', label: 'Switch', href: '/components/switch' },
		{ key: 'tabs', label: 'Tabs', href: '/components/tabs' },
		{ key: 'textarea', label: 'Textarea', href: '/components/textarea' },
		{ key: 'toast', label: 'Toast', href: '/components/toast' },
		{ key: 'tooltip-advanced', label: 'Tooltip Pro', href: '/components/tooltip-advanced' },
		{ key: 'top-nav', label: 'Top Nav', href: '/components/top-nav' },
	]

	return (
		<div>
			<Breadcrumbs items={[{ key: 'home', label: 'Home', href: '/' }, { key: 'components', label: 'Components' }]} />
			
			{/* Hero */}
			<div className="mt-12 mb-20 text-center">
				<h1 className="text-8xl font-black text-[var(--c-text)] tracking-tight mb-8">
					Components that{' '}
					<span className="bg-gradient-to-r from-[var(--c-primary)] via-blue-500 to-purple-600 bg-clip-text text-transparent">
						just work
					</span>
				</h1>
				<p className="text-2xl text-[var(--c-text-secondary)] max-w-2xl mx-auto mb-12">
					Production-ready. Copy, paste, ship.
				</p>
			</div>

			{/* Featured Components - Masonry Style */}
			<div className="mb-20">
				<div className="grid gap-6 auto-rows-min" style={{
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
				}}>
					{featuredComponents.map((component, index) => {
						const isLarge = component.size === 'large'
						return (
							<Link 
								key={component.key}
								href={component.href}
								className={`group relative overflow-hidden rounded-3xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-primary)] hover:shadow-2xl hover:shadow-[var(--c-primary)]/20 transition-all duration-500 hover:scale-[1.02] no-underline ${
									isLarge ? 'md:col-span-2 p-12' : 'p-8'
								}`}
								style={{
									gridColumn: isLarge ? 'span 2' : 'span 1'
								}}
							>
								<div className="absolute inset-0 bg-gradient-to-br from-[var(--c-primary)]/5 via-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className={`${isLarge ? 'text-6xl' : 'text-4xl'} mb-6`}>
										{component.icon}
									</div>
									<h3 className={`font-black text-[var(--c-text)] group-hover:text-[var(--c-primary)] transition-colors mb-4 ${
										isLarge ? 'text-4xl' : 'text-2xl'
									}`}>
										{component.label}
									</h3>
									<p className={`text-[var(--c-text-secondary)] leading-relaxed ${
										isLarge ? 'text-xl' : 'text-lg'
									}`}>
										{component.description}
									</p>
									<div className="mt-8 inline-flex items-center text-[var(--c-primary)] font-bold text-lg group-hover:gap-3 transition-all">
										Explore <span className="ml-2 group-hover:translate-x-2 transition-transform text-xl">→</span>
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			</div>

			{/* All Components - Flowing Grid */}
			<div className="mb-20">
				<h2 className="text-4xl font-bold text-[var(--c-text)] mb-12 text-center">
					Everything else
				</h2>
				<div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
					{allComponents.map(component => (
						<Link 
							key={component.key}
							href={component.href}
							className="group relative overflow-hidden rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6 hover:border-[var(--c-primary)] hover:shadow-xl hover:shadow-[var(--c-primary)]/10 hover:-translate-y-1 transition-all duration-300 no-underline"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-[var(--c-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative">
								<div className="font-bold text-[var(--c-text)] group-hover:text-[var(--c-primary)] transition-colors">
									{component.label}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* CTA */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--c-surface)] to-[var(--c-surface-2)] border border-[var(--c-border)] p-16 text-center">
				<div className="absolute inset-0 bg-gradient-to-r from-[var(--c-primary)]/5 via-blue-500/5 to-purple-600/5"></div>
				<div className="relative">
					<h2 className="text-5xl font-black text-[var(--c-text)] mb-6">
						Ready to ship?
					</h2>
					<p className="text-xl text-[var(--c-text-secondary)] mb-10 max-w-xl mx-auto">
						Stop building the same components over and over. Start here.
					</p>
					<div className="flex flex-wrap justify-center gap-6">
						<Link href="/docs/installation" className="no-underline">
							<Button variant="bold" size="lg" className="px-10 py-5 text-xl font-bold">
								Install Now
							</Button>
						</Link>
						<Link href="https://github.com/creo-team/buzz-ui" className="no-underline">
							<Button variant="outline" size="lg" className="px-10 py-5 text-xl">
								GitHub
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
