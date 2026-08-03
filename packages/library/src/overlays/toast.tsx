"use client"
import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { IconSuccess, IconDanger, IconInfo, IconWarning, IconX } from '../internal/icons.js'
import { Spinner } from '../primitives/spinner.js'

/**
 * Buzz UI toasts — a zero-dependency notification system.
 *
 * Imperative API (usable anywhere, including outside React):
 *   toast('Saved')
 *   toast.success('Profile updated', { description: 'Changes are live.' })
 *   toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Failed' })
 *
 * Rendering: mount a single `<Toaster />` near the app root.
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'

export interface ToastOptions {
	/** Reuse an id to update an existing toast in place. */
	id?: string
	/** Milliseconds before auto-dismiss. `Infinity` to persist. */
	duration?: number
	/** Secondary line under the message. */
	description?: React.ReactNode
	/** Replaces the variant icon. Pass `null` to hide the icon. */
	icon?: React.ReactNode
	/** Action button rendered inside the toast. */
	action?: { label: React.ReactNode; onClick: () => void }
	/** Per-toast position override (defaults to the Toaster's position). */
	position?: ToastPosition
	className?: string
	style?: React.CSSProperties
	/** Show a close button. Default true for persistent toasts. */
	dismissible?: boolean
}

export interface ToastItem extends ToastOptions {
	id: string
	message: React.ReactNode
	variant: ToastVariant
	duration: number
	/** false while the exit animation plays. */
	open: boolean
	/** Bumped when a toast is updated in place so timers reschedule. */
	revision: number
}

const DEFAULT_DURATION = 4000
const EXIT_DURATION = 200

let counter = 0
const items = new Map<string, ToastItem>()
const listeners = new Set<() => void>()
let snapshot: ToastItem[] = []
const removeTimers = new Map<string, ReturnType<typeof setTimeout>>()

function emit() {
	snapshot = Array.from(items.values())
	for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

const EMPTY: ToastItem[] = []
function getSnapshot() {
	return snapshot
}
function getServerSnapshot() {
	return EMPTY
}

function addToast(message: React.ReactNode, variant: ToastVariant, options: ToastOptions = {}): string {
	const id = options.id ?? `bz-toast-${++counter}`
	const existing = items.get(id)
	const pendingRemove = removeTimers.get(id)
	if (pendingRemove) {
		clearTimeout(pendingRemove)
		removeTimers.delete(id)
	}
	// Same-variant updates keep their configured duration (a persistent toast
	// stays persistent); variant changes (loading → success) reset it so
	// promise flows never inherit Infinity.
	const duration =
		options.duration ??
		(variant === 'loading'
			? Infinity
			: existing && existing.variant === variant
				? existing.duration
				: DEFAULT_DURATION)
	items.delete(id) // re-insert so updated toasts move to the end
	items.set(id, {
		...existing,
		...options,
		id,
		message,
		variant,
		duration,
		open: true,
		revision: (existing?.revision ?? 0) + 1,
	})
	emit()
	return id
}

function dismissToast(id?: string) {
	const targets = id ? [items.get(id)].filter(Boolean) as ToastItem[] : Array.from(items.values())
	for (const item of targets) {
		if (!item.open) continue
		items.set(item.id, { ...item, open: false })
		const timer = setTimeout(() => {
			items.delete(item.id)
			removeTimers.delete(item.id)
			emit()
		}, EXIT_DURATION)
		removeTimers.set(item.id, timer)
	}
	emit()
}

export interface ToastPromiseMessages<T> {
	loading: React.ReactNode
	success: React.ReactNode | ((value: T) => React.ReactNode)
	error: React.ReactNode | ((error: unknown) => React.ReactNode)
}

interface ToastFunction {
	(message: React.ReactNode, options?: ToastOptions): string
	success: (message: React.ReactNode, options?: ToastOptions) => string
	error: (message: React.ReactNode, options?: ToastOptions) => string
	warning: (message: React.ReactNode, options?: ToastOptions) => string
	info: (message: React.ReactNode, options?: ToastOptions) => string
	loading: (message: React.ReactNode, options?: ToastOptions) => string
	/** Track a promise: loading → success/error. Returns the same promise. */
	promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options?: ToastOptions) => Promise<T>
	dismiss: (id?: string) => void
}

