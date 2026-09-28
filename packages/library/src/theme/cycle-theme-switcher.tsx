"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip } from '../overlays/tooltip.js'
import { useThemeSwitcher, resolveThemeIcon, type AnyThemeConfig } from './use-theme-switcher.js'
import type { ThemeConfigWithPreset } from './theme-presets.js'

/** A selectable theme for {@link CycleThemeSwitcher}. */
export interface CycleThemeConfig {
	value: string
	label: string
	/** Component or built-in icon name ('sun', 'moon', …); inferred from the theme's name when omitted. */
	icon?: React.ComponentType<{ className?: string }> | string
	/** Custom palette applied as CSS variables while the theme is active. */
	colors?: ThemeConfigWithPreset['colors']
}

/** Props for {@link CycleThemeSwitcher}. */
export interface CycleThemeSwitcherProps {
	/** Themes to cycle through. Defaults to the six built-ins. */
	themes?: (CycleThemeConfig | ThemeConfigWithPreset)[]
	/** Theme used before a saved cookie exists. @default 'light' */
	defaultTheme?: string
	/** Server-read theme for flicker-free SSR (pass from `getServerTheme`). */
	initialTheme?: string
	className?: string
	/** Wrap the button in a tooltip naming the current theme. @default true */
	showTooltip?: boolean
	/** Register Alt+T to cycle themes. @default true */
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
