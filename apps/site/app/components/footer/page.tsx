"use client"
import { Footer, FooterVariant } from '@creo-team/buzz-ui/client'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function FooterDocsPage() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Footer</h1>

			<div className="mt-8 space-y-8">
				{/* Simple Footer */}
				<section>
					<h2 className="text-xl font-semibold mb-4">Simple Footer</h2>
					<Footer
						variant={FooterVariant.Simple}
						links={[
							{ key: 'docs', label: 'Docs', href: '/docs' },
							{ key: 'components', label: 'Components', href: '/components' },
							{ key: 'github', label: 'GitHub', href: 'https://github.com/creo-team/buzz-ui' },
						]}
						copyright={
							<div className="text-sm">
								© {new Date().getFullYear()} Buzz UI. All rights reserved.
							</div>
						}
					/>
				</section>

				{/* Modern Footer */}
				<section>
					<h2 className="text-xl font-semibold mb-4">Modern Footer</h2>
					<Footer
						variant={FooterVariant.Modern}
						links={[
							{ key: 'privacy', label: 'Privacy', href: '/privacy' },
							{ key: 'terms', label: 'Terms', href: '/terms' },
						]}
						newsletter={{
							title: "Subscribe to our newsletter",
							description: "Get the latest updates and news delivered to your inbox.",
							onSubmit: (email: string) => alert(`Subscribed: ${email}`)
						}}
						copyright="© 2025 Buzz UI. All rights reserved."
					/>
				</section>

				{/* Glass Footer */}
				<section>
					<h2 className="text-xl font-semibold mb-4">Glass Footer</h2>
					<Footer
						variant={FooterVariant.Glass}
						links={[
							{ key: 'home', label: 'Home', href: '/' },
							{ key: 'components', label: 'Components', href: '/components' },
						]}
						copyright={
							<div className="flex items-center gap-2 text-sm">
								<span>© {new Date().getFullYear()} Buzz UI</span>
								<span className="text-[var(--c-text-muted)]">•</span>
								<Link className="text-[var(--c-link)] hover:underline" href="/privacy">Privacy</Link>
							</div>
						}
					/>
				</section>
			</div>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">API Reference</h2>
			<ApiTable
				title="Footer Props"
				className="mt-4"
				rows={[
					{ prop: 'variant', type: 'FooterVariant', default: 'Sections', description: 'Visual style variant' },
					{ prop: 'sections', type: 'FooterSection[]', description: 'Footer columns with titles and links' },
					{ prop: 'links', type: 'FooterLink[]', description: 'Simple set of inline links' },
					{ prop: 'logo', type: 'React.ReactNode', description: 'Logo or brand element' },
					{ prop: 'social', type: 'FooterLink[]', description: 'Social media links' },
					{ prop: 'newsletter', type: '{ title: string; description: string; onSubmit: (email: string) => void }', description: 'Newsletter subscription form' },
					{ prop: 'className', type: 'string', description: 'Additional CSS classes' },
				]}
			/>
		</div>
	)
}