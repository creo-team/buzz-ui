import * as React from 'react'
import { cx } from '../internal/cx.js'

/** Props for {@link PageHeader}. */
export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
	/** The heading itself (replaces the native tooltip `title` attribute). */
	title: React.ReactNode
	/** One or two supporting sentences under the title. */
	description?: React.ReactNode
	/** Slot above the title — breadcrumbs, a back link, or an eyebrow label. */
	eyebrow?: React.ReactNode
	/** Actions on the trailing edge (typically one solid button plus quiet ones). */
	actions?: React.ReactNode
	/**
	 * Type scale: `lg` for landing heroes, `md` for page titles, `sm` for
	 * section headings inside a page. @default 'md'
	 */
	size?: 'sm' | 'md' | 'lg'
	/**
	 * Heading element level, independent of visual size — keep the document
	 * outline honest (one h1 per page). @default 1
	 */
	level?: 1 | 2 | 3
	/** Center the text block — landing-page section headers. @default 'start' */
	align?: 'start' | 'center'
	/** Hairline rule under the header. @default false */
	divider?: boolean
}

/**
 * The standard page/section header: eyebrow, title, description and actions
 * in one consistent, tight-tracked type ramp — instead of every page
 * hand-rolling its own heading classes and margins.
 *
 * Server-component safe — renders no client JavaScript.
 *
 * @example
 * <PageHeader
 *   eyebrow={<Breadcrumbs items={crumbs} />}
 *   title="Members"
 *   description="Everyone with access to this workspace."
 *   actions={<Button>Invite</Button>}
 *   divider
 * />
 */
export function PageHeader({
	title,
	description,
	eyebrow,
	actions,
	size = 'md',
	level = 1,
	align = 'start',
	divider = false,
	className,
	...props
}: PageHeaderProps) {
	const Heading = `h${level}` as 'h1' | 'h2' | 'h3'
	return (
		<header
			className={cx('bz-page-header', className)}
			data-size={size}
			data-align={align === 'center' ? 'center' : undefined}
			data-divider={divider || undefined}
			{...props}
		>
			{eyebrow != null && <div className="bz-page-header__eyebrow">{eyebrow}</div>}
			<div className="bz-page-header__row">
				<div className="bz-page-header__text">
					<Heading className="bz-page-header__title">{title}</Heading>
					{description != null && <p className="bz-page-header__description">{description}</p>}
				</div>
				{actions != null && <div className="bz-page-header__actions">{actions}</div>}
			</div>
		</header>
	)
}
