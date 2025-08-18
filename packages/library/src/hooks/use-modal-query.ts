"use client"

import { useSearchParams, useRouter } from 'next/navigation'
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
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isClient, setIsClient] = useState(false)

	// Prevent SSR issues by only accessing query params on client
	useEffect(() => {
		setIsClient(true)
	}, [])

	const isOpen = isClient && searchParams.get('modal') === modalKey

	const open = () => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.set('modal', modalKey)
		router.push(`?${params.toString()}`)
	}

	const close = () => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.delete('modal')
		router.push(`?${params.toString()}`)
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
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	const currentModal = isClient ? searchParams.get('modal') : null

	const open = (modalKey: string) => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.set('modal', modalKey)
		router.push(`?${params.toString()}`)
	}

	const close = () => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.delete('modal')
		router.push(`?${params.toString()}`)
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
