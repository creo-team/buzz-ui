"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip, TooltipSize } from './tooltip.js'
import { IconInfo } from '../internal/icons.js'

export interface InfotipProps {
	title?: string
	description: React.ReactNode
	className?: string
	placement?: 'top' | 'right' | 'bottom' | 'left'
	widthClassName?: string
	/** Tooltip size preset. Default comfortable. */
	size?: TooltipSize | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * An information-icon trigger with a rich tooltip — inline contextual help.
 * Keyboard accessible: the icon is focusable and the tip shows on focus.
 */
export function Infotip({
	title,
	description,
	className,
	placement = 'top',
	widthClassName,
	size = 'md',
}: InfotipProps) {
	return (
		<Tooltip
			content={description}
			title={title}
			placement={placement}
			widthClassName={widthClassName}
			size={size}
		>
			<button
				type="button"
				className={cx('bz-infotip', className)}
				aria-label={title ? `Information: ${title}` : 'More information'}
			>
				<IconInfo className="bz-infotip__icon" />
			</button>
		</Tooltip>
	)
}
