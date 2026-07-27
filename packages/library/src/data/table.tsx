import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface Column<T> {
	key: keyof T
	header: React.ReactNode
	render?: (row: T) => React.ReactNode
	/** Column alignment. Default 'left'. */
	align?: 'left' | 'center' | 'right'
	/** Fixed width (any CSS length). */
	width?: number | string
}

export interface TableProps<T> {
	columns: Column<T>[]
	rows: T[]
	className?: string
	/** Zebra striping. */
	striped?: boolean
	/** Row hover highlight. */
	hoverable?: boolean
	/** Tighter cell padding. */
	dense?: boolean
	/** Shown when `rows` is empty. */
	emptyState?: React.ReactNode
	/** Accessible description of the table. */
	caption?: string
}

/**
 * Typed data table. Server-component safe — for interactive sorting or
 * selection, control `rows` from the caller.
 */
export function Table<T extends { id: string | number }>({
	columns,
	rows,
	className,
	striped = false,
	hoverable = false,
	dense = false,
	emptyState,
	caption,
}: TableProps<T>) {
	return (
		<div className={cx('bz-table-wrap', className)}>
			<table
				className="bz-table"
				data-striped={striped || undefined}
				data-hoverable={hoverable || undefined}
				data-dense={dense || undefined}
			>
				{caption && <caption className="bz-visually-hidden">{caption}</caption>}
				<thead className="bz-table__head">
					<tr>
						{columns.map(c => (
							<th
								key={String(c.key)}
								scope="col"
								className="bz-table__th"
								style={{ textAlign: c.align, width: c.width }}
							>
								{c.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 && emptyState != null ? (
						<tr>
							<td className="bz-table__empty" colSpan={columns.length}>
								{emptyState}
							</td>
						</tr>
					) : (
						rows.map(row => (
							<tr key={String(row.id)} className="bz-table__tr">
								{columns.map(c => (
									<td key={String(c.key)} className="bz-table__td" style={{ textAlign: c.align }}>
										{c.render ? c.render(row) : String(row[c.key])}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	)
}
