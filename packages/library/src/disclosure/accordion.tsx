"use client"
import * as React from 'react'

export interface AccordionItem {
	key: string
	header: React.ReactNode
	content: React.ReactNode
}

export interface AccordionProps {
	items: AccordionItem[]
	openKey?: string | null
	onChange?: (key: string | null) => void
	className?: string
}

export function Accordion({ items, openKey, onChange, className = '' }: AccordionProps) {
	const [internal, setInternal] = React.useState<string | null>(openKey ?? null)
	React.useEffect(() => {
		if (openKey !== undefined) setInternal(openKey)
	}, [openKey])
	const setOpen = (key: string | null) => {
		if (onChange) onChange(key)
		if (openKey === undefined) setInternal(key)
	}
	const current = openKey !== undefined ? openKey : internal
	return (
		<div className={["rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)]", className].join(' ')}>
			{items.map(item => {
				const isOpen = current === item.key
				return (
					<div key={item.key} className="border-b last:border-b-0 border-[var(--c-border)]">
						<button onClick={() => setOpen(isOpen ? null : item.key)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[var(--c-text)] hover:bg-[var(--c-hover)]">
							<span>{item.header}</span>
							<span className={['transition-transform', isOpen ? 'rotate-180' : ''].join(' ')}>⌄</span>
						</button>
						{isOpen && (
							<div className="px-3 pb-3 text-sm text-white/80">{item.content}</div>
						)}
					</div>
				)
			})}
		</div>
	)
}


