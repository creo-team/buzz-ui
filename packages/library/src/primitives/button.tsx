"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Slot } from '../internal/slot.js'
import { useComposedRefs } from '../internal/compose-refs.js'
import { useHotkey, formatHotkey, type HotkeyConfig } from '../hooks/use-hotkey.js'
import { Spinner } from './spinner.js'

/** Visual styles for the button. */
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
	Icon = 'icon',
}

/** Size presets for padding and font size. */
export enum ButtonSize {
	Small = 'sm',
	Medium = 'md',
	Large = 'lg',
}

type ButtonVariantInput = ButtonVariant | `${ButtonVariant}`
type ButtonSizeInput = ButtonSize | `${ButtonSize}`

/** Hotkey shorthand — `action` is optional because the button's own click is the action. */
export type ButtonHotkey = string | (Omit<HotkeyConfig, 'action'> & { action?: () => void })

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual variant. */
	variant?: ButtonVariantInput
	/** Size preset. */
	size?: ButtonSizeInput
	/** Loading state — shows a spinner, disables interaction, sets aria-busy. */
	loading?: boolean
	/** Selected state for toggle buttons (sets aria-pressed). */
	selected?: boolean
	/** Keyboard shortcut that clicks this button (e.g. 'mod+s'). */
	hotkey?: ButtonHotkey
	/** Icon-only mode — square hit area, circular shape. */
	iconOnly?: boolean
	/** Stretch to the container's width. */
	fullWidth?: boolean
	/**
	 * Render the child element instead of a `<button>`, merging behavior and
	 * styling onto it. Ideal for framework links:
	 * `<Button asChild><Link href="/docs">Docs</Link></Button>`
	 */
	asChild?: boolean
	children?: React.ReactNode
}

/**
 * The Buzz UI button. Styled entirely by the shipped stylesheet (CSS
 * transitions handle hover/press feedback — no animation library, no runtime
 * style computation, SSR-clean output).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		className,
		variant = ButtonVariant.Bold,
		size = ButtonSize.Medium,
		loading = false,
		selected,
		hotkey,
		iconOnly = false,
		fullWidth = false,
		asChild = false,
		children,
		disabled,
		type,
		...props
	},
	forwardedRef
) {
	const internalRef = React.useRef<HTMLButtonElement>(null)
	const ref = useComposedRefs(forwardedRef, internalRef)

	const hotkeyKey = typeof hotkey === 'string' ? hotkey : hotkey?.key ?? ''
	const hotkeyEnabled = Boolean(hotkeyKey) && !disabled && !loading
	useHotkey({
		key: hotkeyKey || 'unassigned',
		enabled: hotkeyEnabled,
		description: typeof hotkey === 'object' ? hotkey.description : undefined,
		action: () => {
			if (typeof hotkey === 'object' && hotkey.action) hotkey.action()
			// Dispatch a real click so forms, analytics and default handlers all work.
			else internalRef.current?.click()
		},
	})

	const hotkeyHint = hotkeyKey ? formatHotkey(hotkeyKey) : undefined
	const title = props.title ?? (hotkeyHint ? `Press ${hotkeyHint}` : undefined)

	const isIcon = iconOnly || variant === ButtonVariant.Icon
	const sharedProps = {
		className: cx('bz-button', className),
		'data-variant': variant as string,
		'data-size': size as string,
		'data-icon-only': isIcon || undefined,
		'data-full-width': fullWidth || undefined,
		'data-loading': loading || undefined,
		'data-selected': selected || undefined,
		'aria-pressed': selected,
		'aria-busy': loading || undefined,
		title,
	}

	if (asChild) {
		return (
			<Slot ref={ref as unknown as React.Ref<HTMLElement>} {...sharedProps} {...props}>
				{children}
			</Slot>
		)
	}

	return (
		<button
			ref={ref}
			type={type ?? 'button'}
			disabled={disabled || loading}
			{...sharedProps}
			{...props}
		>
			{loading && <Spinner size="sm" className="bz-button__spinner" label={null} />}
			{children}
		</button>
	)
})
