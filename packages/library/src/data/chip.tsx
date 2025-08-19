import * as React from 'react'

export enum ChipVariant {
	Default = 'default',
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Outline = 'outline'
}

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: ChipVariant | `${ChipVariant}`
}

export function Chip({ variant = ChipVariant.Default, className = '', ...props }: ChipProps) {
	const variants: Record<ChipVariant, string> = {
		[ChipVariant.Default]: 'bg-[var(--c-surface-3)] text-[var(--c-text)] border border-[var(--c-border-strong)]',
		[ChipVariant.Info]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25',
		[ChipVariant.Success]: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
		[ChipVariant.Warning]: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25',
		[ChipVariant.Danger]: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/25',
		[ChipVariant.Outline]: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-transparent',
	}
	const resolvedVariant = variant as ChipVariant
	return <span className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", variants[resolvedVariant], className].join(' ')} {...props} />
}


