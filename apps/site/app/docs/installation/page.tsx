'use client'

import { CodeBlock } from '../../../components/code-block'

export default function InstallationPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Installation</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					Get Buzz UI up and running in your React project.
				</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Requirements</h2>
				<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-4">
					<ul className="space-y-2 text-[var(--c-text)]">
						<li>• React 18+</li>
						<li>• TypeScript 4.7+ (recommended)</li>
						<li>• Next.js 13+ or any React framework</li>
						<li>• Tailwind CSS 3.0+ (optional but recommended)</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Install Package</h2>
				<CodeBlock 
					code="npm install @creo-team/buzz-ui"
					label="npm"
				/>
				<div className="mt-4">
					<CodeBlock 
						code="yarn add @creo-team/buzz-ui"
						label="yarn"
					/>
				</div>
				<div className="mt-4">
					<CodeBlock 
						code="pnpm add @creo-team/buzz-ui"
						label="pnpm"
					/>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Import the Stylesheet</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					One import gives you every design token (all six themes) and all component styles —
					no Tailwind configuration, no manual CSS variables:
				</p>
				<CodeBlock 
					code={`// app/layout.tsx (or your app entry)
import '@creo-team/buzz-ui/styles.css'`}
					label="Required, once"
				/>
				<p className="text-[var(--c-text-secondary)] mt-4">
					Themes are selected with <code>data-theme</code> on <code>&lt;html&gt;</code> — see the
					theming docs for switchers, SSR and custom themes.
				</p>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Import Components</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					Import and use components in your React application:
				</p>
				<CodeBlock 
					code={`import { Button, Card, Badge } from '@creo-team/buzz-ui'

export default function App() {
  return (
    <div className="p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Buzz UI</h1>
        <p className="text-[var(--c-text-secondary)] mb-4">
          Start building with our component library.
        </p>
        <div className="flex gap-2">
          <Button variant="bold">Get Started</Button>
          <Badge variant="success">New</Badge>
        </div>
      </Card>
    </div>
  )
}`}
					label="Basic Usage"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Optional: Theme Provider</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					For dark mode and advanced theming, wrap your app with the ThemeProvider:
				</p>
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
					label="Layout with Theme Provider"
				/>
			</section>

			<div className="bg-[var(--c-success-light)] border border-[var(--c-success)] rounded-[var(--radius-lg)] p-6">
				<h3 className="text-lg font-semibold text-[var(--c-success)] mb-2">✅ You're Ready!</h3>
				<p className="text-[var(--c-text)]">
					Buzz UI is now installed and ready to use. Check out the{' '}
					<a href="/docs/quick-start" className="text-[var(--c-primary)] hover:underline">Quick Start guide</a>{' '}
					for next steps.
				</p>
			</div>
		</div>
	)
}
