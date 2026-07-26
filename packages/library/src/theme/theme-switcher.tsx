"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip } from '../overlays/tooltip.js'
import { useThemeSwitcher, resolveThemeIcon, type AnyThemeConfig } from './use-theme-switcher.js'

export interface ThemeConfig {
	value: string
	label: string
	icon: React.ComponentType<{ className?: string }> | string
}

export interface ThemeSwitcherProps {
	themes?: ThemeConfig[]
	defaultTheme?: string
	/** Server-read theme for flicker-free SSR (pass from `getServerTheme`). */
	initialTheme?: string
	className?: string
}

const defaultThemes: ThemeConfig[] = [
	{ value: 'light', label: 'Light', icon: 'sun' },
	{ value: 'dark', label: 'Dark', icon: 'moon' },
]

/**
 * Segmented pill switcher for a small set of themes (max 3). Clicking the
 * active theme cycles to the next; Alt+T cycles from anywhere.
 */
export function ThemeSwitcher({
	themes = defaultThemes,
	defaultTheme = 'light',
	initialTheme,
	className,
}: ThemeSwitcherProps) {
	const options = (themes.length > 0 ? themes.slice(0, 3) : defaultThemes) as AnyThemeConfig[]
	const { theme, mounted, setTheme, cycle } = useThemeSwitcher({
		themes: options,
		defaultTheme,
		initialTheme,
	})

	return (
		<div className={cx('bz-theme-switcher', className)} role="group" aria-label="Theme">
			{options.map(option => {
				const Icon = resolveThemeIcon(option)
				const isActive = theme === option.value
				return (
					<Tooltip key={option.value} content={`${option.label} (Alt+T)`}>
						<button
							type="button"
							className="bz-theme-switcher__option"
							data-active={isActive || undefined}
							aria-label={`Switch to ${option.value} theme`}
							aria-pressed={isActive}
							disabled={!mounted}
							onClick={() => (isActive ? cycle() : setTheme(option.value))}
						>
							<Icon className="bz-theme-switcher__icon" />
						</button>
					</Tooltip>
				)
			})}
		</div>
	)
}
