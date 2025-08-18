"use client"
import * as React from 'react'

export interface MenuItem {
	key: string
	label: React.ReactNode
	onSelect?: () => void
}

export function Menu({ items, button }: { items: MenuItem[], button: React.ReactNode }) {
	const [open, setOpen] = React.useState(false)
	const ref = React.useRef<HTMLDivElement | null>(null)
	React.useEffect(() => {
		function onDoc(e: MouseEvent) {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('mousedown', onDoc)
		return () => document.removeEventListener('mousedown', onDoc)
	}, [])
	return (
		<div ref={ref} className="relative inline-block text-left">
			<button onClick={() => setOpen(o => !o)} className="rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-1.5 text-sm">{button}</button>
			{open && (
				<div className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] p-1 shadow-lg">
					{items.map(i => (
						<button key={i.key} onClick={() => { setOpen(false); i.onSelect?.() }} className="block w-full rounded-sm px-2 py-1 text-left text-sm text-[var(--c-text)] hover:bg-[var(--c-hover)]">{i.label}</button>
					))}
				</div>
			)}
		</div>
	)
}


