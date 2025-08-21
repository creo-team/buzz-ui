import * as React from 'react'

export enum ProgressVariant {
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Info = 'info',
	Glass = 'glass'
}

export enum ProgressSize {
	ExtraSmall = 'xs',
	Small = 'sm',
	Medium = 'md',
	Large = 'lg',
	ExtraLarge = 'xl'
}

export enum ProgressShape {
	Rounded = 'rounded',
	Square = 'square',
	Pill = 'pill'
}

export interface ProgressProps {
	/** percentage 0-100 */
	value?: number
	/** Size variant */
	size?: ProgressSize | `${ProgressSize}`
	/** Color variant */
	variant?: ProgressVariant | `${ProgressVariant}`
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
	shape?: ProgressShape | `${ProgressShape}`
	className?: string
}

const sizeClasses = {
	[ProgressSize.ExtraSmall]: 'h-0.5',
	[ProgressSize.Small]: 'h-1',
	[ProgressSize.Medium]: 'h-2',
	[ProgressSize.Large]: 'h-3',
	[ProgressSize.ExtraLarge]: 'h-4'
}

const variantClasses = {
	[ProgressVariant.Primary]: 'bg-[var(--c-primary)]',
	[ProgressVariant.Success]: 'bg-[var(--c-success)]',
	[ProgressVariant.Warning]: 'bg-[var(--c-warning)]',
	[ProgressVariant.Danger]: 'bg-[var(--c-danger)]',
	[ProgressVariant.Info]: 'bg-blue-500',
	[ProgressVariant.Glass]: 'bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/20'
}

const shapeClasses = {
	[ProgressShape.Rounded]: 'rounded-lg',
	[ProgressShape.Square]: 'rounded-none',
	[ProgressShape.Pill]: 'rounded-full'
}

/**
 * Progress bar component with multiple variants and sizes
 * Shows completion percentage with smooth animations
 */
export function Progress({ 
	value = 0, 
	size = ProgressSize.Medium, 
	variant = ProgressVariant.Primary,
	showLabel = false,
	animated = false,
	striped = false,
	indeterminate = false,
	label,
	shape = ProgressShape.Rounded,
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
			<div className={`w-full bg-[var(--c-surface-3)] border border-[var(--c-border)] overflow-hidden ${sizeClasses[size as ProgressSize]} ${shapeClasses[shape as ProgressShape]}`}>
				<div 
					className={`${sizeClasses[size as ProgressSize]} transition-all duration-300 ease-out ${variantClasses[variant as ProgressVariant]} ${animationClasses} ${shapeClasses[shape as ProgressShape]}`}
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

