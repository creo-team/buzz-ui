"use client"
import * as React from 'react'

export enum BannerVariant {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Development = 'development',
	Glass = 'glass',
	Gradient = 'gradient'
}

// Allow both enum values and their string literals
export type BannerVariantInput =
	| BannerVariant
	| 'info'
	| 'success'
	| 'warning'
	| 'danger'
	| 'development'
	| 'glass'
	| 'gradient'

const styles: Record<BannerVariant, string> = {
	[BannerVariant.Danger]: 'bg-gradient-to-r from-red-600/95 to-red-700/95 text-white border-red-500/30',
	[BannerVariant.Info]: 'bg-gradient-to-r from-blue-600/95 to-blue-700/95 text-white border-blue-500/30',
	[BannerVariant.Success]: 'bg-gradient-to-r from-emerald-600/95 to-emerald-700/95 text-white border-emerald-500/30',
	[BannerVariant.Warning]: 'bg-gradient-to-r from-amber-500/95 to-amber-600/95 text-white border-amber-400/30',
	[BannerVariant.Development]: 'bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 text-white border-amber-400/30',
	[BannerVariant.Glass]: 'bg-white/10 dark:bg-black/10 backdrop-blur-md text-[var(--c-text)] border-white/20 dark:border-white/10',
	[BannerVariant.Gradient]: 'bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-purple-600/95 text-white border-purple-500/30'
}

const iconColors: Record<BannerVariant, string> = {
	[BannerVariant.Danger]: 'text-red-200',
	[BannerVariant.Info]: 'text-blue-200',
	[BannerVariant.Success]: 'text-emerald-200',
	[BannerVariant.Warning]: 'text-amber-200',
	[BannerVariant.Development]: 'text-amber-100',
	[BannerVariant.Glass]: 'text-[var(--c-text)]',
	[BannerVariant.Gradient]: 'text-purple-200'
}

const defaultIcons: Record<BannerVariant, React.ReactNode> = {
	[BannerVariant.Info]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Warning]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Danger]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Success]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Development]: (
		<svg className="h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Glass]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
		</svg>
	),
	[BannerVariant.Gradient]: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
		</svg>
	)
}

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: React.ReactNode
	variant?: BannerVariantInput
	icon?: React.ReactNode
	dismissible?: boolean
	onDismiss?: () => void
	fixed?: boolean
	sticky?: boolean
	position?: 'top' | 'bottom'
	animated?: boolean
	action?: {
		label: string
		onClick: () => void
	}
}

export function Banner({
	children,
	variant = BannerVariant.Info,
	className = '',
	icon,
	dismissible = false,
	onDismiss,
	fixed = false,
	sticky = false,
	position = 'top',
	animated = false,
	action,
	...props
}: BannerProps) {
	const [isVisible, setIsVisible] = React.useState(true)
	const resolvedVariant = variant as BannerVariant
	const displayIcon = icon !== undefined ? icon : defaultIcons[resolvedVariant]

	if (!isVisible) return null

	const handleDismiss = () => {
		setIsVisible(false)
		onDismiss?.()
	}

	const positionClasses = fixed 
		? position === 'top' 
			? 'fixed inset-x-0 top-0 z-[60]' 
			: 'fixed inset-x-0 bottom-0 z-[60]'
		: sticky
		? position === 'top'
			? 'sticky top-0 z-[60]'
			: 'sticky bottom-0 z-[60]'
		: ''

	return (
		<div 
			className={[
				'relative backdrop-blur-sm shadow-lg border-b w-full',
				styles[resolvedVariant],
				positionClasses,
				animated && resolvedVariant === BannerVariant.Development ? '' : '',
				className
			].filter(Boolean).join(' ')} 
			role={resolvedVariant === BannerVariant.Danger ? 'alert' : 'status'}
			{...props}
		>
			{/* Overlay effects for certain variants */}
			{(resolvedVariant === BannerVariant.Development || resolvedVariant === BannerVariant.Gradient) && (
				<>
					<div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
				</>
			)}
			
			{/* Glass effect overlay */}
			{resolvedVariant === BannerVariant.Glass && (
				<div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
			)}

			<div className="relative px-4 sm:px-6 lg:px-8 py-2.5">
				<div className="flex items-center justify-center gap-3 text-sm font-medium overflow-x-auto">
					{displayIcon && (
						<div className="flex-shrink-0">
							<div className="relative">
								<span className={iconColors[resolvedVariant]}>
									{displayIcon}
								</span>
								{animated && resolvedVariant === BannerVariant.Development && (
									<div className="absolute -inset-1 bg-amber-200/20 rounded-full animate-ping" />
								)}
							</div>
						</div>
					)}
					<div className="flex items-center gap-1.5">
						{children}
					</div>
					{action && (
						<button
							onClick={action.onClick}
							className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-xs font-semibold"
						>
							{action.label}
						</button>
					)}
					{dismissible && (
						<button
							onClick={handleDismiss}
							className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
							aria-label="Dismiss banner"
						>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}