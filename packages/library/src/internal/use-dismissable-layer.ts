"use client"
import * as React from 'react'

/**
 * Global overlay layer stack. Nested overlays (a menu inside a modal, a
 * command palette above a drawer) register here so Escape and outside-clicks
 * dismiss only the topmost layer — matching platform behavior.
 */
interface Layer {
	id: number
	refs: React.RefObject<Element | null>[]
	onDismiss: () => void
	/** When false, pointer events outside never dismiss (e.g. toasts). */
	outsidePress: boolean
	/** When false, Escape never dismisses this layer. */
	escapeKey: boolean
}

const layers: Layer[] = []
let nextId = 0
let listenersAttached = false

function topLayer(): Layer | undefined {
	return layers[layers.length - 1]
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape') return
	const layer = topLayer()
	if (!layer || !layer.escapeKey) return
	event.preventDefault()
	event.stopPropagation()
	layer.onDismiss()
}

let lastPointerDownAt = 0

function handleOutsidePress(event: PointerEvent | MouseEvent) {
	const layer = topLayer()
	if (!layer || !layer.outsidePress) return
	// Branches (e.g. the toast viewport) float above every layer without
	// belonging to any — pressing them dismisses nothing.
	const target = event.target as Element | null
	if (target?.closest?.('[data-bz-layer-branch]')) return
	const path = event.composedPath()
	const inside = layer.refs.some(ref => {
		const el = ref.current
		return el != null && (path.includes(el) || el.contains(event.target as Node))
	})
	if (!inside) layer.onDismiss()
}

function handlePointerDown(event: PointerEvent) {
	lastPointerDownAt = Date.now()
	handleOutsidePress(event)
}

function handleMouseDown(event: MouseEvent) {
	// In pointer-event browsers a mousedown follows the pointerdown we already
	// handled; only act when no pointer event preceded it (older browsers,
	// synthetic events, jsdom).
	if (Date.now() - lastPointerDownAt < 100) return
	handleOutsidePress(event)
}

function attachListeners() {
	if (listenersAttached || typeof document === 'undefined') return
	// Capture phase so dismissal wins over stopPropagation in app code.
	document.addEventListener('keydown', handleKeydown, true)
	document.addEventListener('pointerdown', handlePointerDown, true)
	document.addEventListener('mousedown', handleMouseDown, true)
	listenersAttached = true
}

function detachListenersIfIdle() {
	if (!listenersAttached || layers.length > 0) return
	document.removeEventListener('keydown', handleKeydown, true)
	document.removeEventListener('pointerdown', handlePointerDown, true)
	document.removeEventListener('mousedown', handleMouseDown, true)
	listenersAttached = false
}

export interface DismissableLayerOptions {
	enabled: boolean
	onDismiss: () => void
	/** Elements considered "inside" the layer (content, trigger, arrow…). */
	refs: React.RefObject<Element | null>[]
	/** Dismiss when pressing outside. Default true. */
	outsidePress?: boolean
	/** Dismiss on Escape. Default true. */
	escapeKey?: boolean
}

export function useDismissableLayer({
	enabled,
	onDismiss,
	refs,
	outsidePress = true,
	escapeKey = true,
}: DismissableLayerOptions) {
	const onDismissRef = React.useRef(onDismiss)
	onDismissRef.current = onDismiss
	const refsRef = React.useRef(refs)
	refsRef.current = refs

	React.useEffect(() => {
		if (!enabled) return
		const layer: Layer = {
			id: nextId++,
			get refs() {
				return refsRef.current
			},
			onDismiss: () => onDismissRef.current(),
			outsidePress,
			escapeKey,
		}
		layers.push(layer)
		attachListeners()
		return () => {
			const index = layers.indexOf(layer)
			if (index !== -1) layers.splice(index, 1)
			detachListenersIfIdle()
		}
	}, [enabled, outsidePress, escapeKey])
}

/** Number of active overlay layers (used by scroll-lock coordination/tests). */
export function activeLayerCount(): number {
	return layers.length
}
