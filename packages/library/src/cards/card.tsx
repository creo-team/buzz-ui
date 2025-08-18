import * as React from 'react'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	header?: React.ReactNode
	actions?: React.ReactNode
	variant?: 'default' | 'elevated' | 'outlined'
}

/**
 * Card component inspired by Umbro's clean design
 * Provides a flexible container with optional header and actions
 */
export function Card({ 
	header, 
	actions, 
	variant = 'default',
	className = '', 
	children, 
	...props 
}: CardProps) {
	const variantClasses = {
		default: 'bg-[var(--c-surface)] border border-[var(--c-border)]',
		elevated: 'bg-[var(--c-surface)] border border-[var(--c-border)] shadow-[var(--shadow-md)]',
		outlined: 'bg-[var(--c-surface-2)] border border-[var(--c-border-strong)]'
	}

	return (
		<div 
			className={[
				'rounded-[var(--radius-xl)] p-6 transition-shadow',
				variantClasses[variant],
				className
			].join(' ')} 
			{...props}
		>
			{(header || actions) && (
				<div className="mb-4 flex items-start justify-between gap-4">
					{header && (
						<div className="min-w-0 flex-1">
							{typeof header === 'string' ? (
								<h3 className="text-lg font-semibold text-[var(--c-text)]">{header}</h3>
							) : (
								header
							)}
						</div>
					)}
					{actions && <div className="flex-shrink-0">{actions}</div>}
				</div>
			)}
			<div className="text-[var(--c-text)]">
				{children}
			</div>
		</div>
	)
}

