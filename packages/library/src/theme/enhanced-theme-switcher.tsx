"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip } from '../overlays/tooltip.js'
import { Dropdown, type DropdownItem } from '../overlays/dropdown.js'
import { IconPalette, IconCheck } from '../internal/icons.js'
import { useThemeSwitcher, resolveThemeIcon, type AnyThemeConfig } from './use-theme-switcher.js'
import type { ThemeConfigWithPreset } from './theme-presets.js'

export interface EnhancedThemeConfig {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string
	colors?: ThemeConfigWithPreset['colors']
}

export interface EnhancedThemeSwitcherProps {
	/** Themes shown as pills. */
	primaryThemes?: (EnhancedThemeConfig | ThemeConfigWithPreset)[]
	/** Full theme list; extras beyond the pills go into the dropdown. */
	allThemes?: (EnhancedThemeConfig | ThemeConfigWithPreset)[]
	defaultTheme?: string
	/** Server-read theme for flicker-free SSR (pass from `getServerTheme`). */
	initialTheme?: string
	className?: string
	maxPrimaryThemes?: number
}

const defaultPrimaryThemes: EnhancedThemeConfig[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
]

const defaultAllThemes: EnhancedThemeConfig[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'midnight', label: 'Midnight' },
	{ value: 'forest', label: 'Forest' },
	{ value: 'ocean', label: 'Ocean' },
	{ value: 'umbro', label: 'Umbro' },
]

/**
 * Pills for the primary themes plus a dropdown for the rest — the full
 * switcher for apps with many themes. Alt+T cycles through everything.
 */
export function EnhancedThemeSwitcher({
	primaryThemes = defaultPrimaryThemes,
	allThemes = defaultAllThemes,
	defaultTheme = 'light',
	initialTheme,
	className,
	maxPrimaryThemes = 2,
}: EnhancedThemeSwitcherProps) {
	const all = allThemes as AnyThemeConfig[]
	const primary = (primaryThemes as AnyThemeConfig[]).slice(0, maxPrimaryThemes)
	const additional = all.filter(t => !primary.find(p => p.value === t.value))

	const { theme, mounted, setTheme, cycle } = useThemeSwitcher({
		themes: all,
		defaultTheme,
		initialTheme,
	})

	const activeAdditional = additional.find(t => t.value === theme)
	const DropdownIcon = activeAdditional ? resolveThemeIcon(activeAdditional) : IconPalette

	const dropdownItems: DropdownItem[] = additional.map(option => {
		const Icon = resolveThemeIcon(option)
		return {
			key: option.value,
			label: (
				<span className="bz-theme-menu-item" data-active={theme === option.value || undefined}>
					<span>{option.label}</span>
					{theme === option.value && <IconCheck className="bz-theme-menu-item__check" />}
				</span>
			),
			icon: <Icon className="bz-theme-switcher__icon" />,
			onClick: () => setTheme(option.value),
		}
	})

	return (
		<div className={cx('bz-theme-switcher', className)} role="group" aria-label="Theme">
			{primary.map(option => {
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
			{additional.length > 0 && (
				<Dropdown
					align="end"
					items={dropdownItems}
					trigger={
						<button
							type="button"
							className="bz-theme-switcher__option"
							data-active={Boolean(activeAdditional) || undefined}
							aria-label="More themes"
							title="More themes"
							disabled={!mounted}
						>
							<DropdownIcon className="bz-theme-switcher__icon" />
						</button>
					}
				/>
			)}
		</div>
	)
}
