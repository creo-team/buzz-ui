import '@testing-library/jest-dom'

// jsdom doesn't implement scrollIntoView (a known limitation). Components
// that scroll a highlighted option into view (CommandPalette, Combobox) call
// it unconditionally when the active item changes, so stub it globally
// rather than mocking it per test.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = function scrollIntoView() {}
}
