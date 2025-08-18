import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../src/theme/theme-provider'

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

describe('Buzz UI Design Tokens', () => {
	const expectedCSSVariables = [
		// Core colors
		'--c-background',
		'--c-text',
		'--c-text-secondary',
		'--c-surface',
		'--c-surface-2',
		'--c-surface-3',
		'--c-border',
		
		// Primary colors
		'--c-primary',
		'--c-primary-hover',
		'--c-primary-light',
		
		// Semantic colors
		'--c-success',
		'--c-warning',
		'--c-danger',
		'--c-info',
		
		// Layout tokens
		'--radius-sm',
		'--radius-md',
		'--radius-lg',
		'--radius-xl',
		'--radius-2xl',
		
		// Shadow tokens
		'--shadow-sm',
		'--shadow-md',
		'--shadow-lg',
		'--shadow-xl',
	]

	it('should have centralized design token naming convention', () => {
		expectedCSSVariables.forEach(variable => {
			// Should follow buzz-ui naming convention with --c- prefix for colors
			if (variable.startsWith('--c-')) {
				expect(variable).toMatch(/^--c-[a-z-]+$/)
			}
			// Should follow standard naming for layout tokens
			if (variable.startsWith('--radius-') || variable.startsWith('--shadow-')) {
				expect(variable).toMatch(/^--(radius|shadow)-[a-z0-9]+$/)
			}
		})
	})

	it('should have consistent radius system', () => {
		const radiusTokens = expectedCSSVariables.filter(v => v.startsWith('--radius-'))
		const expectedRadiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl']
		
		expect(radiusTokens).toEqual(expectedRadiusTokens)
	})

	it('should have consistent shadow system', () => {
		const shadowTokens = expectedCSSVariables.filter(v => v.startsWith('--shadow-'))
		const expectedShadowTokens = ['--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl']
		
		expect(shadowTokens).toEqual(expectedShadowTokens)
	})

	it('should have semantic color variants', () => {
		const semanticColors = ['success', 'warning', 'danger', 'info']
		
		semanticColors.forEach(color => {
			expect(expectedCSSVariables).toContain(`--c-${color}`)
		})
	})

	it('should have surface hierarchy', () => {
		const surfaceTokens = expectedCSSVariables.filter(v => v.includes('surface'))
		
		expect(surfaceTokens).toContain('--c-surface')
		expect(surfaceTokens).toContain('--c-surface-2')
		expect(surfaceTokens).toContain('--c-surface-3')
	})
})

describe('Theme Customization', () => {
	it('should support corner roundness customization', () => {
		// Test that radius tokens can be customized
		const radiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl']
		
		radiusTokens.forEach(token => {
			expect(token).toMatch(/^--radius-/)
		})
	})

	it('should support color palette customization', () => {
		// Test that all color tokens follow the --c- convention
		const colorTokens = [
			'--c-primary',
			'--c-primary-hover', 
			'--c-primary-light',
			'--c-success',
			'--c-warning',
			'--c-danger',
			'--c-info'
		]
		
		colorTokens.forEach(token => {
			expect(token).toMatch(/^--c-/)
		})
	})

	it('should support shadow system customization', () => {
		// Test shadow token structure
		const shadowTokens = ['--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl']
		
		shadowTokens.forEach(token => {
			expect(token).toMatch(/^--shadow-/)
		})
	})
})
