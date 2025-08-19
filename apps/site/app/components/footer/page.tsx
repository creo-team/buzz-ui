"use client"
import { Footer } from '@creo-team/buzz-ui/server'
import { Card } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

const socialLinks = [
	{
		key: 'github',
		label: 'GitHub',
		href: 'https://github.com',
		icon: (
			<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
		)
	},
	{
		key: 'twitter',
		label: 'Twitter',
		href: 'https://twitter.com',
		icon: (
			<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
			</svg>
		)
	},
	{
		key: 'linkedin',
		label: 'LinkedIn',
		href: 'https://linkedin.com',
		icon: (
			<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
			</svg>
		)
	}
]

const footerSections = [
	{
		key: 'product',
		title: 'Product',
		links: [
			{ key: 'features', label: 'Features', href: '#' },
			{ key: 'pricing', label: 'Pricing', href: '#' },
			{ key: 'changelog', label: 'Changelog', href: '#' },
			{ key: 'roadmap', label: 'Roadmap', href: '#' }
		]
	},
	{
		key: 'resources',
		title: 'Resources',
		links: [
			{ key: 'docs', label: 'Documentation', href: '/docs' },
			{ key: 'api', label: 'API Reference', href: '#' },
			{ key: 'guides', label: 'Guides', href: '#' },
			{ key: 'blog', label: 'Blog', href: '#' }
		]
	},
	{
		key: 'company',
		title: 'Company',
		links: [
			{ key: 'about', label: 'About', href: '#' },
			{ key: 'team', label: 'Team', href: '#' },
			{ key: 'careers', label: 'Careers', href: '#' },
			{ key: 'contact', label: 'Contact', href: '#' }
		]
	},
	{
		key: 'legal',
		title: 'Legal',
		links: [
			{ key: 'privacy', label: 'Privacy Policy', href: '#' },
			{ key: 'terms', label: 'Terms of Service', href: '#' },
			{ key: 'cookies', label: 'Cookie Policy', href: '#' },
			{ key: 'license', label: 'License', href: '#' }
		]
	}
]

const simpleLinks = [
	{ key: 'about', label: 'About', href: '#' },
	{ key: 'blog', label: 'Blog', href: '#' },
	{ key: 'team', label: 'Team', href: '#' },
	{ key: 'pricing', label: 'Pricing', href: '#' },
	{ key: 'contact', label: 'Contact', href: '#' }
]

