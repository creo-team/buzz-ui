import * as React from 'react'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'outline'
}

export function Chip({ variant = 'default', className = '', ...props }: ChipProps) {
	const variants: Record<NonNullable<ChipProps['variant']>, string> = {
		default: 'bg-[var(--c-surface-2)] text-[var(--c-text)]',
		info: 'bg-blue-500/20 text-blue-300',
		success: 'bg-emerald-500/20 text-emerald-300',
		warning: 'bg-yellow-500/20 text-yellow-300',
		danger: 'bg-red-500/20 text-red-300',
		outline: 'border border-[var(--c-border)] text-[var(--c-text)]',
	}
	return <span className={["inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", variants[variant], className].join(' ')} {...props} />
}


