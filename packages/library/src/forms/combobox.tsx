"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Portal } from '../internal/portal.js'
import { useComposedRefs } from '../internal/compose-refs.js'
import { usePosition } from '../internal/use-position.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'
import { usePresence } from '../internal/use-presence.js'
import { useControllableState } from '../internal/use-controllable-state.js'
import { useIsomorphicLayoutEffect } from '../internal/use-isomorphic-layout-effect.js'
import { IconCheck, IconChevronDown, IconX } from '../internal/icons.js'
import { Field, fieldDescribedBy } from './field.js'

export interface ComboboxOption {
	value: string
	label: string
	description?: string
	icon?: React.ReactNode
	disabled?: boolean
}

export type ComboboxFilter = (option: ComboboxOption, query: string) => boolean

export interface ComboboxProps {
	options: ComboboxOption[]
	/** Controlled selected value (an option's `value`, or `null` for none). */
	value?: string | null
	/** Initial value for uncontrolled usage. */
	defaultValue?: string | null
	onChange?: (value: string | null) => void
	/** Fires on every keystroke — hook up your own debounced fetch for async options. */
	onInputChange?: (query: string) => void
	/** Custom match function. Default: case-insensitive substring on `label`. */
	filter?: ComboboxFilter
	placeholder?: string
	label?: React.ReactNode
	required?: boolean
	error?: string
	helpText?: React.ReactNode
	emptyMessage?: string
	/** Show a spinner in place of the chevron (e.g. while `options` load async). */
	loading?: boolean
	/** Show a clear (×) button once a value is selected. Default true. */
	clearable?: boolean
	disabled?: boolean
	/** Renders a hidden input so the selection participates in native form submission. */
	name?: string
	id?: string
	className?: string
	wrapperClassName?: string
}

const defaultFilter: ComboboxFilter = (option, query) => option.label.toLowerCase().includes(query.toLowerCase())

