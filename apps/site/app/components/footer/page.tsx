"use client"
import { Footer } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function FooterDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Footer</h1>
			<p className="mt-2 text-sm text-white/70">A simple, responsive footer with link list and copyright.</p>
			<div className="mt-4 overflow-hidden rounded-md border border-[var(--c-border)]">
				<Footer links={[{ key: 'github', label: 'GitHub', href: '#' }, { key: 'docs', label: 'Docs', href: '/docs' }]} copyright={<span>© 2025 Creo Team</span>} />
			</div>
			<div className="mt-4">
				<CodeBlock code={`import { Footer } from '@creo-team/buzz-ui/server'

<Footer links={[{ key: 'github', label: 'GitHub', href: '#' }]} copyright={<span>© 2025</span>} />`} />
			</div>
			<p className="mt-4 text-xs text-white/60">Accessibility: use a <code>footer</code> landmark; ensure link names are descriptive.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/footer/api">/components/footer/api</Link></p>
		</div>
	)
}

