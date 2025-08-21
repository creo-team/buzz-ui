"use client"

import { useState, useEffect } from 'react'

/**
 * Hook for managing modal state via query parameters
 * Provides SSR-safe modal state management with URL persistence
 * 
 * @param modalKey - The query parameter value to identify this modal
 * @returns Object with isOpen state and open/close functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const settingsModal = useModalQuery('settings')
 *   
 *   return (
 *     <>
 *       <Button onClick={settingsModal.open}>Open Settings</Button>
 *       <Modal isOpen={settingsModal.isOpen} onClose={settingsModal.close}>
 *         Settings content
 *       </Modal>
 *     </>
 *   )
 * }
 * ```
 */
export function useModalQuery(modalKey: string) {
	const [isClient, setIsClient] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() => {
		setIsClient(true)
		setSearch(window.location.search)

		const onPopState = () => setSearch(window.location.search)
		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])

	const isOpen = isClient && new URLSearchParams(search).get('modal') === modalKey

	const open = () => {
		if (!isClient) return
		const params = new URLSearchParams(window.location.search)
		params.set('modal', modalKey)
		const nextUrl = `?${params.toString()}`
		window.history.pushState({}, '', nextUrl)
		setSearch(nextUrl)
	}

	const close = () => {
		if (!isClient) return
		const params = new URLSearchParams(window.location.search)
		params.delete('modal')
		const nextUrl = `?${params.toString()}`
		window.history.pushState({}, '', nextUrl)
		setSearch(nextUrl)
	}

	return { isOpen, open, close }
}

/**
 * Hook for managing multiple modals via query parameters
 * Allows only one modal to be open at a time
 * 
 * @param modalKeys - Array of modal identifiers
 * @returns Object with current modal state and management functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const modals = useModals(['settings', 'create', 'edit'])
 *   
 *   return (
 *     <>
 *       <Button onClick={() => modals.open('settings')}>Settings</Button>
 *       <Button onClick={() => modals.open('create')}>Create</Button>
 *       
 *       <Modal isOpen={modals.isOpen('settings')} onClose={modals.close}>
 *         Settings
 *       </Modal>
 *       <Modal isOpen={modals.isOpen('create')} onClose={modals.close}>
 *         Create form
 *       </Modal>
 *     </>
 *   )
 * }
 * ```
 */
export function useModals(modalKeys: string[] = []) {
	const [isClient, setIsClient] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() => {
		setIsClient(true)
		setSearch(window.location.search)

		const onPopState = () => setSearch(window.location.search)
		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])

	const currentModal = isClient ? new URLSearchParams(search).get('modal') : null

	const open = (modalKey: string) => {
		if (!isClient) return
		const params = new URLSearchParams(window.location.search)
		params.set('modal', modalKey)
		const nextUrl = `?${params.toString()}`
		window.history.pushState({}, '', nextUrl)
		setSearch(nextUrl)
	}

	const close = () => {
		if (!isClient) return
		const params = new URLSearchParams(window.location.search)
		params.delete('modal')
		const nextUrl = `?${params.toString()}`
		window.history.pushState({}, '', nextUrl)
		setSearch(nextUrl)
	}

	const isOpen = (modalKey: string) => currentModal === modalKey

	return {
		currentModal,
		open,
		close,
		isOpen,
		availableModals: modalKeys
	}
}
