import { getClientTheme } from '../../src/theme/theme-utils'

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

describe('Theme Utils', () => {
	beforeEach(() => {
		document.cookie = ''
	})

	describe('getClientTheme', () => {
		it('returns default theme when no cookie is set', () => {
			const theme = getClientTheme('light')
			expect(theme).toBe('light')
		})

		it('returns theme from cookie when set', () => {
			document.cookie = 'theme=dark; path=/'
			const theme = getClientTheme('light')
			expect(theme).toBe('dark')
		})

		it('returns default theme when cookie has different name', () => {
			document.cookie = 'other=dark; path=/'
			const theme = getClientTheme('light')
			expect(theme).toBe('light')
		})

		it('handles multiple cookies correctly', () => {
			document.cookie = 'session=abc123; theme=midnight; user=john'
			const theme = getClientTheme('light')
			expect(theme).toBe('midnight')
		})

		it('returns default theme when cookie is empty', () => {
			document.cookie = 'theme=; path=/'
			const theme = getClientTheme('light')
			expect(theme).toBe('light')
		})

		it('uses "light" as default when no default provided', () => {
			const theme = getClientTheme()
			expect(theme).toBe('light')
		})

		it('handles complex cookie values', () => {
			document.cookie = 'theme=custom-theme-name; path=/'
			const theme = getClientTheme('light')
			expect(theme).toBe('custom-theme-name')
		})
	})
})