export const toast: ToastFunction = Object.assign(
	(message: React.ReactNode, options?: ToastOptions) => addToast(message, 'default', options),
	{
		success: (message: React.ReactNode, options?: ToastOptions) => addToast(message, 'success', options),
		error: (message: React.ReactNode, options?: ToastOptions) => addToast(message, 'error', options),
		warning: (message: React.ReactNode, options?: ToastOptions) => addToast(message, 'warning', options),
		info: (message: React.ReactNode, options?: ToastOptions) => addToast(message, 'info', options),
		loading: (message: React.ReactNode, options?: ToastOptions) => addToast(message, 'loading', options),
		promise: <T,>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options?: ToastOptions) => {
			const id = addToast(messages.loading, 'loading', options)
			promise
				.then(value => {
					const message =
						typeof messages.success === 'function' ? messages.success(value) : messages.success
					addToast(message, 'success', { ...options, id })
				})
				.catch(error => {
					const message = typeof messages.error === 'function' ? messages.error(error) : messages.error
					addToast(message, 'error', { ...options, id })
				})
			return promise
		},
		dismiss: dismissToast,
	}
)

/**
 * Subscribe to the toast store. Also provides the imperative API — and the
 * legacy `push`/`remove` aliases from the old context-based ToastProvider.
 */
export function useToast() {
	const toasts = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
	return React.useMemo(
		() => ({
			toasts,
			toast,
			dismiss: dismissToast,
			/** @deprecated use `toast(message)` */
			push: (message: React.ReactNode) => toast(message),
			/** @deprecated use `dismiss(id)` */
			remove: (id: string | number) => dismissToast(String(id)),
		}),
		[toasts]
	)
}

const VARIANT_ICONS: Record<ToastVariant, React.ReactNode> = {
	default: null,
	success: <IconSuccess className="bz-toast__variant-icon" />,
	error: <IconDanger className="bz-toast__variant-icon" />,
	warning: <IconWarning className="bz-toast__variant-icon" />,
	info: <IconInfo className="bz-toast__variant-icon" />,
	loading: <Spinner size="sm" />,
}

export interface ToasterProps {
	/** Default position for toasts. Default 'bottom-right'. */
	position?: ToastPosition
	/** Cap on simultaneously visible toasts per position. Default 5. */
	maxVisible?: number
	/** Gap container offset from the viewport edges, in px. Default 16. */
	offset?: number
	className?: string
}

