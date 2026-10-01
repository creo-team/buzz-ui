/** Delay between clearing and setting the text, so a new region is registered and a repeat re-announces. */
const ANNOUNCE_DELAY_MS = 100

/**
 * Inside an `aria-modal` dialog VoiceOver ignores content outside it, so the region must live inside.
 * Includes `alertdialog`, which buzz-ui's Modal renders for destructive confirmations.
 */
const MODAL_CONTAINER_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog[open]'
const ANNOUNCER_ATTRIBUTE = 'data-bz-announcer'

const pendingAnnouncements = new WeakMap<Element, ReturnType<typeof setTimeout>>()

function getAnnouncerRegion(container: Element): Element {
	for (const child of Array.from(container.children)) {
		if (child.hasAttribute(ANNOUNCER_ATTRIBUTE)) return child
	}
	const region = document.createElement('div')
	region.className = 'bz-visually-hidden'
	region.setAttribute('role', 'status')
	region.setAttribute('aria-live', 'polite')
	region.setAttribute('aria-atomic', 'true')
	region.setAttribute(ANNOUNCER_ATTRIBUTE, '')
	container.appendChild(region)
	return region
}

/**
 * Announces a message through one polite status region per container: the nearest modal dialog
 * around `origin`, else `document.body`. Looks the region up before creating it, so rows and
 * StrictMode remounts never add a second one.
 */
export function announcePolite(message: string, origin: Element | null): void {
	if (typeof document === 'undefined') return
	const container = origin?.closest(MODAL_CONTAINER_SELECTOR) ?? document.body
	const region = getAnnouncerRegion(container)
	const pending = pendingAnnouncements.get(region)
	if (pending !== undefined) clearTimeout(pending)
	region.textContent = ''
	pendingAnnouncements.set(
		region,
		setTimeout(() => {
			pendingAnnouncements.delete(region)
			region.textContent = message
		}, ANNOUNCE_DELAY_MS)
	)
}
