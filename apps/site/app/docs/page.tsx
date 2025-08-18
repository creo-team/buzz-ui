'use client'

import Link from 'next/link'
import { CodeBlock } from '../../components/code-block'

export default function DocsIndex() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-12 space-y-12">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Buzz UI Documentation</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					A modern React component library with TypeScript support and comprehensive theming.
				</p>
			</div>

			{/* Getting Started Section */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">🚀 Getting Started</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">Installation</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Install Buzz UI in your React project:
						</p>
						<CodeBlock 
							code="npm install @creo-team/buzz-ui"
							label="Package Manager"
						/>
					</div>

					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">Quick Setup</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Import and use components:
						</p>
						<CodeBlock 
							code={`import { Button, Card } from '@creo-team/buzz-ui'

export default function App() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}`}
							label="Basic Usage"
						/>
					</div>
				</div>
			</section>

			{/* Theme System */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">🎨 Theme System</h2>
				
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6 mb-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">Centralized Design Tokens</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">
						<strong>Yes!</strong> Buzz UI has a completely centralized theme system with customizable:
					</p>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-md)] p-3">
							<div className="font-medium text-[var(--c-text)]">Colors</div>
							<div className="text-[var(--c-text-muted)] font-mono text-xs mt-1">--c-primary</div>
						</div>
						<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-md)] p-3">
							<div className="font-medium text-[var(--c-text)]">Radius</div>
							<div className="text-[var(--c-text-muted)] font-mono text-xs mt-1">--radius-lg</div>
						</div>
						<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-md)] p-3">
							<div className="font-medium text-[var(--c-text)]">Shadows</div>
							<div className="text-[var(--c-text-muted)] font-mono text-xs mt-1">--shadow-md</div>
						</div>
						<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-md)] p-3">
							<div className="font-medium text-[var(--c-text)]">Spacing</div>
							<div className="text-[var(--c-text-muted)] font-mono text-xs mt-1">CSS variables</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h4 className="text-lg font-medium text-[var(--c-text)]">Theme Provider Setup</h4>
					<CodeBlock 
						code={`import { ThemeProvider } from '@creo-team/buzz-ui'

export default function App({ children }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}`}
						label="Theme Setup"
					/>
				</div>

				<div className="space-y-4">
					<h4 className="text-lg font-medium text-[var(--c-text)]">Custom Colors</h4>
					<CodeBlock 
						code={`:root {
  --c-primary: #7c3aed;        /* Purple theme */
  --c-primary-hover: #6d28d9;
  --radius-lg: 12px;           /* More rounded */
  --shadow-md: 0 8px 16px rgba(0,0,0,0.15);
}`}
						label="Custom Theme"
					/>
				</div>
			</section>

			{/* Navigation to Components */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">📚 Explore</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🧩 Components</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Browse the complete component library with examples.
						</p>
						<Link 
							href="/components"
							className="inline-flex items-center text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] font-medium"
						>
							View Components →
						</Link>
					</div>

					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🎨 Theming</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Learn how to customize colors and design tokens.
						</p>
						<Link 
							href="/docs/theme"
							className="inline-flex items-center text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] font-medium"
						>
							Theme Guide →
						</Link>
					</div>

					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">⚡ Examples</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							See components in action with real-world examples.
						</p>
						<Link 
							href="/components"
							className="inline-flex items-center text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] font-medium"
						>
							See Examples →
						</Link>
					</div>
				</div>
			</section>

			{/* Quick Example */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">✨ Quick Example</h2>
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Build a Card with Button</h3>
					<CodeBlock 
						code={`import { Card, Button, Badge } from '@creo-team/buzz-ui'

export default function Example() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Card</h2>
        <Badge variant="success">New</Badge>
      </div>
      <p className="text-[var(--c-text-secondary)] mb-4">
        This is an example of using multiple Buzz UI components together.
      </p>
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  )
}`}
						label="Example Component"
					/>
				</div>
			</section>

			{/* Features */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">🌟 Features</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-4">
							<h4 className="font-semibold text-[var(--c-text)] mb-2">🎯 TypeScript First</h4>
							<p className="text-[var(--c-text-secondary)] text-sm">
								Full TypeScript support with comprehensive type definitions.
							</p>
						</div>
						<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-4">
							<h4 className="font-semibold text-[var(--c-text)] mb-2">🌙 Dark Mode</h4>
							<p className="text-[var(--c-text-secondary)] text-sm">
								Built-in dark mode support with smooth transitions.
							</p>
						</div>
					</div>
					<div className="space-y-4">
						<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-4">
							<h4 className="font-semibold text-[var(--c-text)] mb-2">🎨 Customizable</h4>
							<p className="text-[var(--c-text-secondary)] text-sm">
								Easy to customize with CSS variables and design tokens.
							</p>
						</div>
						<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-4">
							<h4 className="font-semibold text-[var(--c-text)] mb-2">⚡ Performant</h4>
							<p className="text-[var(--c-text-secondary)] text-sm">
								Optimized for performance with minimal runtime overhead.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

