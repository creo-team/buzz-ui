"use client"
import * as React from 'react'
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { useHotkey, type HotkeyConfig, formatHotkey } from '../hooks/use-hotkey'
import { type ButtonAnimationVariants, AnimationPresets } from '../types/animations'

/** Visual styles for the button - inspired by Umbro design patterns */
export enum ButtonVariant {
	Bold = 'bold',
	Outline = 'outline',
	Subtle = 'subtle',
	Text = 'text',
	Nav = 'nav',
	Success = 'success',
	Danger = 'danger',
	Glass = 'glass',
	Ghost = 'ghost',
	Icon = 'icon'
}

/** Size presets for padding and font size */
export enum ButtonSize {
	Small = 'sm',
	Medium = 'md',
	Large = 'lg'
}

type ButtonVariantInput = ButtonVariant | `${ButtonVariant}`
type ButtonSizeInput = ButtonSize | `${ButtonSize}`

/**
 * Button props
 *
 * Inherits all native HTMLButtonElement attributes (onClick, disabled, type, etc.)
 * Based on Umbro's button design with modern styling
 */
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    /** Visual variant */
    variant?: ButtonVariantInput
    /** Size preset */
    size?: ButtonSizeInput
    /** Loading state with spinner */
    loading?: boolean
    /** Selected state for toggle buttons */
    selected?: boolean
    /** Hotkey configuration to trigger this button */
    hotkey?: string | HotkeyConfig
    /** Icon only mode - removes padding and makes button circular */
    iconOnly?: boolean
    /** Children content */
    children?: React.ReactNode
}

const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
const sizes: Record<ButtonSize, string> = {
	[ButtonSize.Large]: 'px-6 py-3 text-base rounded-2xl',
	[ButtonSize.Medium]: 'px-4 py-2 text-sm rounded-xl',
	[ButtonSize.Small]: 'px-3 py-1.5 text-xs rounded-lg',
}
const iconSizes: Record<ButtonSize, string> = {
	[ButtonSize.Large]: 'h-12 w-12 text-base rounded-full',
	[ButtonSize.Medium]: 'h-10 w-10 text-sm rounded-full',
	[ButtonSize.Small]: 'h-8 w-8 text-xs rounded-full',
}
const variants: Record<ButtonVariant, string> = {
	[ButtonVariant.Bold]: 'bg-[var(--c-primary)] hover:bg-[var(--c-primary-hover)] text-white shadow-md hover:shadow-lg focus:ring-[var(--c-primary-ring)]',
	[ButtonVariant.Outline]: 'border border-[var(--c-border-strong)] text-[var(--c-text)] bg-transparent hover:bg-[var(--c-hover)]/30 hover:border-[var(--c-primary)] hover:text-[var(--c-primary)] focus:ring-[var(--c-primary-ring)]',
	[ButtonVariant.Subtle]: 'bg-[var(--c-surface-2)] text-[var(--c-text)] border border-[var(--c-border)] hover:bg-[var(--c-hover)] focus:ring-[var(--c-primary-ring)]',
	[ButtonVariant.Glass]: 'bg-white/8 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/10 dark:border-white/5 text-[var(--c-text)] hover:bg-white/12 dark:hover:bg-black/30 shadow-sm',
	[ButtonVariant.Ghost]: 'bg-transparent hover:bg-[var(--c-hover)]/20 text-[var(--c-text-secondary)] hover:text-[var(--c-text)] border-0',
	[ButtonVariant.Icon]: 'bg-transparent hover:bg-[var(--c-hover)]/40 text-[var(--c-text-secondary)] hover:text-[var(--c-text)] border-0',
	[ButtonVariant.Text]: 'bg-transparent text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] focus:ring-0 p-0 rounded-none',
	[ButtonVariant.Nav]: 'border-0 bg-transparent text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]/20 focus:ring-0',
	[ButtonVariant.Success]: 'bg-[var(--c-success)] text-white hover:brightness-110 shadow-sm hover:shadow-md focus:ring-green-400/50',
	[ButtonVariant.Danger]: 'bg-[var(--c-danger)] text-white hover:brightness-110 shadow-sm hover:shadow-md focus:ring-red-400/50',
}

const selectedVariants: Record<ButtonVariant, string> = {
	[ButtonVariant.Bold]: 'bg-[var(--c-primary)] text-white shadow-lg ring-2 ring-[var(--c-primary-ring)]',
	[ButtonVariant.Outline]: 'border-[var(--c-primary)] text-[var(--c-primary)] bg-[var(--c-primary)]/10',
	[ButtonVariant.Subtle]: 'bg-[var(--c-hover)]/60 text-[var(--c-text)]',
	[ButtonVariant.Glass]: 'bg-white/15 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10 text-[var(--c-text)] shadow-md',
	[ButtonVariant.Ghost]: 'bg-[var(--c-hover)]/40 text-[var(--c-text)]',
	[ButtonVariant.Icon]: 'bg-[var(--c-hover)]/60 text-[var(--c-text)]',
	[ButtonVariant.Text]: 'text-[var(--c-primary)] font-semibold',
	[ButtonVariant.Nav]: 'text-[var(--c-primary)] bg-[var(--c-primary)]/10',
	[ButtonVariant.Success]: 'bg-[var(--c-success)] brightness-110 shadow-md ring-2 ring-green-400/50',
	[ButtonVariant.Danger]: 'bg-[var(--c-danger)] brightness-110 shadow-md ring-2 ring-red-400/50',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ className = '', variant = ButtonVariant.Bold, size = ButtonSize.Medium, loading = false, selected = false, hotkey, iconOnly = false, children, disabled, onClick, ...props },
	ref
) {
	// Minimal animation - only on tap for feedback
	const animVariants = {
		idle: { scale: 1 },
		hover: { scale: 1 },
		tap: { scale: 0.97 }
	}

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
	const resolvedVariant = variant as ButtonVariant
	const resolvedSize = size as ButtonSize
	const activeVariant = selected ? selectedVariants[resolvedVariant] : variants[resolvedVariant]
	
	let variantClasses: string
	if (iconOnly || resolvedVariant === ButtonVariant.Icon) {
		variantClasses = `${base} ${iconSizes[resolvedSize]} ${activeVariant} ${className}`
	} else if (resolvedVariant === ButtonVariant.Text) {
		variantClasses = `${base.replace('rounded-lg ', '')} ${activeVariant} ${className}`
	} else {
		variantClasses = `${base} ${sizes[resolvedSize]} ${activeVariant} ${className}`
	}

	// Add hotkey hint to title if provided
	const hotkeyHint = hotkey 
		? (typeof hotkey === 'string' ? formatHotkey(hotkey) : formatHotkey(hotkey.key))
		: undefined
	const title = props.title || (hotkeyHint ? `Press ${hotkeyHint}` : undefined)

	return (
		<motion.button 
			ref={ref} 
			className={variantClasses}
			disabled={disabled || loading}
			aria-pressed={selected}
			onClick={onClick}
			title={title}
			variants={animVariants}
			initial="idle"
			whileHover={!disabled && !loading ? "hover" : "idle"}
			whileTap={!disabled && !loading ? "tap" : "idle"}
			{...props}
		>
			{loading && (
				<svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
			)}
			{children}
		</motion.button>
	)
})

