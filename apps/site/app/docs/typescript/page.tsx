'use client'

import { CodeBlock } from '../../../components/code-block'

export default function TypeScriptDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">TypeScript</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					Buzz UI is written in TypeScript with rich types out of the box
				</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Types and Props</h2>
				<CodeBlock
					code={`import { Button, type ThemeConfig } from '@creo-team/buzz-ui'

const themes: ThemeConfig[] = [
	{ value: 'light', label: 'Light', icon: () => null },
	{ value: 'dark', label: 'Dark', icon: () => null },
]

export default function Example() {
	return <Button variant="primary">Typed button</Button>
}`}
					label="Types"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Strict Mode</h2>
				<p className="text-[var(--c-text-secondary)]">We recommend enabling <code>"strict": true</code> in your tsconfig for the best DX</p>
			</section>
		</div>
	)
}


