import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconX } from '../internal/icons.js'

export enum ChipVariant {
	Default = 'default',
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Outline = 'outline',
}

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: ChipVariant | `${ChipVariant}`
	/** Leading icon or avatar. */
	icon?: React.ReactNode
	/**
	 * Shows a remove button and makes the chip dismissible. The handler makes
	 * this a client-boundary usage; without it the chip is a Server Component.
	 */
	onRemove?: () => void
	/** Accessible label for the remove button. */
	removeLabel?: string
}

/**
 * Compact labeled element for tags, filters and selections. Like Badge but
 * interactive-capable (icon + removable).
 */
export function Chip({
	variant = ChipVariant.Default,
	icon,
	onRemove,
	removeLabel = 'Remove',
	className,
	children,
	...props
}: ChipProps) {
	return (
		<span className={cx('bz-chip', className)} data-variant={variant as string} {...props}>
			{icon != null && <span className="bz-chip__icon">{icon}</span>}
			{children}
			{onRemove && (
				<button type="button" className="bz-chip__remove" aria-label={removeLabel} onClick={onRemove}>
					<IconX />
				</button>
			)}
		</span>
	)
}
