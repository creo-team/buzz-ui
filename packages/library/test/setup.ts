import '@testing-library/jest-dom'

// jsdom doesn't implement scrollIntoView (a known limitation). Components
// that scroll a highlighted option into view (CommandPalette, Combobox) call
// it unconditionally when the active item changes, so stub it globally
// rather than mocking it per test.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = function scrollIntoView() {}
}

// jsdom doesn't implement window.isSecureContext. Browsers treat localhost and https pages as
// secure contexts, which is where the Clipboard API exists, so model that; tests that need an
// insecure context override it.
if (typeof window !== 'undefined' && !('isSecureContext' in window)) {
	Object.defineProperty(window, 'isSecureContext', { configurable: true, writable: true, value: true })
}
