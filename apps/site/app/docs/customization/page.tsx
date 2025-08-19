'use client'

import { CodeBlock } from '../../../components/code-block'

export default function CustomizationDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Customization</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Shape Buzz UI to your brand</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">CSS First</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">Prefer CSS variables for styling changes</p>
				<CodeBlock
					code={`:root {
	--c-primary: #0ea5e9
	--radius-md: 12px
}`}
					label="globals.css"
				/>
			</section>
		</div>
	)
}


