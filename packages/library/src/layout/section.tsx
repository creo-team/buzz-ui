import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Surface treatment of the band: `default` inherits the page background,
	 * `muted` recedes onto the secondary surface (alternate bands with it),
	 * `raised` sits on the primary surface with hairline borders.
	 * @default 'default'
	 */
	variant?: 'default' | 'muted' | 'raised'
	/**
	 * Max content width: `narrow` for prose (42rem), `default` for pages
	 * (72rem), `wide` for dashboards (80rem), `full` for edge-to-edge.
	 * @default 'default'
	 */
	width?: 'narrow' | 'default' | 'wide' | 'full'
	/** Vertical rhythm of the band. @default 'default' */
	padding?: 'none' | 'compact' | 'default' | 'spacious'
	/** Rendered element. @default 'section' */
	as?: 'section' | 'div' | 'article' | 'aside'
	children?: React.ReactNode
}

/**
 * A full-bleed page band with a centered, width-capped content column — the
 * building block for landing pages and content pages alike. The band paints
 * the background edge to edge; the inner column handles max-width and side
 * gutters, so alternating `default`/`muted` sections produces the classic
 * striped-landing rhythm with no wrapper divs.
 *
 * Server-component safe — renders no client JavaScript.
 *
 * @example
 * <Section>
 *   <PageHeader title="Features" description="Everything in the box." />
 *   …
 * </Section>
 * <Section variant="muted">…</Section>
 */
export function Section({
	variant = 'default',
	width = 'default',
	padding = 'default',
	as: Element = 'section',
	className,
	children,
	...props
}: SectionProps) {
	return (
		<Element
			className={cx('bz-section', className)}
			data-variant={variant}
			data-padding={padding}
			{...props}
		>
			<div className="bz-section__inner" data-width={width}>
				{children}
			</div>
		</Element>
	)
}
