import * as React from 'react'

export enum CardVariant {
	Default = 'default',
	Elevated = 'elevated',
	Outlined = 'outlined'
}

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	header?: React.ReactNode
	actions?: React.ReactNode
	variant?: CardVariant | `${CardVariant}`
}

/**
 * Card component inspired by Umbro's clean design
 * Provides a flexible container with optional header and actions
 */
export function Card({ 
	header, 
	actions, 
	variant = CardVariant.Default,
	className = '', 
	children, 
	...props 
}: CardProps) {
	const variantClasses = {
		[CardVariant.Default]: 'bg-[var(--c-surface)] border border-[var(--c-border)]',
		[CardVariant.Elevated]: 'bg-[var(--c-surface)] border border-[var(--c-border)] shadow-[var(--shadow-md)]',
		[CardVariant.Outlined]: 'bg-[var(--c-surface-2)] border border-[var(--c-border-strong)]'
	}

	return (
		<div 
			className={[
				'rounded-[var(--radius-xl)] p-6 transition-shadow',
				variantClasses[variant as CardVariant],
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

