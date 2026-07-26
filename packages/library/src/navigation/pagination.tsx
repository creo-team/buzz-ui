"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconChevronLeft, IconChevronRight } from '../internal/icons.js'

export interface PaginationProps {
	/** Current page (1-based). */
	page: number
	pageCount: number
	onPageChange?: (page: number) => void
	/** Pages shown on each side of the current page. Default 1. */
	siblingCount?: number
	/** Always show first/last page numbers. Default true. */
	showEdges?: boolean
	/** Compact mode: only prev/next and "x / y". */
	compact?: boolean
	className?: string
}

function paginationRange(page: number, pageCount: number, siblingCount: number, showEdges: boolean): (number | 'ellipsis')[] {
	const range: (number | 'ellipsis')[] = []
	const start = Math.max(1, page - siblingCount)
	const end = Math.min(pageCount, page + siblingCount)

	if (showEdges && start > 1) {
		range.push(1)
		if (start > 2) range.push('ellipsis')
	}
	for (let i = start; i <= end; i++) range.push(i)
	if (showEdges && end < pageCount) {
		if (end < pageCount - 1) range.push('ellipsis')
		range.push(pageCount)
	}
	return range
}

/**
 * Page navigation with numbered pages, ellipsis collapsing and
 * `aria-current` on the active page.
 */
export function Pagination({
	page,
	pageCount,
	onPageChange,
	siblingCount = 1,
	showEdges = true,
	compact = false,
	className,
}: PaginationProps) {
	const goTo = (target: number) => onPageChange?.(Math.min(Math.max(1, target), pageCount))
	const range = paginationRange(page, pageCount, siblingCount, showEdges)

	return (
		<nav className={cx('bz-pagination', className)} aria-label="Pagination">
			<button
				type="button"
				className="bz-pagination__nav"
				onClick={() => goTo(page - 1)}
				disabled={page <= 1}
				aria-label="Previous page"
			>
				<IconChevronLeft />
			</button>
			{compact ? (
				<span className="bz-pagination__status" aria-live="polite">
					{page} / {pageCount}
				</span>
			) : (
				<ol className="bz-pagination__pages">
					{range.map((entry, index) =>
						entry === 'ellipsis' ? (
							<li key={`ellipsis-${index}`} className="bz-pagination__ellipsis" aria-hidden="true">
								…
							</li>
						) : (
							<li key={entry}>
								<button
									type="button"
									className="bz-pagination__page"
									data-active={entry === page || undefined}
									aria-current={entry === page ? 'page' : undefined}
									onClick={() => goTo(entry)}
								>
									{entry}
								</button>
							</li>
						)
					)}
				</ol>
			)}
			<button
				type="button"
				className="bz-pagination__nav"
				onClick={() => goTo(page + 1)}
				disabled={page >= pageCount}
				aria-label="Next page"
			>
				<IconChevronRight />
			</button>
		</nav>
	)
}
