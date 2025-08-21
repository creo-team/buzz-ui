import * as React from 'react'

export enum BadgeVariant {
	Default = 'default',
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Outline = 'outline'
}

type BadgeVariantInput = BadgeVariant | `${BadgeVariant}`

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariantInput
}

const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium'
const variants: Record<BadgeVariant, string> = {
	[BadgeVariant.Default]: 'bg-[var(--c-surface-3)] text-[var(--c-text)] border border-[var(--c-border)]',
	[BadgeVariant.Danger]: 'bg-[var(--c-danger-light)] text-[var(--c-danger)] border border-[var(--c-danger)]/20',
	[BadgeVariant.Info]: 'bg-[var(--c-info-light)] text-[var(--c-info)] border border-[var(--c-info)]/20',
	[BadgeVariant.Success]: 'bg-[var(--c-success-light)] text-[var(--c-success)] border border-[var(--c-success)]/20',
	[BadgeVariant.Warning]: 'bg-[var(--c-warning-light)] text-[var(--c-warning)] border border-[var(--c-warning)]/20',
	[BadgeVariant.Outline]: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-transparent',
}

export function Badge({ variant = BadgeVariant.Default, className = '', ...props }: BadgeProps) {
	const resolvedVariant = variant as BadgeVariant
	return <span className={[base, variants[resolvedVariant], className].join(' ')} {...props} />
}

