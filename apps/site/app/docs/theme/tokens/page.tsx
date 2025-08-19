'use client'

import { CodeBlock } from '../../../../components/code-block'

export default function DesignTokensPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Design Tokens</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Core variables you can customize</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Radius</h2>
				<CodeBlock
					code={`:root {
	--radius-sm: 6px
	--radius-md: 8px
	--radius-lg: 10px
	--radius-xl: 14px
}`}
					label="Radius"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Shadows</h2>
				<CodeBlock
					code={`:root {
	--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
	--shadow-md: 0 8px 16px rgba(0,0,0,0.15)
	--shadow-lg: 0 16px 32px rgba(0,0,0,0.2)
}`}
					label="Shadows"
				/>
			</section>
		</div>
	)
}


