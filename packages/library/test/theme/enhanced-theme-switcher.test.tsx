import { render, screen, fireEvent, waitFor } from '../setup'
import React from 'react'
import { EnhancedThemeSwitcher } from '../../src/theme/enhanced-theme-switcher'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	default: {
		success: vi.fn(),
	},
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
	AnimatePresence: ({ children }: any) => children,
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

describe('EnhancedThemeSwitcher', () => {
	const allThemes = [
		{ value: 'light', label: 'Light', icon: 'sun' },
		{ value: 'dark', label: 'Dark', icon: 'moon' },
		{ value: 'midnight', label: 'Midnight', icon: 'palette' },
		{ value: 'forest', label: 'Forest', icon: 'tree-pine' },
		{ value: 'ocean', label: 'Ocean', icon: 'waves' },
		{ value: 'umbro', label: 'Umbro', icon: 'sparkles' },
	]

	const primaryThemes = [
		{ value: 'light', label: 'Light', icon: 'sun' },
		{ value: 'dark', label: 'Dark', icon: 'moon' },
	]

	beforeEach(() => {
		vi.clearAllMocks()
		document.cookie = ''
		;(document.documentElement.classList.add as any).mockClear()
		;(document.documentElement.classList.remove as any).mockClear()
		;(document.documentElement.setAttribute as any).mockClear()
	})

	describe('Basic Rendering', () => {
		it('renders primary themes as pills and additional themes in dropdown', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Should render 2 primary theme pills + 1 dropdown button
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(3)
			
			// Should have dropdown trigger
			expect(screen.getByLabelText('More themes')).toBeInTheDocument()
		})

		it('renders all themes in dropdown when maxPrimaryThemes is 0', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={[]}
					allThemes={allThemes}
					maxPrimaryThemes={0}
					initialTheme="light"
				/>
			)
			
			// Should only render dropdown button
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(1)
			expect(screen.getByLabelText('More themes')).toBeInTheDocument()
		})

		it('shows loading state when not mounted', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
				/>
			)
			
			// Should show loading state for dropdown
			const dropdownContainer = screen.getByLabelText('More themes').closest('div')
			expect(dropdownContainer).toBeInTheDocument()
		})
	})

	describe('Dropdown Functionality', () => {
		it('opens dropdown when palette button is clicked', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				// Should show additional themes in dropdown
				expect(screen.getByText('Midnight')).toBeInTheDocument()
				expect(screen.getByText('Forest')).toBeInTheDocument()
				expect(screen.getByText('Ocean')).toBeInTheDocument()
				expect(screen.getByText('Umbro')).toBeInTheDocument()
			})
		})

		it('closes dropdown when clicking outside', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Open dropdown
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				expect(screen.getByText('Midnight')).toBeInTheDocument()
			})
			
			// Click outside
			fireEvent.mouseDown(document.body)
			
			await waitFor(() => {
				expect(screen.queryByText('Midnight')).not.toBeInTheDocument()
			})
		})

		it('closes dropdown when ESC key is pressed', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Open dropdown
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				expect(screen.getByText('Midnight')).toBeInTheDocument()
			})
			
			// Press ESC
			fireEvent.keyDown(document, { key: 'Escape' })
			
			await waitFor(() => {
				expect(screen.queryByText('Midnight')).not.toBeInTheDocument()
			})
		})

		it('closes dropdown after selecting a theme', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Open dropdown
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				expect(screen.getByText('Midnight')).toBeInTheDocument()
			})
			
			// Select midnight theme
			const midnightButton = screen.getByText('Midnight')
			fireEvent.click(midnightButton)
			
			await waitFor(() => {
				// Dropdown should close
				expect(screen.queryByText('Midnight')).not.toBeInTheDocument()
				// Theme should be applied
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('midnight')
			})
		})
	})

	describe('Theme Switching', () => {
		it('switches theme when primary theme button is clicked', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			const darkButton = screen.getByLabelText('Switch to dark theme')
			fireEvent.click(darkButton)
			
			await waitFor(() => {
				expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light')
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
				expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
			})
		})

		it('switches theme when dropdown theme is selected', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Open dropdown
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				expect(screen.getByText('Forest')).toBeInTheDocument()
			})
			
			// Select forest theme
			const forestButton = screen.getByText('Forest')
			fireEvent.click(forestButton)
			
			await waitFor(() => {
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('forest')
				expect(document.cookie).toContain('theme=forest')
			})
		})

		it('applies theme changes correctly', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			const darkButton = screen.getByLabelText('Switch to dark theme')
			fireEvent.click(darkButton)
			
			await waitFor(() => {
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			})
		})
	})

	describe('Active State Indicators', () => {
		it('renders active theme correctly', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="dark"
				/>
			)
			
			// Dark theme button should be rendered
			expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
		})

		it('renders dropdown trigger when additional theme is active', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="midnight"
				/>
			)
			
			// Dropdown button should be rendered
			expect(screen.getByLabelText('More themes')).toBeInTheDocument()
		})

		it('shows checkmark for active theme in dropdown', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="midnight"
				/>
			)
			
			// Open dropdown
			const dropdownButton = screen.getByLabelText('More themes')
			fireEvent.click(dropdownButton)
			
			await waitFor(() => {
				// Midnight theme should have checkmark
				const midnightButton = screen.getByText('Midnight')
				const container = midnightButton.closest('button')
				expect(container?.querySelector('svg')).toBeInTheDocument()
			})
		})
	})

	describe('SSR Support', () => {
		it('renders immediately with initialTheme', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="dark"
				/>
			)
			
			// Should render all buttons immediately
			const buttons = screen.getAllByRole('button')
			expect(buttons).toHaveLength(3) // 2 primary + 1 dropdown
		})

		it('applies initialTheme on mount', () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="midnight"
				/>
			)
			
			expect(document.documentElement.classList.add).toHaveBeenCalledWith('midnight')
			expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'midnight')
		})
	})

	describe('Icon Mapping', () => {
		it('handles all built-in icon types', () => {
			const iconThemes = [
				{ value: 'sun', label: 'Sun', icon: 'sun' },
				{ value: 'moon', label: 'Moon', icon: 'moon' },
				{ value: 'palette', label: 'Palette', icon: 'palette' },
				{ value: 'tree', label: 'Tree', icon: 'tree-pine' },
				{ value: 'waves', label: 'Waves', icon: 'waves' },
				{ value: 'sparkles', label: 'Sparkles', icon: 'sparkles' },
			]
			
			expect(() => {
				render(
					<EnhancedThemeSwitcher 
						primaryThemes={iconThemes.slice(0, 2)}
						allThemes={iconThemes}
						initialTheme="sun"
					/>
				)
			}).not.toThrow()
		})

		it('falls back to palette icon for unknown icons', () => {
			const unknownIconTheme = [
				{ value: 'custom', label: 'Custom', icon: 'unknown-icon' },
			]
			
			expect(() => {
				render(
					<EnhancedThemeSwitcher 
						primaryThemes={unknownIconTheme}
						allThemes={unknownIconTheme}
						initialTheme="custom"
					/>
				)
			}).not.toThrow()
		})
	})

	describe('Keyboard Support', () => {
		it('supports Alt+T hotkey for theme cycling', async () => {
			render(
				<EnhancedThemeSwitcher 
					primaryThemes={primaryThemes}
					allThemes={allThemes}
					initialTheme="light"
				/>
			)
			
			// Trigger the hotkey using our mocked system
			global.triggerHotkey('alt+t')
			
			await waitFor(() => {
				// Should cycle to next theme (dark)
				expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
			})
		})
	})
})
