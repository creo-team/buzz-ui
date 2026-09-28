import * as React from 'react'
import { cx } from '../internal/cx.js'
import { NewsletterForm, type NewsletterFormProps } from './newsletter-form.js'

/**
 * Footer layout — from a single row to the full brand + link-columns
 * treatment. `Sections`, `Modern` and `Epic` are the rich layouts (brand,
 * link columns, newsletter); the rest render one row.
 */
export enum FooterVariant {
	/** Link row plus copyright on the secondary surface. The default. */
	Simple = 'simple',
	/** Rich layout: brand block, link columns, optional newsletter, bottom bar. */
	Sections = 'sections',
	/** The same rich layout as `Sections` (a separate styling hook). */
	Modern = 'modern',
	/** Logo and copyright only. */
	Minimal = 'minimal',
	/** The `Simple` row on a translucent, blurred surface. */
	Glass = 'glass',
	/** The rich layout, fading into the page background. */
	Epic = 'epic',
}

/** One footer link — used by `links`, `sections` and `social`. */
export interface FooterLink {
	key: string
	label: React.ReactNode
	href: string
	/** Leading icon. Social links render the icon alone, with a string `label` as the accessible name. */
	icon?: React.ReactNode
}

/** A titled column of links, rendered by the rich variants. */
export interface FooterSection {
	key: string
	title: string
	links: FooterLink[]
}

/** Props for {@link Footer}. */
export interface FooterProps {
	/** Layout. @default 'simple' */
	variant?: FooterVariant | `${FooterVariant}`
	/** Link columns — rendered only by the rich variants (`sections`, `modern`, `epic`). */
	sections?: FooterSection[]
	/** Flat link row: the whole body in `simple`/`glass`, the bottom bar in rich variants. */
	links?: FooterLink[]
	/** Copyright line — rendered by every variant. */
	copyright?: React.ReactNode
	/** Brand mark — shown by `minimal` and the rich variants. */
	logo?: React.ReactNode
	/** Short blurb rendered near the logo in rich variants. */
	tagline?: React.ReactNode
	/** Social links, rendered as round icon buttons in the rich variants. */
	social?: FooterLink[]
	/**
	 * Newsletter signup. From client components pass `onSubmit`; from Server
	 * Components pass `action` (a URL or server action) — functions that are
	 * not server actions cannot cross the RSC boundary.
	 */
	newsletter?: NewsletterFormProps
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
