"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconInfo, IconSuccess, IconWarning, IconDanger, IconSparkles, IconX } from '../internal/icons.js'

export enum BannerVariant {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Development = 'development',
	Glass = 'glass',
	Gradient = 'gradient',
}

// Allow both enum values and their string literals
export type BannerVariantInput = BannerVariant | `${BannerVariant}`

const ICONS: Record<BannerVariant, React.ReactNode> = {
	[BannerVariant.Info]: <IconInfo />,
	[BannerVariant.Success]: <IconSuccess />,
	[BannerVariant.Warning]: <IconWarning />,
	[BannerVariant.Danger]: <IconDanger />,
	[BannerVariant.Development]: <IconWarning />,
	[BannerVariant.Glass]: <IconInfo />,
	[BannerVariant.Gradient]: <IconSparkles />,
}

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: React.ReactNode
	variant?: BannerVariantInput
	/** Replace the variant icon; pass `null` to hide it. */
	icon?: React.ReactNode
	dismissible?: boolean
	onDismiss?: () => void
	fixed?: boolean
	sticky?: boolean
	position?: 'top' | 'bottom'
	/** Subtle attention animation on the icon. */
	animated?: boolean
	action?: {
		label: string
		onClick: () => void
	}
}

/**
 * Full-width announcement bar. Supports fixed/sticky placement, a call to
 * action, and dismissal.
 */
export function Banner({
	children,
	variant = BannerVariant.Info,
	className,
	icon,
	dismissible = false,
	onDismiss,
	fixed = false,
	sticky = false,
	position = 'top',
	animated = false,
	action,
	...props
}: BannerProps) {
	const [visible, setVisible] = React.useState(true)
	const resolvedVariant = variant as BannerVariant
	const displayIcon = icon !== undefined ? icon : ICONS[resolvedVariant]

	if (!visible) return null

	const handleDismiss = () => {
		setVisible(false)
		onDismiss?.()
	}

	return (
		<div
			className={cx('bz-banner', className)}
			data-variant={resolvedVariant}
			data-placement={fixed ? 'fixed' : sticky ? 'sticky' : undefined}
			data-position={position}
			data-animated={animated || undefined}
			role={resolvedVariant === BannerVariant.Danger ? 'alert' : 'status'}
			{...props}
		>
			<div className="bz-banner__inner">
				{displayIcon != null && (
					<span className="bz-banner__icon" data-animated={animated || undefined}>
						{displayIcon}
					</span>
				)}
				<div className="bz-banner__content">{children}</div>
				{action && (
					<button type="button" className="bz-banner__action" onClick={action.onClick}>
						{action.label}
					</button>
				)}
				{dismissible && (
					<button
						type="button"
						className="bz-banner__dismiss"
						aria-label="Dismiss banner"
						onClick={handleDismiss}
					>
						<IconX />
					</button>
				)}
			</div>
		</div>
	)
}
