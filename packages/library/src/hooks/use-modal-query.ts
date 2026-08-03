"use client"

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Shared URL-search store so every hook instance stays in sync: history
 * navigation (popstate) and programmatic open/close both notify all
 * subscribers — opening modal B closes modal A everywhere.
 */
const SYNC_EVENT = 'bz:modal-query'
const listeners = new Set<() => void>()
let attached = false

function notifyAll() {
	for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
	listeners.add(listener)
	if (!attached && typeof window !== 'undefined') {
		window.addEventListener('popstate', notifyAll)
		window.addEventListener(SYNC_EVENT, notifyAll)
		attached = true
	}
	return () => {
		listeners.delete(listener)
		if (listeners.size === 0 && attached) {
			window.removeEventListener('popstate', notifyAll)
			window.removeEventListener(SYNC_EVENT, notifyAll)
			attached = false
		}
	}
}

function getCurrentModal(): string | null {
	return new URLSearchParams(window.location.search).get('modal')
}

function getServerModal(): null {
	return null
}

function setModalParam(modalKey: string | null) {
	const params = new URLSearchParams(window.location.search)
	if (modalKey == null) params.delete('modal')
	else params.set('modal', modalKey)
	const query = params.toString()
	window.history.pushState({}, '', query ? `?${query}` : window.location.pathname)
	window.dispatchEvent(new Event(SYNC_EVENT))
}

/**
 * Modal state persisted in the `?modal=` query parameter — shareable URLs,
 * back-button closes the modal, SSR-safe (closed on the server render).
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const settings = useModalQuery('settings')
 *   return (
 *     <>
 *       <Button onClick={settings.open}>Open Settings</Button>
 *       <Modal open={settings.isOpen} onClose={settings.close}>
 *         Settings content
 *       </Modal>
 *     </>
 *   )
 * }
 * ```
 */
export function useModalQuery(modalKey: string) {
	const currentModal = useSyncExternalStore(subscribe, getCurrentModal, getServerModal)

	const open = useCallback(() => setModalParam(modalKey), [modalKey])
	const close = useCallback(() => setModalParam(null), [])

	return { isOpen: currentModal === modalKey, open, close }
}

/**
 * Manage multiple query-parameter modals — only one can be open at a time.
 *
 * @example
 * ```tsx
 * const modals = useModals(['settings', 'create'])
 *
 * <Button onClick={() => modals.open('settings')}>Settings</Button>
 * <Modal open={modals.isOpen('settings')} onClose={modals.close}>…</Modal>
 * <Modal open={modals.isOpen('create')} onClose={modals.close}>…</Modal>
 * ```
 */
export function useModals(modalKeys: string[] = []) {
	const currentModal = useSyncExternalStore(subscribe, getCurrentModal, getServerModal)

	const open = useCallback((modalKey: string) => setModalParam(modalKey), [])
	const close = useCallback(() => setModalParam(null), [])
	const isOpen = useCallback((modalKey: string) => currentModal === modalKey, [currentModal])

	return {
		currentModal,
		open,
		close,
		isOpen,
		availableModals: modalKeys,
	}
}
