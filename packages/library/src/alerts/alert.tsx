import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconInfo, IconSuccess, IconWarning, IconDanger } from '../internal/icons.js'

/** Status color of the alert, which also picks the default icon. */
export enum AlertVariant {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
}

// Accept both enum and its string literal values for DX
type AlertVariantInput = AlertVariant | `${AlertVariant}`

const ICONS: Record<AlertVariant, React.ReactNode> = {
	[AlertVariant.Info]: <IconInfo className="bz-alert__icon-svg" />,
	[AlertVariant.Success]: <IconSuccess className="bz-alert__icon-svg" />,
	[AlertVariant.Warning]: <IconWarning className="bz-alert__icon-svg" />,
	[AlertVariant.Danger]: <IconDanger className="bz-alert__icon-svg" />,
}

/** Props for {@link Alert}. */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	/** Status color. @default 'info' */
	variant?: AlertVariantInput
	/** Bold heading rendered above the body. */
	header?: React.ReactNode
	/** Replace the variant icon; pass `null` to hide it. */
	icon?: React.ReactNode
	/** Action buttons/links rendered under the content. */
	actions?: React.ReactNode
}

/**
 * Inline callout for contextual feedback. Danger renders as `role="alert"`
 * (interrupting), others as polite status. Server-component safe.
 */
export function Alert({
	variant = AlertVariant.Info,
	header,
	icon,
	actions,
	className,
	children,
	...props
}: AlertProps) {
	const resolvedVariant = variant as AlertVariant
	const displayIcon = icon !== undefined ? icon : ICONS[resolvedVariant]
	return (
		<div
			className={cx('bz-alert', className)}
			data-variant={resolvedVariant}
			role={resolvedVariant === AlertVariant.Danger ? 'alert' : 'status'}
			{...props}
		>
			{displayIcon != null && <div className="bz-alert__icon">{displayIcon}</div>}
			<div className="bz-alert__content">
				{header != null && <div className="bz-alert__header">{header}</div>}
				<div className="bz-alert__body">{children}</div>
				{actions != null && <div className="bz-alert__actions">{actions}</div>}
			</div>
		</div>
	)
}
