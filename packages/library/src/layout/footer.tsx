import * as React from 'react'
import { cx } from '../internal/cx.js'
import { NewsletterForm } from './newsletter-form.js'

export enum FooterVariant {
	Simple = 'simple',
	Sections = 'sections',
	Modern = 'modern',
	Minimal = 'minimal',
	Glass = 'glass',
	Epic = 'epic',
}

export interface FooterLink {
	key: string
	label: React.ReactNode
	href: string
	icon?: React.ReactNode
}

export interface FooterSection {
	key: string
	title: string
	links: FooterLink[]
}

export interface FooterProps {
	variant?: FooterVariant | `${FooterVariant}`
	sections?: FooterSection[]
	links?: FooterLink[]
	copyright?: React.ReactNode
	logo?: React.ReactNode
	/** Short blurb rendered near the logo in rich variants. */
	tagline?: React.ReactNode
	social?: FooterLink[]
	newsletter?: {
		title: string
		description: string
		onSubmit: (email: string) => void
	}
	className?: string
}

function LinkList({ links, className }: { links: FooterLink[]; className?: string }) {
	if (links.length === 0) return null
	return (
		<ul className={cx('bz-footer__links', className)}>
			{links.map(link => (
				<li key={link.key}>
					<a className="bz-footer__link" href={link.href}>
						{link.icon != null && <span className="bz-footer__link-icon">{link.icon}</span>}
						{link.label}
					</a>
				</li>
			))}
		</ul>
	)
}

function SectionColumns({ sections }: { sections: FooterSection[] }) {
	if (sections.length === 0) return null
	return (
		<div className="bz-footer__sections">
			{sections.map(section => (
				<div key={section.key} className="bz-footer__section">
					<h3 className="bz-footer__section-title">{section.title}</h3>
					<LinkList links={section.links} className="bz-footer__links--stacked" />
				</div>
			))}
		</div>
	)
}

/**
 * Site footer in six layouts, from minimal to epic. Server-component safe —
 * only the optional newsletter form hydrates on the client.
 */
export function Footer({
	variant = FooterVariant.Simple,
	sections = [],
	links = [],
	copyright,
	logo,
	tagline,
	social = [],
	newsletter,
	className,
}: FooterProps) {
	const resolved = variant as FooterVariant
	const rich = resolved === FooterVariant.Sections || resolved === FooterVariant.Modern || resolved === FooterVariant.Epic

	return (
		<footer className={cx('bz-footer', className)} data-variant={resolved}>
			<div className="bz-footer__inner">
				{resolved === FooterVariant.Minimal && (
					<div className="bz-footer__row">
						{logo != null && <div className="bz-footer__logo">{logo}</div>}
						<div className="bz-footer__copyright">{copyright}</div>
					</div>
				)}

				{(resolved === FooterVariant.Simple || resolved === FooterVariant.Glass) && (
					<div className="bz-footer__row">
						<LinkList links={links} />
						<div className="bz-footer__copyright">{copyright}</div>
					</div>
				)}

				{rich && (
					<>
						<div className="bz-footer__top">
							{(logo != null || tagline != null) && (
								<div className="bz-footer__brand">
									{logo != null && <div className="bz-footer__logo">{logo}</div>}
									{tagline != null && <p className="bz-footer__tagline">{tagline}</p>}
									{social.length > 0 && (
										<div className="bz-footer__social">
											{social.map(item => (
												<a key={item.key} className="bz-footer__social-link" href={item.href} aria-label={typeof item.label === 'string' ? item.label : undefined}>
													{item.icon ?? item.label}
												</a>
											))}
										</div>
									)}
								</div>
							)}
							<SectionColumns sections={sections} />
							{newsletter && <NewsletterForm {...newsletter} />}
						</div>
						<div className="bz-footer__bottom">
							<LinkList links={links} />
							<div className="bz-footer__copyright">{copyright}</div>
						</div>
					</>
				)}
			</div>
		</footer>
	)
}
