'use client'

import { CodeBlock } from '../../../../components/code-block'

export default function DarkModeDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Dark Mode</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Enable dark mode via class and variables</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Enable Provider</h2>
				<CodeBlock
					code={`import { ThemeProvider } from '@creo-team/buzz-ui'

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider defaultTheme="light">{children}</ThemeProvider>
			</body>
		</html>
	)
}`}
					label="Provider"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Customize Dark Variables</h2>
				<CodeBlock
					code={`.dark {
	--c-background: #111827
	--c-text: #f9fafb
	--c-text-secondary: #d1d5db
	--c-surface: #1f2937
	--c-surface-2: #374151
	--c-border: #4b5563
	--c-primary: #ef4444
	--c-primary-hover: #dc2626
}`}
					label="globals.css"
				/>
			</section>
		</div>
	)
}


