"use client"
import React from 'react'
import { Sheet } from '@creo-team/buzz-ui/client'

type Item = { key: string, label: React.ReactNode, href?: string, onClick?: () => void }

export default function MobileMenu({ items }: { items: Item[] }) {
	const [open, setOpen] = React.useState(false)
	return (
		<>
			<button className="md:hidden rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10" onClick={() => setOpen(true)}>
				Menu
			</button>
			<Sheet open={open} onClose={() => setOpen(false)} position="left" header="Navigation">
				<nav className="grid gap-1">
					{items.map(i => (
						<a key={i.key} href={i.href} onClick={() => { setOpen(false); i.onClick?.() }} className="rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/10">
							{i.label}
						</a>
					))}
				</nav>
			</Sheet>
		</>
	)
}


