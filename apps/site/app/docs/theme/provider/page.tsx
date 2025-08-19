'use client'

import { CodeBlock } from '../../../../components/code-block'

export default function ThemeProviderDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Theme Provider</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Enable dark mode and custom themes</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Basic Usage</h2>
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
					label="Layout"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Multiple Themes</h2>
				<CodeBlock
					code={`import { ThemeProvider, type ThemeConfig } from '@creo-team/buzz-ui'

const themes: ThemeConfig[] = [
	{ value: 'light', label: 'Light', icon: () => null },
	{ value: 'dark', label: 'Dark', icon: () => null },
	{ value: 'umbro', label: 'Umbro', icon: () => null },
]

export default function RootLayout({ children }) {
	return (
		<ThemeProvider themes={themes} defaultTheme="umbro">{children}</ThemeProvider>
	)
}`}
					label="Themes"
				/>
			</section>
		</div>
	)
}


