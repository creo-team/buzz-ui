"use client"
import * as React from 'react'
import { Tooltip } from './tooltip'

export interface InfotipProps {
	title?: string
	description: React.ReactNode
	className?: string
	placement?: 'top' | 'right' | 'bottom' | 'left'
	widthClassName?: string
}

/**
 * Infotip - A tooltip with an information icon trigger, inspired by Umbro's design
 * Perfect for inline contextual help and explanations
 */
export function Infotip({ 
	title, 
	description, 
	className = '', 
	placement = 'top',
	widthClassName = 'max-w-xs' 
}: InfotipProps) {
	return (
		<Tooltip 
			content={description}
			title={title}
			placement={placement}
			widthClassName={widthClassName}
			contentClassName="whitespace-normal"
		>
			<button
				type="button"
				className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--c-border-strong)] text-[var(--c-text-muted)] transition-colors hover:border-[var(--c-primary)] hover:text-[var(--c-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-ring)] ${className}`}
				aria-label={title ? `Information: ${title}` : 'More information'}
				title={typeof description === 'string' ? description : undefined}
			>
				<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<circle cx="12" cy="12" r="10" />
					<path d="M12 16v-4" />
					<path d="M12 8h.01" />
				</svg>
			</button>
		</Tooltip>
	)
}

