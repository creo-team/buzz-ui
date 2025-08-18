import * as React from 'react'

export interface Column<T> {
	key: keyof T
	header: React.ReactNode
	render?: (row: T) => React.ReactNode
}

export function Table<T extends { id: string | number }>({ columns, rows, className = '' }: { columns: Column<T>[], rows: T[], className?: string }) {
	return (
		<div className={["overflow-x-auto rounded-md border border-[var(--c-border)]", className].join(' ')}>
			<table className="min-w-full text-left text-sm">
				<thead className="bg-[var(--c-surface-2)]">
					<tr>
						{columns.map(c => (
							<th key={String(c.key)} className="px-3 py-2 font-medium text-white/80">{c.header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr key={String(row.id)} className="border-t border-[var(--c-border)]">
							{columns.map(c => (
								<td key={String(c.key)} className="px-3 py-2 text-white/80">{c.render ? c.render(row) : String(row[c.key])}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}


