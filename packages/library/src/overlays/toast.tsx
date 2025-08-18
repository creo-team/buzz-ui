"use client"
import * as React from 'react'

type ToastItem = { id: number, message: React.ReactNode }

const ToastContext = React.createContext<{
	toasts: ToastItem[]
	push: (message: React.ReactNode) => void
	remove: (id: number) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<ToastItem[]>([])
	const push = (message: React.ReactNode) => setToasts(ts => [...ts, { id: Date.now(), message }])
	const remove = (id: number) => setToasts(ts => ts.filter(t => t.id !== id))
	return (
		<ToastContext.Provider value={{ toasts, push, remove }}>
			{children}
			<div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-2 px-4">
				{toasts.map(t => (
					<div key={t.id} className="pointer-events-auto rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2 text-sm text-[var(--c-text)] shadow" onClick={() => remove(t.id)}>
						{t.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	)
}

export function useToast() {
	const ctx = React.useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within ToastProvider')
	return ctx
}

