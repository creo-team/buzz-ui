'use client'

export default function BestPracticesDocsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Best Practices</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Simple, elegant, reusable</p>
			</div>
			<ul className="list-disc pl-6 space-y-2 text-[var(--c-text)]">
				<li>Prefer CSS variables over JS for styling</li>
				<li>Keep components focused and composable</li>
				<li>Avoid inline ternaries for clarity</li>
				<li>Internationalize user-facing strings</li>
			</ul>
		</div>
	)
}


