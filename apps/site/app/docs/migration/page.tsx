'use client'

import { CodeBlock } from '../../../components/code-block'

export default function MigrationDocsPage() {
	return (
		<div className="space-y-8 mx-auto max-w-4xl px-4 py-12">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Migration</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">Upgrade guidance for major changes</p>
			</div>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-[var(--c-text)]">0.1.x → 0.2.0+</h2>
				<p className="text-[var(--c-text-secondary)]">
					0.2.0 rebuilt the library around zero dependencies, a shipped stylesheet, and React
					Server Components. Most component APIs are unchanged (legacy prop names such as{' '}
					<code>isOpen</code>/<code>onClose</code> still work), but four changes need action:
				</p>

				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-[var(--c-text)]">1. Import the stylesheet (required)</h3>
					<CodeBlock
						code={`// app/layout.tsx — once, at the app root
import '@creo-team/buzz-ui/styles.css'`}
					/>
					<p className="text-sm text-[var(--c-text-secondary)]">
						Components no longer rely on your Tailwind configuration or hand-written CSS
						variables — the stylesheet ships every token for all six themes.
					</p>
				</div>

				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-[var(--c-text)]">2. Toasts are built in</h3>
					<CodeBlock
						code={`- import toast, { Toaster } from 'react-hot-toast'
+ import { toast, Toaster } from '@creo-team/buzz-ui/client'`}
					/>
					<p className="text-sm text-[var(--c-text-secondary)]">
						The call signatures you likely use (<code>toast.success</code>,{' '}
						<code>toast.error</code>, <code>toast.promise</code>, <code>toast.dismiss</code>)
						are compatible. <code>HotToastProvider</code> keeps working as an alias of{' '}
						<code>Toaster</code>.
					</p>
				</div>

				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-[var(--c-text)]">3. ESM only</h3>
					<p className="text-sm text-[var(--c-text-secondary)]">
						The package no longer ships CommonJS. Every modern bundler (Next.js, Vite, Remix)
						handles this automatically; CJS <code>require()</code> consumers must switch to{' '}
						<code>import</code>.
					</p>
				</div>

				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-[var(--c-text)]">4. Framer Motion animation props are gone</h3>
					<p className="text-sm text-[var(--c-text-secondary)]">
						<code>AnimationPresets</code> and Modal/Dropdown <code>animationVariants</code> were
						removed — animations are CSS now. Restyle them by overriding the <code>bz-*</code>{' '}
						classes and keyframes.
					</p>
				</div>

				<p className="text-[var(--c-text-secondary)]">
					The full itemized list lives in the package&apos;s{' '}
					<a
						className="text-[var(--c-link,var(--c-primary))] underline"
						href="https://github.com/creo-team/buzz-ui/blob/main/packages/library/CHANGELOG.md"
					>
						CHANGELOG
					</a>
					.
				</p>
			</section>
		</div>
	)
}
