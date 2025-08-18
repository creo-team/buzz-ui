import * as React from 'react'

export interface TabItem { key: string, label: React.ReactNode }

export function Tabs({ items, value, onChange }: { items: TabItem[], value: string, onChange: (key: string) => void }) {
	return (
		<div className="inline-flex rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] p-1 text-sm">
			{items.map(item => (
				<button key={item.key} onClick={() => onChange(item.key)} className={[
					'rounded-md px-3 py-1.5',
					value === item.key ? 'bg-[var(--c-primary)] text-[var(--c-on-primary)]' : 'text-[var(--c-text)] hover:bg-[var(--c-hover)]',
				].join(' ')}>
					{item.label}
				</button>
			))}
		</div>
	)
}

