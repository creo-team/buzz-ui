import * as React from 'react'

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant
}

const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium'
const variants: Record<BadgeVariant, string> = {
	default: 'bg-[var(--c-surface-3)] text-[var(--c-text)] border border-[var(--c-border)]',
	danger: 'bg-[var(--c-danger-light)] text-[var(--c-danger)] border border-[var(--c-danger)]/20',
	info: 'bg-[var(--c-info-light)] text-[var(--c-info)] border border-[var(--c-info)]/20',
	success: 'bg-[var(--c-success-light)] text-[var(--c-success)] border border-[var(--c-success)]/20',
	warning: 'bg-[var(--c-warning-light)] text-[var(--c-warning)] border border-[var(--c-warning)]/20',
	outline: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-transparent',
}

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
	return <span className={[base, variants[variant], className].join(' ')} {...props} />
}