/**
 * Filterable single-select combobox (WAI-ARIA combobox + listbox pattern)
 * built on the same overlay engine as Dropdown: portal, collision-aware
 * positioning, and the shared layer stack for Escape/outside-press dismissal.
 *
 * Focusing shows every option; typing filters them (case-insensitive
 * substring by default, or pass `filter` — e.g. to defer to server-side
 * search). Closing without selecting reverts the typed text back to the
 * current selection so the field never shows a dangling, uncommitted string.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
	{
		options,
		value,
		defaultValue = null,
		onChange,
		onInputChange,
		filter,
		placeholder,
		label,
		required,
		error,
		helpText,
		emptyMessage = 'No results found.',
		loading = false,
		clearable = true,
		disabled = false,
		name,
		id,
		className,
		wrapperClassName,
	},
	forwardedRef
) {
	const baseId = React.useId()
	const inputId = id ?? baseId
	const listboxId = `${inputId}-listbox`

	const [committedValue, setCommittedValue] = useControllableState<string | null>({
		value,
		defaultValue,
		onChange,
	})
	const selectedOption = options.find(option => option.value === committedValue) ?? null

	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState(selectedOption?.label ?? '')
	const [query, setQuery] = React.useState('')
	const [activeIndex, setActiveIndex] = React.useState(0)
	const [width, setWidth] = React.useState<number>()

	const wrapperRef = React.useRef<HTMLDivElement>(null)
	const inputRef = React.useRef<HTMLInputElement>(null)
	const listboxRef = React.useRef<HTMLDivElement>(null)
	const ref = useComposedRefs(forwardedRef, inputRef)

	// External/controlled selection changes (including a fresh commit) sync
	// the display text. Keyed on the label string, not the option object, so
	// this never fires mid-typing — only when the *committed* selection
	// actually changes.
	React.useEffect(() => {
		setInputValue(selectedOption?.label ?? '')
	}, [selectedOption?.label])

	const mounted = usePresence(open, 120)
	const { x, y, ready } = usePosition(wrapperRef, listboxRef, {
		open: mounted,
		side: 'bottom',
		align: 'start',
		sideOffset: 4,
	})

	useIsomorphicLayoutEffect(() => {
		if (!open) return
		const el = wrapperRef.current
		if (!el) return
		const measure = () => setWidth(el.getBoundingClientRect().width)
		measure()
		if (typeof ResizeObserver === 'undefined') return
		const observer = new ResizeObserver(measure)
		observer.observe(el)
		return () => observer.disconnect()
	}, [open])

	const close = React.useCallback(() => {
		setOpen(false)
		setInputValue(selectedOption?.label ?? '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOption])

	useDismissableLayer({
		enabled: open,
		onDismiss: close,
		refs: [wrapperRef, listboxRef],
	})

	const filtered = React.useMemo(() => {
		if (!query) return options
		const test = filter ?? defaultFilter
		return options.filter(option => test(option, query))
	}, [options, query, filter])

	// Keyboard navigation moves through enabled options only — matches
	// Dropdown's own precedent of skipping disabled items entirely rather
	// than landing on one that Enter/click can't select.
	const enabledFiltered = React.useMemo(() => filtered.filter(option => !option.disabled), [filtered])

	React.useEffect(() => {
		setActiveIndex(0)
	}, [query])

	const activeOption = enabledFiltered[activeIndex]

	React.useEffect(() => {
		if (!open || !activeOption) return
		document.getElementById(`${baseId}-option-${activeOption.value}`)?.scrollIntoView({ block: 'nearest' })
	}, [open, activeIndex, activeOption, baseId])

	const openList = () => {
		if (open || disabled) return
		setOpen(true)
		setQuery('')
		setActiveIndex(0)
	}

	const selectOption = (option: ComboboxOption) => {
		if (option.disabled) return
		setCommittedValue(option.value)
		setInputValue(option.label)
		setOpen(false)
	}

	const handleClear = (event: React.MouseEvent) => {
		event.stopPropagation()
		setCommittedValue(null)
		setInputValue('')
		inputRef.current?.focus()
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const next = event.target.value
		setInputValue(next)
		setQuery(next)
		onInputChange?.(next)
		if (!open) setOpen(true)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				if (!open) openList()
				else setActiveIndex(index => Math.min(index + 1, enabledFiltered.length - 1))
				break
			case 'ArrowUp':
				event.preventDefault()
				if (!open) openList()
				else setActiveIndex(index => Math.max(index - 1, 0))
				break
			case 'Home':
				if (open) {
					event.preventDefault()
					setActiveIndex(0)
				}
				break
			case 'End':
				if (open) {
					event.preventDefault()
					setActiveIndex(Math.max(enabledFiltered.length - 1, 0))
				}
				break
			case 'Enter':
				if (open && activeOption) {
					event.preventDefault()
					selectOption(activeOption)
				}
				break
			case 'Tab':
				if (open) close()
				break
		}
	}

	return (
		<Field htmlFor={inputId} label={label} required={required} error={error} helpText={helpText} className={wrapperClassName}>
			<div ref={wrapperRef} className="bz-combobox">
				<input
					ref={ref}
					id={inputId}
					type="text"
					role="combobox"
					aria-expanded={open}
					aria-controls={listboxId}
					aria-activedescendant={open && activeOption ? `${baseId}-option-${activeOption.value}` : undefined}
					aria-autocomplete="list"
					aria-invalid={error ? true : undefined}
					aria-describedby={fieldDescribedBy(inputId, { error, helpText })}
					className={cx('bz-combobox__input', className)}
					data-tone={error ? 'error' : undefined}
					placeholder={placeholder}
					value={inputValue}
					disabled={disabled}
					autoComplete="off"
					onFocus={openList}
					onClick={openList}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				/>
				{clearable && committedValue != null && !disabled && (
					<button
						type="button"
						className="bz-combobox__clear"
						aria-label="Clear selection"
						tabIndex={-1}
						onClick={handleClear}
					>
						<IconX />
					</button>
				)}
				<span className="bz-combobox__chevron" data-open={open || undefined} aria-hidden="true">
					{loading ? <span className="bz-combobox__spinner" /> : <IconChevronDown />}
				</span>
				<div className="bz-visually-hidden" role="status" aria-live="polite">
					{open ? (filtered.length === 0 ? emptyMessage : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`) : ''}
				</div>
				{mounted && (
					<Portal>
						<div
							ref={listboxRef}
							id={listboxId}
							role="listbox"
							aria-label={typeof label === 'string' ? label : 'Options'}
							className="bz-combobox__listbox"
							data-state={open ? 'open' : 'closed'}
							style={{ position: 'fixed', left: x, top: y, minWidth: width, visibility: ready ? undefined : 'hidden' }}
						>
							{filtered.length === 0 ? (
								<div className="bz-combobox__empty">{emptyMessage}</div>
							) : (
								filtered.map(option => {
									const isActive = option.value === activeOption?.value
									const isSelected = option.value === committedValue
									return (
										<div
											key={option.value}
											id={`${baseId}-option-${option.value}`}
											role="option"
											aria-selected={isSelected}
											aria-disabled={option.disabled || undefined}
											className="bz-combobox__option"
											data-active={isActive || undefined}
											data-disabled={option.disabled || undefined}
											onPointerMove={() => {
												if (option.disabled) return
												const enabledIndex = enabledFiltered.findIndex(o => o.value === option.value)
												if (enabledIndex !== -1) setActiveIndex(enabledIndex)
											}}
											onClick={() => selectOption(option)}
										>
											{option.icon != null && <span className="bz-combobox__option-icon">{option.icon}</span>}
											<span className="bz-combobox__option-text">
												<span className="bz-combobox__option-label">{option.label}</span>
												{option.description && (
													<span className="bz-combobox__option-description">{option.description}</span>
												)}
											</span>
											{isSelected && <IconCheck className="bz-combobox__option-check" aria-hidden="true" />}
										</div>
									)
								})
							)}
						</div>
					</Portal>
				)}
			</div>
			{name && <input type="hidden" name={name} value={committedValue ?? ''} />}
		</Field>
	)
})
