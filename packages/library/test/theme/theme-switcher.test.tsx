import { render, screen, fireEvent, waitFor } from '../setup'
import React from 'react'
import { ThemeSwitcher } from '../../src/theme/theme-switcher'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	default: {
		success: vi.fn(),
	},
}))

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
	value: {
		classList: {
			add: vi.fn(),
			remove: vi.fn(),
		},
		setAttribute: vi.fn(),
	},
	writable: true,
})

describe('ThemeSwitcher', () => {
	beforeEach(() => {
		// Clear mocks
		vi.clearAllMocks()
		document.cookie = ''
		;(document.documentElement.classList.add as any).mockClear()
		;(document.documentElement.classList.remove as any).mockClear()
		;(document.documentElement.setAttribute as any).mockClear()
	})

	describe('Basic Rendering', () => {
		it('renders with default light and dark themes', () => {
			render(<ThemeSwitcher />)
			
			// Should render two theme buttons (light and dark)
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(2)
			
			// Should have sun and moon icons (via aria-label)
			expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
			expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
		})

		it('renders with custom themes', () => {
			const customThemes = [
				{ value: 'light', label: 'Light', icon: 'sun' },
				{ value: 'dark', label: 'Dark', icon: 'moon' },
				{ value: 'midnight', label: 'Midnight', icon: 'palette' },
			]
			
			render(<ThemeSwitcher themes={customThemes} />)
			
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(3)
			expect(screen.getByLabelText('Switch to midnight theme')).toBeInTheDocument()
		})

		it('respects maxPrimaryThemes limit', () => {
			const manyThemes = [
				{ value: 'light', label: 'Light', icon: 'sun' },
				{ value: 'dark', label: 'Dark', icon: 'moon' },
				{ value: 'midnight', label: 'Midnight', icon: 'palette' },
				{ value: 'forest', label: 'Forest', icon: 'tree-pine' },
			]
			
			render(<ThemeSwitcher themes={manyThemes} />)
			
			// Should only render 3 themes (default max for ThemeSwitcher)
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(3)
		})
	})

	describe('SSR Support', () => {
		it('renders immediately when initialTheme is provided', () => {
			render(<ThemeSwitcher initialTheme="dark" />)
			
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(2)
			
			// Should not show loading state
			expect(screen.queryByText('Loading')).not.toBeInTheDocument()
		})

		it('applies initialTheme on mount', () => {
			render(<ThemeSwitcher initialTheme="dark" />)
			
			// Should apply the dark theme
			expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
		})

		it('reads from cookie when no initialTheme provided', async () => {
			document.cookie = 'theme=dark'
			
			render(<ThemeSwitcher />)
			
			await waitFor(() => {
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
				expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
			})
		})
	})

	describe('Theme Switching', () => {
		it('switches theme when button is clicked', async () => {
			render(<ThemeSwitcher initialTheme="light" />)
			
			const darkButton = screen.getByLabelText('Switch to dark theme')
			fireEvent.click(darkButton)
			
			await waitFor(() => {
				expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light')
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
				expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
			})
		})

		it('cycles to next theme when clicking current theme', async () => {
			render(<ThemeSwitcher initialTheme="light" />)
			
			const lightButton = screen.getByLabelText('Switch to light theme')
			fireEvent.click(lightButton)
			
			await waitFor(() => {
				// Should cycle to dark theme
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			})
		})

		it('saves theme to cookie', async () => {
			render(<ThemeSwitcher initialTheme="light" />)
			
			const darkButton = screen.getByLabelText('Switch to dark theme')
			fireEvent.click(darkButton)
			
			await waitFor(() => {
				expect(document.cookie).toContain('theme=dark')
			})
		})

		it('calls theme change handler', async () => {
			render(<ThemeSwitcher initialTheme="light" />)
			
			const darkButton = screen.getByLabelText('Switch to dark theme')
			fireEvent.click(darkButton)
			
			await waitFor(() => {
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			})
		})
	})

	describe('Icon Mapping', () => {
		it('maps string icons to components correctly', () => {
			const themes = [
				{ value: 'light', label: 'Light', icon: 'sun' },
				{ value: 'dark', label: 'Dark', icon: 'moon' },
				{ value: 'midnight', label: 'Midnight', icon: 'palette' },
			]
			
			render(<ThemeSwitcher themes={themes} initialTheme="light" />)
			
			// All buttons should render without errors
			expect(screen.getAllByRole('button')).toHaveLength(3)
		})

		it('handles unknown icon strings gracefully', () => {
			const themes = [
				{ value: 'custom', label: 'Custom', icon: 'unknown-icon' },
			]
			
			// Should not throw error
			expect(() => {
				render(<ThemeSwitcher themes={themes} initialTheme="custom" />)
			}).not.toThrow()
		})
	})

	describe('Accessibility', () => {
		it('has proper ARIA labels', () => {
			render(<ThemeSwitcher />)
			
			expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
			expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
		})

		it('renders active theme correctly', () => {
			render(<ThemeSwitcher initialTheme="dark" />)
			
			// Should render the dark theme button
			expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
		})

		it('renders loading state when no initialTheme', () => {
			render(<ThemeSwitcher />) // No initialTheme
			
			// Should still render buttons (just not interactive until mounted)
			const buttons = screen.getAllByRole('button')
			expect(buttons.length).toBeGreaterThan(0)
		})
	})

	describe('Keyboard Support', () => {
		it('supports Alt+T hotkey for theme cycling', async () => {
			render(<ThemeSwitcher initialTheme="light" />)
			
			// Trigger the hotkey using our mocked system
			global.triggerHotkey('alt+t')
			
			await waitFor(() => {
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			})
		})
	})
})
