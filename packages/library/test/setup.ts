import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Re-export testing utilities from @testing-library/react
export { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock react-hotkeys-hook
vi.mock('react-hotkeys-hook', () => ({
	useHotkeys: vi.fn((key, callback, options) => {
		// Store the callback and options for testing
		if (!global.__hotkeyCallbacks) {
			global.__hotkeyCallbacks = new Map()
		}
		global.__hotkeyCallbacks.set(key, { callback, options })
	}),
}))

// Mock document.documentElement methods that theme switchers use
const classListMock = {
	add: vi.fn(),
	remove: vi.fn(),
	contains: vi.fn().mockReturnValue(false),
	toggle: vi.fn(),
	item: vi.fn(),
	length: 0,
	[Symbol.iterator]: function* () {
		yield* []
	},
}

Object.defineProperty(document.documentElement, 'classList', {
	value: classListMock,
	writable: true,
})

// Mock getAttribute and setAttribute with proper storage
const documentAttributes = new Map<string, string>()
Object.defineProperty(document.documentElement, 'setAttribute', {
	value: vi.fn((name: string, value: string) => {
		documentAttributes.set(name, value)
	}),
	writable: true,
})

Object.defineProperty(document.documentElement, 'getAttribute', {
	value: vi.fn((name: string) => {
		return documentAttributes.get(name) || null
	}),
	writable: true,
})

// Mock cookie API
Object.defineProperty(document, 'cookie', {
	value: '',
	writable: true,
})

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
	writable: true,
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))

// Helper function to trigger hotkeys in tests
global.triggerHotkey = (key: string) => {
	if (global.__hotkeyCallbacks && global.__hotkeyCallbacks.has(key)) {
		const { callback, options } = global.__hotkeyCallbacks.get(key)!
		
		// Check if hotkey is enabled
		if (options && options.enabled === false) {
			return // Don't trigger disabled hotkeys
		}
		
		const mockEvent = { preventDefault: vi.fn() }
		callback(mockEvent)
	}
}

// Helper function to set class state for testing
global.setClassState = (className: string, hasClass: boolean) => {
	classListMock.contains.mockImplementation((cls: string) => {
		if (cls === className) return hasClass
		return false
	})
}

// Helper function to set attribute for testing
global.setAttribute = (name: string, value: string) => {
	documentAttributes.set(name, value)
}
