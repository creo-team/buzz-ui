"use client"
import * as React from 'react'
import { useHotkey, type HotkeyConfig, formatHotkey } from '../hooks/use-hotkey'

/** Visual styles for the button - inspired by Umbro design patterns */
export type ButtonVariant = 'bold' | 'outline' | 'subtle' | 'text' | 'nav' | 'success' | 'danger'
/** Size presets for padding and font size */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button props
 *
 * Inherits all native HTMLButtonElement attributes (onClick, disabled, type, etc.)
 * Based on Umbro's button design with modern styling
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual variant */
    variant?: ButtonVariant
    /** Size preset */
    size?: ButtonSize
    /** Loading state with spinner */
    loading?: boolean
    /** Selected state for toggle buttons */
    selected?: boolean
    /** Hotkey configuration to trigger this button */
    hotkey?: string | HotkeyConfig
}

const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
const sizes: Record<ButtonSize, string> = {
	lg: 'px-6 py-3 text-base rounded-[var(--radius-lg)]',
	md: 'px-4 py-2 text-sm rounded-[var(--radius-lg)]',
	sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-md)]',
}
const variants: Record<ButtonVariant, string> = {
	bold: 'bg-[var(--c-primary)] text-[var(--c-on-primary)] hover:bg-[var(--c-primary-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus:ring-[var(--c-primary-ring)]',
	outline: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-[var(--c-surface)] hover:bg-[var(--c-hover)] hover:border-[var(--c-primary)] hover:text-[var(--c-primary)] focus:ring-[var(--c-primary-ring)]',
	subtle: 'bg-[var(--c-surface-2)] text-[var(--c-text)] border border-transparent hover:bg-[var(--c-hover)] hover:border-[var(--c-border)] focus:ring-[var(--c-primary-ring)]',
	text: 'bg-transparent text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] hover:underline focus:ring-0 p-0 rounded-none',
	nav: 'border-0 border-b-2 border-transparent bg-transparent text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)] focus:ring-0 rounded-none',
	success: 'bg-[var(--c-success)] text-white hover:brightness-110 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus:ring-green-400/50',
	danger: 'bg-[var(--c-danger)] text-white hover:brightness-110 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus:ring-red-400/50',
}

const selectedVariants: Record<ButtonVariant, string> = {
	bold: 'bg-[var(--c-primary-hover)] text-[var(--c-on-primary)] shadow-[var(--shadow-md)] ring-2 ring-[var(--c-primary-ring)]',
	outline: 'border-[var(--c-primary)] text-[var(--c-primary)] bg-[var(--c-primary-light)] shadow-[var(--shadow-sm)]',
	subtle: 'bg-[var(--c-primary-light)] text-[var(--c-primary)] border-[var(--c-primary)] shadow-[var(--shadow-sm)]',
	text: 'text-[var(--c-primary)] underline font-semibold',
	nav: 'border-b-[var(--c-primary)] text-[var(--c-primary)] bg-[var(--c-primary-light)]',
	success: 'bg-[var(--c-success)] brightness-110 shadow-[var(--shadow-md)] ring-2 ring-green-400/50',
	danger: 'bg-[var(--c-danger)] brightness-110 shadow-[var(--shadow-md)] ring-2 ring-red-400/50',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ className = '', variant = 'bold', size = 'md', loading = false, selected = false, hotkey, children, disabled, onClick, ...props },
	ref
) {
	// Set up hotkey if provided
	const handleHotkeyAction = React.useCallback(() => {
		if (!disabled && !loading && onClick) {
			onClick({} as React.MouseEvent<HTMLButtonElement>)
		}
	}, [disabled, loading, onClick])

	// Always call useHotkey hook (required by React rules)
	const hotkeyEnabled = Boolean(hotkey && onClick && !disabled && !loading)
	const hotkeyKey = typeof hotkey === 'string' ? hotkey : hotkey?.key || ''
	
	useHotkey({
		key: hotkeyKey,
		action: handleHotkeyAction,
		enabled: hotkeyEnabled
	})

	// Choose the appropriate variant based on selected state
	const activeVariant = selected ? selectedVariants[variant] : variants[variant]
	
	const variantClasses = variant === 'text' 
		? `${base.replace('rounded-[var(--radius-lg)] ', '')} ${activeVariant} ${className}`
		: `${base} ${sizes[size]} ${activeVariant} ${className}`

	// Add hotkey hint to title if provided
	const hotkeyHint = hotkey 
		? (typeof hotkey === 'string' ? formatHotkey(hotkey) : formatHotkey(hotkey.key))
		: undefined
	const title = props.title || (hotkeyHint ? `Press ${hotkeyHint}` : undefined)

	return (
		<button 
			ref={ref} 
			className={variantClasses}
			disabled={disabled || loading}
			aria-pressed={selected}
			onClick={onClick}
			title={title}
			{...props}
		>
			{loading && (
				<svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
			)}
			{children}
		</button>
	)
})

