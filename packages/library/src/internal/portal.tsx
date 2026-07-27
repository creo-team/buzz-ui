"use client"
import * as React from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
	children: React.ReactNode
	/** Custom container. Defaults to `document.body`. */
	container?: Element | null
}

/**
 * SSR-safe portal: renders nothing on the server and during the first client
 * render, then portals into `container` (or `document.body`). This avoids
 * touching `document` during server rendering and prevents hydration
 * mismatches for overlay content.
 */
export function Portal({ children, container }: PortalProps) {
	const [mounted, setMounted] = React.useState(false)
	React.useEffect(() => setMounted(true), [])
	if (!mounted) return null
	return createPortal(children, container ?? document.body)
}
