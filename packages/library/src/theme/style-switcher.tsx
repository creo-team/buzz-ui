"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconChevronDown } from '../internal/icons.js'
import { Popover, PopoverTrigger, PopoverContent } from '../overlays/popover.js'
import { ALL_STYLES, Style, type StyleConfig } from './style-types.js'
import { useStyleSwitcher } from './use-style-switcher.js'

export interface StyleSwitcherProps {
	styles?: StyleConfig[]
	defaultStyle?: Style | string
	initialStyle?: string
	className?: string
}

/**
 * Style picker: a compact trigger that opens a grid of live preview tiles.
 * Every tile carries its own `data-style` attribute, so each preview chip
 * renders with that preset's real tokens — radius, border weight, shadow
 * character and control shape — not an artist's impression of them.
 */
export function StyleSwitcher({
	styles = ALL_STYLES,
	defaultStyle = Style.Soft,
	initialStyle,
	className,
}: StyleSwitcherProps) {
	const { style, mounted, setStyle } = useStyleSwitcher({
		styles,
		defaultStyle,
		initialStyle,
	})
	const [open, setOpen] = React.useState(false)

	const active = styles.find(option => option.value === style)

	return (
		<Popover open={open} onOpenChange={setOpen} side="bottom" align="end" sideOffset={8}>
			<PopoverTrigger asChild>
				<button type="button" className={cx('bz-style-switcher__trigger', className)} disabled={!mounted}>
					<span className="bz-style-switcher__chip-dot" aria-hidden="true" />
					{/* Visible label stays in the accessible name (Label in Name). */}
					<span className="bz-visually-hidden">Style: </span>
					{active?.label ?? 'Style'}
					<IconChevronDown aria-hidden="true" />
				</button>
			</PopoverTrigger>
			<PopoverContent aria-label="Style">
				<div className="bz-style-switcher__grid" role="group" aria-label="Styles">
					{styles.map(option => {
						const isActive = style === option.value
						return (
							<button
								key={option.value}
								type="button"
								className="bz-style-switcher__tile"
								data-style={option.value}
								data-active={isActive || undefined}
								aria-pressed={isActive}
								aria-label={`Switch to ${option.label.toLowerCase()} style`}
								onClick={() => {
									setStyle(option.value.toString())
									setOpen(false)
								}}
							>
								<span className="bz-style-switcher__chip" aria-hidden="true">
									<span className="bz-style-switcher__chip-dot" />
									<span className="bz-style-switcher__chip-line" />
								</span>
								<span className="bz-style-switcher__tile-name">{option.label}</span>
								{option.description && (
									<span className="bz-style-switcher__tile-desc">{option.description}</span>
								)}
							</button>
						)
					})}
				</div>
			</PopoverContent>
		</Popover>
	)
}
