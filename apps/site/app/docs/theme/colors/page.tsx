'use client'

import { CodeBlock } from '../../../../components/code-block'

export default function ThemeColorsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Custom Colors</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Tweak the palette using CSS variables</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Update Palette</h2>
				<CodeBlock
					code={`:root {
	--c-primary: #7c3aed
	--c-primary-hover: #6d28d9
	--c-success: #16a34a
	--c-warning: #f59e0b
	--c-danger: #ef4444
}

.dark {
	--c-primary: #a855f7
	--c-primary-hover: #9333ea
}`}
					label="globals.css"
				/>
			</section>
		</div>
	)
}