export default function FooterDocs() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Footer</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Responsive footer components with multiple layout options for different use cases.
			</p>
			
			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Minimal Footer</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="minimal"
					logo="Buzz UI"
					copyright="© 2025 Buzz UI. All rights reserved."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`import { Footer } from '@creo-team/buzz-ui/server'

<Footer 
	variant="minimal"
	logo="Buzz UI"
	copyright="© 2025 Buzz UI. All rights reserved."
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Simple Footer</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="simple"
					links={simpleLinks}
					copyright="© 2025 Buzz UI. All rights reserved."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`<Footer 
	variant="simple"
	links={[
		{ key: 'about', label: 'About', href: '#' },
		{ key: 'blog', label: 'Blog', href: '#' },
		{ key: 'team', label: 'Team', href: '#' }
	]}
	copyright="© 2025 Buzz UI. All rights reserved."
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Modern Footer with Newsletter</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="modern"
					logo="Buzz UI"
					links={simpleLinks}
					social={socialLinks}
					newsletter={{
						title: "Subscribe to our newsletter",
						description: "Get the latest updates and news delivered to your inbox.",
						onSubmit: (email) => alert(`Subscribed: ${email}`)
					}}
					copyright="© 2025 Buzz UI. All rights reserved."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`<Footer 
	variant="modern"
	logo="Buzz UI"
	links={links}
	social={socialLinks}
	newsletter={{
		title: "Subscribe to our newsletter",
		description: "Get the latest updates delivered to your inbox.",
		onSubmit: (email) => console.log('Subscribed:', email)
	}}
	copyright="© 2025 Buzz UI. All rights reserved."
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Glass Footer</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="glass"
					logo="Buzz UI"
					sections={footerSections.slice(0, 3)}
					links={simpleLinks}
					social={socialLinks}
					copyright="© 2025 Buzz UI. All rights reserved."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`<Footer 
	variant="glass"
	logo="Buzz UI"
	sections={footerSections}
	links={simpleLinks}
	social={socialLinks}
	copyright="© 2025 Buzz UI. All rights reserved."
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Epic Footer</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="epic"
					logo="Buzz UI"
					sections={footerSections}
					links={simpleLinks}
					social={socialLinks}
					newsletter={{
						title: "Stay in the loop",
						description: "Join thousands of developers and get our latest updates, tutorials, and announcements delivered straight to your inbox.",
						onSubmit: (email) => alert(`Welcome aboard! Check ${email} for confirmation.`)
					}}
					copyright="© 2025 Buzz UI. Crafted with ❤️ by developers, for developers."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`<Footer 
	variant="epic"
	logo="Buzz UI"
	sections={footerSections}
	links={simpleLinks}
	social={socialLinks}
	newsletter={{
		title: "Stay in the loop",
		description: "Join thousands of developers...",
		onSubmit: (email) => handleSubscribe(email)
	}}
	copyright="© 2025 Buzz UI. Crafted with ❤️"
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Footer with Sections</h2>
			<Card variant="elevated" className="mt-4 overflow-hidden">
				<Footer 
					variant="sections"
					logo="Buzz UI"
					sections={footerSections}
					social={socialLinks}
					copyright="© 2025 Buzz UI. All rights reserved."
				/>
				<div className="mt-6 p-6 border-t border-[var(--c-border)]">
					<CodeBlock code={`<Footer 
	variant="sections"
	logo="Buzz UI"
	sections={[
		{
			key: 'product',
			title: 'Product',
			links: [
				{ key: 'features', label: 'Features', href: '#' },
				{ key: 'pricing', label: 'Pricing', href: '#' }
			]
		},
		{
			key: 'resources',
			title: 'Resources',
			links: [
				{ key: 'docs', label: 'Documentation', href: '/docs' },
				{ key: 'api', label: 'API Reference', href: '#' }
			]
		}
	]}
	social={socialLinks}
	copyright="© 2025 Buzz UI. All rights reserved."
/>`} />
				</div>
			</Card>

			<ApiTable
				title="API Reference"
				className="mt-12"
				rows={[
					{
						prop: "variant",
						type: "'simple' | 'sections' | 'modern' | 'minimal' | 'glass' | 'epic'",
						default: "'simple'",
						description: "Footer layout variant"
					},
					{
						prop: "sections",
						type: "FooterSection[]",
						description: "Section groups with title and links (for sections/glass/epic variants)"
					},
					{
						prop: "links",
						type: "FooterLink[]",
						description: "Simple link list for footer bottom"
					},
					{
						prop: "copyright",
						type: "React.ReactNode",
						description: "Copyright text or component"
					},
					{
						prop: "logo",
						type: "React.ReactNode",
						description: "Logo text or component"
					},
					{
						prop: "social",
						type: "FooterLink[]",
						description: "Social media links with icons"
					},
					{
						prop: "newsletter",
						type: "{ title: string, description: string, onSubmit: (email: string) => void }",
						description: "Newsletter subscription configuration"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<div className="mt-8">
				<h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Type Definitions</h3>
				<CodeBlock code={`interface FooterLink {
	key: string
	label: React.ReactNode
	href: string
	icon?: React.ReactNode
}

interface FooterSection {
	key: string
	title: string
	links: FooterLink[]
}`} />
			</div>

			<div className="mt-8 p-4 bg-[var(--c-surface-3)] rounded-lg">
				<p className="text-sm text-[var(--c-text-secondary)]">
					<strong>Accessibility Note:</strong> The footer component uses semantic HTML with proper ARIA labels. 
					All interactive elements are keyboard accessible and social links include appropriate aria-label attributes.
				</p>
			</div>
		</div>
	)
}