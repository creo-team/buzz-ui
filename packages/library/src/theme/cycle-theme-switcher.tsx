"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip } from '../overlays/tooltip.js'
import { useThemeSwitcher, resolveThemeIcon, type AnyThemeConfig } from './use-theme-switcher.js'
import type { ThemeConfigWithPreset } from './theme-presets.js'

export interface CycleThemeConfig {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string
	colors?: ThemeConfigWithPreset['colors']
}

export interface CycleThemeSwitcherProps {
	themes?: (CycleThemeConfig | ThemeConfigWithPreset)[]
	defaultTheme?: string
	/** Server-read theme for flicker-free SSR (pass from `getServerTheme`). */
	initialTheme?: string
	className?: string
	showTooltip?: boolean
	enableHotkey?: boolean
}

const defaultCycleThemes: CycleThemeConfig[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'midnight', label: 'Midnight' },
	{ value: 'forest', label: 'Forest' },
	{ value: 'ocean', label: 'Ocean' },
	{ value: 'umbro', label: 'Umbro' },
]

/** Single-button switcher that cycles through all themes on click (and Alt+T). */
export function CycleThemeSwitcher({
	themes = defaultCycleThemes,
	defaultTheme = 'light',
	initialTheme,
	className,
	showTooltip = true,
	enableHotkey = true,
}: CycleThemeSwitcherProps) {
	const options = themes as AnyThemeConfig[]
	const { theme, mounted, cycle } = useThemeSwitcher({
		themes: options,
		defaultTheme,
		initialTheme,
		enableHotkey,
	})

	const current = options.find(t => t.value === theme) ?? options[0]
	const Icon = resolveThemeIcon(current)

	const button = (
		<button
			type="button"
			onClick={cycle}
			disabled={!mounted}
			className={cx('bz-cycle-theme-switcher', className)}
			aria-label={`Current theme: ${current.label}. Click to cycle themes.`}
		>
			<Icon className="bz-theme-switcher__icon" />
		</button>
	)

	if (!showTooltip) return button
	return (
		<Tooltip content={`${current.label}${enableHotkey ? ' (Alt+T)' : ''} — click to cycle`}>
			{button}
		</Tooltip>
	)
}
