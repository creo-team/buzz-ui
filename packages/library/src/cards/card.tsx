import * as React from 'react'
import { cx } from '../internal/cx.js'

/**
 * Surface treatment: `default` is a bordered surface, `elevated` adds a
 * shadow, `outlined` sits on the secondary surface with a stronger border.
 */
export enum CardVariant {
	Default = 'default',
	Elevated = 'elevated',
	Outlined = 'outlined',
}

/** Props for {@link Card}. */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	/** Header content; a plain string renders as an `<h3>` title. */
	header?: React.ReactNode
	/** Controls aligned to the end of the header row. */
	actions?: React.ReactNode
	/** Footer area separated by a divider. */
	footer?: React.ReactNode
	/** Surface treatment. @default 'default' */
	variant?: CardVariant | `${CardVariant}`
	/** Adds hover elevation + pointer affordance for clickable cards. */
	interactive?: boolean
	/** Remove the default body padding (edge-to-edge content). */
	flush?: boolean
}

/**
 * Flexible content container with optional header, actions and footer.
 * Server-component safe — zero client JavaScript.
 */
export function Card({
	header,
	actions,
	footer,
	variant = CardVariant.Default,
	interactive = false,
	flush = false,
	className,
	children,
	...props
}: CardProps) {
	return (
		<div
			className={cx('bz-card', className)}
			data-variant={variant as string}
			data-interactive={interactive || undefined}
			data-flush={flush || undefined}
			{...props}
		>
			{(header != null || actions != null) && (
				<div className="bz-card__header">
					{header != null && (
						<div className="bz-card__header-content">
							{typeof header === 'string' ? <h3 className="bz-card__title">{header}</h3> : header}
						</div>
					)}
					{actions != null && <div className="bz-card__actions">{actions}</div>}
				</div>
			)}
			<div className="bz-card__body">{children}</div>
			{footer != null && <div className="bz-card__footer">{footer}</div>}
		</div>
	)
}
