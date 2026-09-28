"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Slot } from '../internal/slot.js'
import { useComposedRefs } from '../internal/compose-refs.js'
import { useHotkey, formatHotkey, type HotkeyConfig } from '../hooks/use-hotkey.js'
import { Spinner } from './spinner.js'

/**
 * Visual weight of the button — how much attention it demands.
 *
 * Combine with {@link ButtonTone} for color: `variant` picks the shape of the
 * emphasis (filled, tinted, outlined, bare), `tone` picks what it means
 * (brand, neutral chrome, success, danger). The two axes replace the flat
 * v0.6 list; the old names still work as deprecated aliases.
 */
export enum ButtonVariant {
	/** Filled with the tone color — the strongest emphasis. The default. */
	Solid = 'solid',
	/** Tinted background, tone-colored text — medium emphasis without weight. */
	Soft = 'soft',
	/** Border only — secondary actions beside a solid primary. */
	Outline = 'outline',
	/** No chrome until hover — toolbars, icon buttons, nav items. */
	Ghost = 'ghost',
	/** Rendered like an inline link, no padding — actions inside prose. */
	Link = 'link',
	/** Translucent, blurred backdrop — for buttons floating over imagery. */
	Glass = 'glass',

	/** @deprecated Use `Solid` (the default). */
	Bold = 'bold',
	/** @deprecated Use `Soft`. */
	Subtle = 'subtle',
	/** @deprecated Use `Link`. */
	Text = 'text',
	/** @deprecated Use `Ghost`. */
	Nav = 'nav',
	/** @deprecated Use `Ghost` with the `iconOnly` prop. */
	Icon = 'icon',
	/** @deprecated Use `tone="success"` (with the default solid variant). */
	Success = 'success',
	/** @deprecated Use `tone="danger"` (with the default solid variant). */
	Danger = 'danger',
}

/**
 * Semantic color of the button, orthogonal to {@link ButtonVariant}.
 *
 * When omitted, `solid` and `link` buttons default to `primary` (they carry
 * the action), while `soft`, `outline`, `ghost` and `glass` default to
 * `neutral` (they are chrome).
 */
export enum ButtonTone {
	/** Brand color — the main action. */
	Primary = 'primary',
	/** Text-colored chrome; as `solid`, a high-contrast inverse button. */
	Neutral = 'neutral',
	/** Confirmations and positive actions. */
	Success = 'success',
	/** Destructive actions. */
	Danger = 'danger',
}

/** Size presets for padding and font size. */
export enum ButtonSize {
	Small = 'sm',
	Medium = 'md',
	Large = 'lg',
}

type ButtonVariantInput = ButtonVariant | `${ButtonVariant}`
type ButtonToneInput = ButtonTone | `${ButtonTone}`
type ButtonSizeInput = ButtonSize | `${ButtonSize}`

/** The six current weights, after legacy aliases resolve. */
type ResolvedVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'glass'

const LEGACY_VARIANTS: Record<string, { variant: ResolvedVariant; tone?: ButtonTone; icon?: boolean }> = {
	bold: { variant: 'solid', tone: ButtonTone.Primary },
	subtle: { variant: 'soft' },
	text: { variant: 'link', tone: ButtonTone.Primary },
	nav: { variant: 'ghost' },
	icon: { variant: 'ghost', icon: true },
	success: { variant: 'solid', tone: ButtonTone.Success },
	danger: { variant: 'solid', tone: ButtonTone.Danger },
}

/**
 * Resolve a possibly-legacy `variant` plus an optional explicit `tone` into
 * the weight × tone pair the stylesheet is keyed on. Exported for tooling
 * and tests; apps normally never need it.
 */
export function resolveButtonStyle(
	variant: ButtonVariantInput,
	tone?: ButtonToneInput
): { variant: ResolvedVariant; tone: ButtonTone; icon: boolean } {
	const legacy = LEGACY_VARIANTS[variant as string]
	const resolvedVariant = (legacy?.variant ?? variant) as ResolvedVariant
	const defaultTone =
		resolvedVariant === 'solid' || resolvedVariant === 'link' ? ButtonTone.Primary : ButtonTone.Neutral
	return {
		variant: resolvedVariant,
		tone: (tone as ButtonTone) ?? legacy?.tone ?? defaultTone,
		icon: legacy?.icon ?? false,
	}
}

/** Hotkey shorthand — `action` is optional because the button's own click is the action. */
export type ButtonHotkey = string | (Omit<HotkeyConfig, 'action'> & { action?: () => void })

/** Props for {@link Button}. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual weight. Legacy v0.6 names are accepted and mapped. @default 'solid' */
	variant?: ButtonVariantInput
	/**
	 * Semantic color. @default 'primary' for solid/link, 'neutral' otherwise
	 */
	tone?: ButtonToneInput
	/** Size preset. @default 'md' */
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
 * The Buzz UI button. Two orthogonal axes — `variant` (visual weight) ×
 * `tone` (semantic color) — cover every combination the old flat variant
 * list did, and more. Styled entirely by the shipped stylesheet (CSS
 * transitions handle hover/press feedback — no animation library, no runtime
 * style computation, SSR-clean output).
 *
 * @example
 * <Button>Save</Button>                        // solid primary
 * <Button variant="outline">Cancel</Button>    // outlined neutral
 * <Button tone="danger">Delete</Button>        // solid danger
 * <Button variant="soft" tone="success">Approve</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		className,
		variant = ButtonVariant.Solid,
		tone,
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

	const resolved = resolveButtonStyle(variant, tone)
	const isIcon = iconOnly || resolved.icon
	const sharedProps = {
		className: cx('bz-button', className),
		'data-variant': resolved.variant,
		'data-tone': resolved.tone as string,
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
