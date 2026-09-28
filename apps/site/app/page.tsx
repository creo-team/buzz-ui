"use client"
import { Button, Card, Infotip, TextInput, Checkbox, CodeBox, Section, PageHeader } from '@creo-team/buzz-ui/server'
import { DevStatusCard } from '../components/dev-status-card'
import { StyleGallery } from '../components/style-gallery'

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
									<Button size="lg">Get Started</Button>
								</a>
								<a href="https://github.com/creo-team/buzz-ui" className="no-underline">
									<Button size="lg" variant="outline">View on GitHub</Button>
								</a>
							</div>
							<div className="mt-8 max-w-md mx-auto">
								<CodeBox 
									code="npm install @creo-team/buzz-ui" 
									language="bash" 
									label=""
									copyable={true}
								/>
							</div>
							
							{/* Development Status Card */}
							<div className="mt-12 max-w-2xl mx-auto">
								<DevStatusCard />
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<Section width="wide" padding="spacious">
					<div className="mb-16 flex flex-col items-center gap-4">
						<PageHeader
							level={2}
							align="center"
							title="Why Choose Buzz UI?"
							description="Modern design principles meet practical development needs"
						/>
						<a href="/logo-demo" className="inline-flex items-center gap-2 text-sm text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] transition-colors no-underline">
							<span>🔥</span>
							<span>View our brand identity</span>
							<span>→</span>
						</a>
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
				</Section>

				{/* Style Gallery */}
				<Section variant="muted" width="wide" padding="spacious">
					<div className="mb-16 flex flex-col items-center gap-4">
						<PageHeader
							level={2}
							align="center"
							title="One library, ten personalities"
							description={
								<>
									Pick a <strong>style</strong> — corners, elevation, glass, density and motion as
									one coherent look — independent of color theme. Lock it in during setup, or switch
									live. Every preview below is real tokens, not a screenshot.
								</>
							}
						/>
						<a href="/docs/theme/style" className="inline-flex items-center gap-2 text-sm text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] transition-colors no-underline">
							<span>Read the style guide</span>
							<span>→</span>
						</a>
					</div>
					<StyleGallery />
				</Section>

				{/* Component Showcase */}
				<Section width="wide" padding="spacious">
					<PageHeader
						level={2}
						align="center"
						className="mb-16"
						title="Component Highlights"
						description="A taste of what's included in the library"
					/>
					<div className="grid gap-8 lg:grid-cols-3">
							<Card 
								variant="elevated" 
								header="Buttons" 
								actions={
									<a className="no-underline" href="/components/button">
										<Button variant="link">View docs →</Button>
									</a>
								}
							>
								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										<Button>Bold</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="soft">Subtle</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button tone="success" size="sm">Success</Button>
										<Button tone="danger" size="sm">Danger</Button>
										<Button variant="link">Text button</Button>
									</div>
								</div>
							</Card>
							
							<Card 
								variant="elevated" 
								header="Forms" 
								actions={
									<a className="no-underline" href="/components/input">
										<Button variant="link">View docs →</Button>
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
										<Button variant="link">View docs →</Button>
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
				</Section>

				{/* Getting Started */}
				<Section variant="muted" width="narrow" padding="spacious">
					<PageHeader
						level={2}
						align="center"
						title="Ready to get started?"
						description="Install Buzz UI and start building beautiful interfaces today"
					/>
					<div className="mt-8 flex justify-center">
						<a href="/docs" className="no-underline">
							<Button size="lg">Browse Documentation</Button>
						</a>
					</div>
				</Section>
			</main>
		</div>
	)
}

