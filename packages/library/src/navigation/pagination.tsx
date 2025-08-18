"use client"
import * as React from 'react'

export interface PaginationProps {
	page: number
	pageCount: number
	onPageChange?: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
	const prev = () => onPageChange?.(Math.max(1, page - 1))
	const next = () => onPageChange?.(Math.min(pageCount, page + 1))
	return (
		<div className="inline-flex items-center gap-2 text-sm">
			<button className="rounded-md border border-[var(--c-border)] px-2 py-1 hover:bg-[var(--c-hover)]" onClick={prev} disabled={page <= 1}>Prev</button>
			<span className="text-white/70">{page} / {pageCount}</span>
			<button className="rounded-md border border-[var(--c-border)] px-2 py-1 hover:bg-[var(--c-hover)]" onClick={next} disabled={page >= pageCount}>Next</button>
		</div>
	)
}


