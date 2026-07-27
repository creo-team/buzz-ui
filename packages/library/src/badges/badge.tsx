import * as React from 'react'
import { cx } from '../internal/cx.js'

export enum BadgeVariant {
	Default = 'default',
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Outline = 'outline',
}

type BadgeVariantInput = BadgeVariant | `${BadgeVariant}`

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariantInput
	/** Leading status dot. */
	dot?: boolean
}

/** Small status label. Server-component safe. */
export function Badge({ variant = BadgeVariant.Default, dot = false, className, children, ...props }: BadgeProps) {
	return (
		<span className={cx('bz-badge', className)} data-variant={variant as string} {...props}>
			{dot && <span className="bz-badge__dot" aria-hidden="true" />}
			{children}
		</span>
	)
}
