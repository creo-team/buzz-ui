import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ThemeProvider, useTheme } from '../src/theme/theme-provider'
import { THEME_PRESETS } from '../src/theme/theme-presets'

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

// Test component that uses the theme
function TestThemeComponent() {
	const { theme, setTheme, themes } = useTheme()
	
	return (
		<div>
			<div data-testid="current-theme">{theme}</div>
			<div data-testid="available-themes">{themes.length}</div>
			<button onClick={() => setTheme('dark')} data-testid="set-dark">
				Set Dark
			</button>
			<button onClick={() => setTheme('light')} data-testid="set-light">
				Set Light
			</button>
		</div>
	)
}

describe('Buzz UI Theme System', () => {
	beforeEach(() => {
		// Clear cookies and DOM state
		document.cookie = ''
		document.documentElement.className = ''
		document.documentElement.removeAttribute('data-theme')
	})

	it('should render with default light theme', () => {
		render(
			<ThemeProvider>
				<TestThemeComponent />
			</ThemeProvider>
		)

		expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
	})

	it('should allow custom default theme', () => {
		render(
			<ThemeProvider defaultTheme="dark">
				<TestThemeComponent />
			</ThemeProvider>
		)

		expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
	})

	it('should switch themes when setTheme is called', async () => {
		render(
			<ThemeProvider>
				<TestThemeComponent />
			</ThemeProvider>
		)

		expect(screen.getByTestId('current-theme')).toHaveTextContent('light')

		fireEvent.click(screen.getByTestId('set-dark'))

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
		})
	})

	it('should apply theme classes and data attributes to document', async () => {
		render(
			<ThemeProvider>
				<TestThemeComponent />
			</ThemeProvider>
		)

		fireEvent.click(screen.getByTestId('set-dark'))

		await waitFor(() => {
			expect(document.documentElement.classList.contains('dark')).toBe(true)
			expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
		})
	})

	it('should persist theme in cookies', async () => {
		render(
			<ThemeProvider>
				<TestThemeComponent />
			</ThemeProvider>
		)

		fireEvent.click(screen.getByTestId('set-dark'))

		await waitFor(() => {
			expect(document.cookie).toContain('theme=dark')
		})
	})

	it('should support custom theme configurations', () => {
		const customThemes = [
			{ value: 'light', label: 'Light', icon: () => <div>Sun</div> },
			{ value: 'dark', label: 'Dark', icon: () => <div>Moon</div> },
			{ value: 'purple', label: 'Purple', icon: () => <div>Star</div> },
		]

		render(
			<ThemeProvider themes={customThemes}>
				<TestThemeComponent />
			</ThemeProvider>
		)

		expect(screen.getByTestId('available-themes')).toHaveTextContent('3')
	})

	it('should throw error when useTheme is used outside provider', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		
		expect(() => {
			render(<TestThemeComponent />)
		}).toThrow('useTheme must be used within a ThemeProvider')

		consoleSpy.mockRestore()
	})
})

describe('Design tokens (parsed from the shipped stylesheet)', () => {
	const css = readFileSync(join(__dirname, '../src/styles/buzz.css'), 'utf8')

	const themeBlock = (name: string) => {
		const match = css.match(new RegExp(`html\\[data-theme='${name}'\\][^{]*\\{([^}]*)\\}`))
		expect(match, `theme block for '${name}'`).toBeTruthy()
		return match![1]
	}

	const CORE_TOKENS = [
		'--c-background',
		'--c-text',
		'--c-text-secondary',
		'--c-text-muted',
		'--c-surface',
		'--c-surface-2',
		'--c-surface-3',
		'--c-border',
		'--c-border-strong',
		'--c-hover',
		'--c-active',
		'--c-primary',
		'--c-primary-hover',
		'--c-primary-light',
		'--c-on-primary',
		'--c-primary-ring',
		'--c-success',
		'--c-success-light',
		'--c-warning',
		'--c-warning-light',
		'--c-danger',
		'--c-danger-light',
		'--c-info',
		'--c-info-light',
	]

	it.each(['light', 'dark', 'midnight', 'forest', 'ocean', 'umbro'])(
		"defines every core token for the '%s' theme",
		theme => {
			const block = themeBlock(theme)
			for (const token of CORE_TOKENS) {
				expect(block, `${theme} must define ${token}`).toContain(`${token}:`)
			}
		}
	)

	it('defines the radius and shadow scales at :root', () => {
		for (const token of ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl']) {
			expect(css).toContain(`${token}:`)
		}
	})

	it('keeps THEME_PRESETS core values in sync with the stylesheet', () => {
		const KEY_TO_VAR: Record<string, string> = {
			text: '--c-text',
			background: '--c-background',
			surface: '--c-surface',
			border: '--c-border',
			primary: '--c-primary',
			success: '--c-success',
			danger: '--c-danger',
			info: '--c-info',
		}
		for (const [themeName, preset] of Object.entries(THEME_PRESETS)) {
			const block = themeBlock(themeName)
			for (const [key, cssVar] of Object.entries(KEY_TO_VAR)) {
				const cssValue = block.match(new RegExp(`${cssVar}:\\s*([^;]+);`))?.[1].trim()
				const presetValue = (preset.colors as Record<string, string>)[key]
				expect(presetValue, `${themeName}.${key} should match ${cssVar}`).toBe(cssValue)
			}
		}
	})
})
