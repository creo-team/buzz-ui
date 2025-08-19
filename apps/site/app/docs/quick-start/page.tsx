'use client'

import { CodeBlock } from '../../../components/code-block'

export default function QuickStartPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Quick Start</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					Use Buzz UI components in minutes with this minimal setup
				</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">1) Install</h2>
				<CodeBlock code="npm install @creo-team/buzz-ui" label="npm" />
				<div className="mt-4">
					<CodeBlock code="yarn add @creo-team/buzz-ui" label="yarn" />
				</div>
				<div className="mt-4">
					<CodeBlock code="pnpm add @creo-team/buzz-ui" label="pnpm" />
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">2) Optional: Theme Provider</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">Enable dark mode and multiple themes</p>
				<CodeBlock
					code={`import { ThemeProvider } from '@creo-team/buzz-ui'

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider defaultTheme="light">
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}`}
					label="Theme Provider"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">3) Use Components</h2>
				<CodeBlock
					code={`import { Button, Card, Badge } from '@creo-team/buzz-ui'

export default function Example() {
	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">Hello Buzz UI</h2>
			<div className="flex items-center gap-3">
				<Button variant="primary">Click me</Button>
				<Badge variant="success">Ready</Badge>
			</div>
		</Card>
	)
}`}
					label="Basic Usage"
				/>
			</section>

			<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
				<h3 className="text-lg font-semibold text-[var(--c-text)] mb-2">Next up</h3>
				<p className="text-[var(--c-text-secondary)]">Customize themes in <a href="/docs/theme" className="text-[var(--c-primary)] hover:underline">Theme System</a> or browse <a href="/components" className="text-[var(--c-primary)] hover:underline">Components</a></p>
			</div>
		</div>
	)
}


