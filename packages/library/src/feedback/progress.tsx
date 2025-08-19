import * as React from 'react'

export interface ProgressProps {
	/** percentage 0-100 */
	value?: number
	/** Size variant */
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	/** Color variant */
	variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glass'
	/** Show percentage label */
	showLabel?: boolean
	/** Animation style */
	animated?: boolean
	/** Striped pattern */
	striped?: boolean
	/** Indeterminate state (loading) */
	indeterminate?: boolean
	/** Custom label text */
	label?: string
	/** Shape variant */
	shape?: 'rounded' | 'square' | 'pill'
	className?: string
}

const sizeClasses = {
	xs: 'h-0.5',
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
	xl: 'h-4'
}

const variantClasses = {
	primary: 'bg-[var(--c-primary)]',
	success: 'bg-[var(--c-success)]',
	warning: 'bg-[var(--c-warning)]',
	danger: 'bg-[var(--c-danger)]',
	info: 'bg-blue-500',
	glass: 'bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/20'
}

const shapeClasses = {
	rounded: 'rounded-lg',
	square: 'rounded-none',
	pill: 'rounded-full'
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
	animated = false,
	striped = false,
	indeterminate = false,
	label,
	shape = 'rounded',
	className = ''
}: ProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))
	
	// Striped pattern styles
	const stripedStyles = striped ? {
		backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
		backgroundSize: '1rem 1rem'
	} : {}
	
	// Animation classes - use standard Tailwind animations
	const animationClasses = [
		animated && !indeterminate ? 'animate-pulse' : '',
		indeterminate ? 'animate-pulse' : ''
	].filter(Boolean).join(' ')
	
	return (
		<div className={className}>
			{showLabel && (
				<div className="mb-2 flex justify-between text-sm">
					<span className="text-[var(--c-text-secondary)]">{label || 'Progress'}</span>
					{!indeterminate && (
						<span className="text-[var(--c-text)] font-medium">{Math.round(clamped)}%</span>
					)}
				</div>
			)}
			<div className={`w-full bg-[var(--c-surface-3)] border border-[var(--c-border)] overflow-hidden ${sizeClasses[size]} ${shapeClasses[shape]}`}>
				<div 
					className={`${sizeClasses[size]} transition-all duration-300 ease-out ${variantClasses[variant]} ${animationClasses} ${shapeClasses[shape]}`}
					style={{
						width: indeterminate ? '30%' : `${clamped}%`,
						...stripedStyles
					}}
					role="progressbar"
					aria-valuenow={indeterminate ? undefined : clamped}
					aria-valuemin={0}
					aria-valuemax={100}
				/>
			</div>

		</div>
	)
}

