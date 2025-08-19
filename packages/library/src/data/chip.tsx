import * as React from 'react'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'outline'
}

export function Chip({ variant = 'default', className = '', ...props }: ChipProps) {
	const variants: Record<NonNullable<ChipProps['variant']>, string> = {
		default: 'bg-[var(--c-surface-3)] text-[var(--c-text)] border border-[var(--c-border-strong)]',
		info: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25',
		success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
		warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25',
		danger: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/25',
		outline: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-transparent',
	}
	return <span className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", variants[variant], className].join(' ')} {...props} />
}


