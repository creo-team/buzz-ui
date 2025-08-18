import * as React from 'react'

export interface ProgressProps {
	/** percentage 0-100 */
	value?: number
	/** Size variant */
	size?: 'sm' | 'md' | 'lg'
	/** Color variant */
	variant?: 'primary' | 'success' | 'warning' | 'danger'
	/** Show percentage label */
	showLabel?: boolean
	className?: string
}

const sizeClasses = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3'
}

const variantClasses = {
	primary: 'bg-[var(--c-primary)]',
	success: 'bg-[var(--c-success)]',
	warning: 'bg-[var(--c-warning)]',
	danger: 'bg-[var(--c-danger)]'
}

/**
 * Progress bar component with multiple variants and sizes
 * Shows completion percentage with smooth animations
 */
export function Progress({ 
	value = 0, 
	size = 'md', 
	variant = 'primary',
	showLabel = false,
	className = ''
}: ProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))
	
	return (
		<div className={className}>
			{showLabel && (
				<div className="mb-2 flex justify-between text-sm">
					<span className="text-[var(--c-text-secondary)]">Progress</span>
					<span className="text-[var(--c-text)]">{Math.round(clamped)}%</span>
				</div>
			)}
			<div className={`w-full rounded-full bg-[var(--c-surface-3)] border border-[var(--c-border)] ${sizeClasses[size]}`}>
				<div 
					className={`${sizeClasses[size]} rounded-full transition-all duration-300 ease-out ${variantClasses[variant]}`}
					style={{ width: `${clamped}%` }}
					role="progressbar"
					aria-valuenow={clamped}
					aria-valuemin={0}
					aria-valuemax={100}
				/>
			</div>
		</div>
	)
}