/** Renders toasts. Mount once near the root of the app. */
export function Toaster({ position = 'bottom-right', maxVisible = 5, offset = 16, className }: ToasterProps) {
	const toasts = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
	const timers = React.useRef(
		new Map<string, { timeout: ReturnType<typeof setTimeout>; endAt: number; remaining: number; revision: number }>()
	)
	// Hover and keyboard focus pause independently; either suspends timers.
	const [hoverPaused, setHoverPaused] = React.useState(false)
	const [focusPaused, setFocusPaused] = React.useState(false)
	const paused = hoverPaused || focusPaused

	// Auto-dismiss scheduling. Keyed by id + revision so in-place updates
	// (e.g. loading → success, or a new duration) reschedule correctly.
	React.useEffect(() => {
		const active = timers.current
		for (const [id, entry] of active) {
			const item = toasts.find(t => t.id === id)
			if (!item || !item.open || item.revision !== entry.revision) {
				clearTimeout(entry.timeout)
				active.delete(id)
			}
		}
		if (!paused) {
			for (const item of toasts) {
				if (!item.open || !Number.isFinite(item.duration)) continue
				if (active.has(item.id)) continue
				const timeout = setTimeout(() => {
					active.delete(item.id)
					dismissToast(item.id)
				}, item.duration)
				active.set(item.id, {
					timeout,
					endAt: Date.now() + item.duration,
					remaining: item.duration,
					revision: item.revision,
				})
			}
		}
	}, [toasts, paused])

	// Suspend/restart timers exactly once per paused transition — repeated
	// pause events (hover + focus overlapping) must not erode remaining time.
	const pausedRef = React.useRef(false)
	React.useEffect(() => {
		if (pausedRef.current === paused) return
		pausedRef.current = paused
		if (paused) {
			for (const entry of timers.current.values()) {
				clearTimeout(entry.timeout)
				entry.remaining = Math.max(0, entry.endAt - Date.now())
			}
		} else {
			for (const [id, entry] of timers.current) {
				entry.endAt = Date.now() + entry.remaining
				entry.timeout = setTimeout(() => {
					timers.current.delete(id)
					dismissToast(id)
				}, entry.remaining)
			}
		}
	}, [paused])

	// Safety nets: browsers fire no blur when a focused toast unmounts, and a
	// hovered list can empty under the cursor — clear stuck pause reasons.
	React.useEffect(() => {
		if (toasts.length === 0) {
			setHoverPaused(false)
			setFocusPaused(false)
			return
		}
		if (focusPaused && !document.activeElement?.closest('.bz-toaster')) {
			setFocusPaused(false)
		}
	}, [toasts, focusPaused])

	React.useEffect(() => {
		const active = timers.current
		return () => {
			for (const entry of active.values()) clearTimeout(entry.timeout)
			active.clear()
		}
	}, [])

	const groups = new Map<ToastPosition, ToastItem[]>()
	for (const item of toasts) {
		const pos = item.position ?? position
		const group = groups.get(pos) ?? []
		group.push(item)
		groups.set(pos, group)
	}

	// Latest polite announcement (errors announce assertively on their card).
	const lastPolite = [...toasts].reverse().find(t => t.open && t.variant !== 'error')

	return (
		<Portal>
			{/* Persistent live region: announcements work even though toast
			    cards mount and unmount. */}
			<div className="bz-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
				{lastPolite && (
					<React.Fragment key={`${lastPolite.id}-${lastPolite.revision}`}>
						{lastPolite.message} {lastPolite.description}
					</React.Fragment>
				)}
			</div>
			{Array.from(groups.entries()).map(([pos, group]) => (
				<ol
					key={pos}
					className={cx('bz-toaster', className)}
					data-position={pos}
					data-bz-layer-branch=""
					style={{ '--bz-toaster-offset': `${offset}px` } as React.CSSProperties}
					role="region"
					aria-label="Notifications"
					onMouseEnter={() => setHoverPaused(true)}
					onMouseLeave={() => setHoverPaused(false)}
					onFocusCapture={() => setFocusPaused(true)}
					onBlurCapture={event => {
						// Only resume when focus actually leaves the viewport, not
						// when it moves between toasts inside it.
						if (!event.currentTarget.contains(event.relatedTarget as Node)) {
							setFocusPaused(false)
						}
					}}
				>
					{group.slice(-maxVisible).map(item => (
						<ToastCard key={item.id} item={item} />
					))}
				</ol>
			))}
		</Portal>
	)
}

function ToastCard({ item }: { item: ToastItem }) {
	const icon = item.icon !== undefined ? item.icon : VARIANT_ICONS[item.variant]
	const dismissible = item.dismissible ?? !Number.isFinite(item.duration)
	const isError = item.variant === 'error'

	return (
		<li
			className={cx('bz-toast', item.className)}
			data-variant={item.variant}
			data-state={item.open ? 'open' : 'closed'}
			style={item.style}
			role={isError ? 'alert' : undefined}
			aria-atomic={isError ? 'true' : undefined}
		>
			{icon != null && <span className="bz-toast__icon">{icon}</span>}
			<div className="bz-toast__body">
				<div className="bz-toast__message">{item.message}</div>
				{item.description != null && <div className="bz-toast__description">{item.description}</div>}
			</div>
			{item.action && (
				<button
					type="button"
					className="bz-toast__action"
					onClick={() => {
						item.action?.onClick()
						dismissToast(item.id)
					}}
				>
					{item.action.label}
				</button>
			)}
			{dismissible && (
				<button
					type="button"
					className="bz-toast__close"
					aria-label="Dismiss notification"
					onClick={() => dismissToast(item.id)}
				>
					<IconX />
				</button>
			)}
		</li>
	)
}

/**
 * @deprecated Mount `<Toaster />` directly and call `toast(...)`. Kept as a
 * drop-in replacement for the old context-based provider.
 */
export function ToastProvider({ children, ...props }: { children: React.ReactNode } & ToasterProps) {
	return (
		<>
			{children}
			<Toaster {...props} />
		</>
	)
}
