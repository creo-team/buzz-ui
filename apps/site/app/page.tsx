import { Button, Card, Infotip, TextInput, Checkbox } from '@creo-team/buzz-ui/server'
import { SimpleCodeBlock } from '../components/simple-code-block'
import { DevStatusCard } from '../components/dev-status-card'

export default function Page() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-br from-[var(--c-surface)] via-[var(--c-surface-2)] to-[var(--c-surface-3)] pt-[106px]">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--c-primary-light),transparent_50%)] opacity-30" />
					<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
						<div className="text-center">
							<h1 className="text-5xl font-bold tracking-tight text-[var(--c-text)] sm:text-6xl">
								Build faster with{' '}
								<span className="bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-primary-hover)] bg-clip-text text-transparent">
									elegant components
								</span>
							</h1>
							<p className="mt-6 max-w-3xl mx-auto text-xl text-[var(--c-text-secondary)] leading-8">
								Buzz UI is a modern React component library inspired by clean design principles. 
								Built with accessibility, performance, and developer experience in mind.
							</p>
							<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
								<a href="/docs" className="no-underline">
									<Button size="lg" variant="bold">Get Started</Button>
								</a>
								<a href="https://github.com/creo-team/buzz-ui" className="no-underline">
									<Button size="lg" variant="outline">View on GitHub</Button>
								</a>
							</div>
							<div className="mt-8 max-w-md mx-auto">
								<SimpleCodeBlock code={`npm install @creo-team/buzz-ui`} />
							</div>
							
							{/* Development Status Card */}
							<div className="mt-12 max-w-2xl mx-auto">
								<DevStatusCard />
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 bg-[var(--c-surface)]">
					<div className="mx-auto max-w-7xl px-6">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-[var(--c-text)]">Why Choose Buzz UI?</h2>
							<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
								Modern design principles meet practical development needs
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							<Card variant="elevated" header="🎨 Design-First">
								<p className="text-[var(--c-text-secondary)]">
									Inspired by Umbro's clean aesthetic with multiple beautiful themes. 
									Every component follows consistent design principles.
								</p>
							</Card>
							<Card variant="elevated" header="♿ Accessible by Default">
								<p className="text-[var(--c-text-secondary)]">
									Built with screen readers, keyboard navigation, and WCAG guidelines in mind. 
									Accessibility isn't an afterthought—it's built in.
								</p>
							</Card>
							<Card variant="elevated" header="🚀 Developer Experience">
								<p className="text-[var(--c-text-secondary)]">
									TypeScript-first with excellent IntelliSense. Clean APIs, 
									comprehensive documentation, and great testing support.
								</p>
							</Card>
						</div>
					</div>
				</section>

				{/* Component Showcase */}
				<section className="py-24 bg-[var(--c-surface-2)]">
					<div className="mx-auto max-w-7xl px-6">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-[var(--c-text)]">Component Highlights</h2>
							<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
								A taste of what's included in the library
							</p>
						</div>
						<div className="grid gap-8 lg:grid-cols-3">
							<Card 
								variant="elevated" 
								header="Buttons" 
								actions={
									<a className="no-underline" href="/components/button">
										<Button variant="text">View docs →</Button>
									</a>
								}
							>
								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										<Button variant="bold">Bold</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="subtle">Subtle</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button variant="success" size="sm">Success</Button>
										<Button variant="danger" size="sm">Danger</Button>
										<Button variant="text">Text button</Button>
									</div>
								</div>
							</Card>
							
							<Card 
								variant="elevated" 
								header="Forms" 
								actions={
									<a className="no-underline" href="/components/input">
										<Button variant="text">View docs →</Button>
									</a>
								}
							>
								<div className="space-y-3">
									<TextInput label="Email" placeholder="you@example.com" />
									<div className="flex items-center gap-2">
										<Checkbox label="Subscribe to updates" />
									</div>
								</div>
							</Card>

							<Card 
								variant="elevated" 
								header="Interactive Elements" 
								actions={
									<a className="no-underline" href="/components/infotip">
										<Button variant="text">View docs →</Button>
									</a>
								}
							>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="text-sm text-[var(--c-text-secondary)]">Need help?</span>
										<Infotip 
											title="Information" 
											description="Tooltips provide contextual information without cluttering the interface." 
										/>
									</div>
									<Button variant="outline" size="sm" className="w-full">
										Hover for tooltip
									</Button>
								</div>
							</Card>
						</div>
					</div>
				</section>

				{/* Getting Started */}
				<section className="py-24 bg-[var(--c-surface)]">
					<div className="mx-auto max-w-4xl px-6 text-center">
						<h2 className="text-3xl font-bold text-[var(--c-text)]">Ready to get started?</h2>
						<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
							Install Buzz UI and start building beautiful interfaces today
						</p>
						<div className="mt-8 flex justify-center">
							<a href="/docs" className="no-underline">
								<Button size="lg" variant="bold">
									Browse Documentation
								</Button>
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

