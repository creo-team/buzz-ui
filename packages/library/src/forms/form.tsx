"use client"
import * as React from 'react'

/** Field errors keyed by control `name`. */
export type FormErrors = Record<string, string>

/**
 * Submitted values keyed by control `name`. Multi-value controls (checkbox
 * groups, multi-selects) yield arrays; file inputs yield `File`s.
 */
export type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>

/**
 * A per-field validator. Return an error message to block submission, or
 * nothing when the value is fine. Receives every field's value, so
 * cross-field rules (password confirmation, date ranges) are one-liners.
 */
export type FieldValidator = (
	value: FormDataEntryValue | FormDataEntryValue[] | undefined,
	values: FormValues
) => string | undefined | null

interface FormContextValue {
	errors: FormErrors
}

const FormContext = React.createContext<FormContextValue | null>(null)

/**
 * Read the surrounding `<Form>`'s validation error for a named control.
 * Buzz UI controls consume this automatically (via {@link FormFieldError});
 * call it directly when building a custom control that should surface
 * form-level errors inline. Outside a Form it returns no error.
 */
export function useFormField(name?: string): { error: string | undefined } {
	const context = React.useContext(FormContext)
	return { error: name ? context?.errors[name] : undefined }
}

export interface FormFieldErrorProps {
	/** The control's `name` — the key errors are stored under. */
	name?: string
	/** The control's DOM id, used to sync aria-invalid/aria-describedby onto it. */
	htmlFor?: string
}

/**
 * Inline slot that renders the surrounding `<Form>`'s error for one field —
 * the piece that lets server-rendered controls (TextInput, Select…) show
 * client-born validation errors without becoming client components
 * themselves. Renders nothing until the form reports an error for `name`,
 * then shows the message in Field's message style and mirrors the invalid
 * state onto the control element (aria-invalid, data-tone, aria-describedby),
 * restoring the previous attribute values when the error clears.
 */
export function FormFieldError({ name, htmlFor }: FormFieldErrorProps) {
	const { error } = useFormField(name)
	const messageId = htmlFor ? `${htmlFor}-form-error` : undefined

	React.useEffect(() => {
		if (!error || !htmlFor || !messageId) return
		const control = document.getElementById(htmlFor)
		if (!control) return

		const previous = {
			invalid: control.getAttribute('aria-invalid'),
			tone: control.getAttribute('data-tone'),
			describedBy: control.getAttribute('aria-describedby'),
		}
		control.setAttribute('aria-invalid', 'true')
		control.setAttribute('data-tone', 'error')
		const ids = new Set((previous.describedBy ?? '').split(' ').filter(Boolean))
		ids.add(messageId)
		control.setAttribute('aria-describedby', Array.from(ids).join(' '))

		return () => {
			const restore = (attribute: string, value: string | null) => {
				if (value === null) control.removeAttribute(attribute)
				else control.setAttribute(attribute, value)
			}
			restore('aria-invalid', previous.invalid)
			restore('data-tone', previous.tone)
			restore('aria-describedby', previous.describedBy)
		}
	}, [error, htmlFor, messageId])

	if (!error) return null
	return (
		<div id={messageId} className="bz-field__message" data-tone="error" role="alert">
			{error}
		</div>
	)
}

export interface FormProps
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'noValidate'> {
	/**
	 * Called with the collected values only after every field passes
	 * validation — invalid submissions never reach it. Omit it when using
	 * `action` (e.g. a server action): validation still gates the native
	 * submission.
	 */
	onSubmit?: (values: FormValues, event: React.FormEvent<HTMLFormElement>) => void
	/**
	 * Custom validators keyed by control `name`, run after the browser's own
	 * constraint validation (required, type, minLength, pattern…).
	 */
	validate?: Record<string, FieldValidator>
	/** Observe the error map as it changes (analytics, submit-button state…). */
	onValidityChange?: (errors: FormErrors) => void
	children?: React.ReactNode
}

function readValues(form: HTMLFormElement): FormValues {
	const data = new FormData(form)
	const values: FormValues = {}
	for (const key of new Set(data.keys())) {
		const all = data.getAll(key)
		values[key] = all.length > 1 ? all : all[0]
	}
	return values
}

type NamedControl = HTMLElement & {
	name?: string
	disabled?: boolean
	type?: string
	willValidate?: boolean
	validity?: ValidityState
	validationMessage?: string
	focus: (options?: FocusOptions) => void
}

function collectErrors(form: HTMLFormElement, validate?: Record<string, FieldValidator>): FormErrors {
	const values = readValues(form)
	const errors: FormErrors = {}
	const seen = new Set<string>()
	for (const element of Array.from(form.elements) as NamedControl[]) {
		const name = element.name
		if (!name || seen.has(name) || element.disabled) continue
		seen.add(name)
		// Browser constraint validation first — required, type=email, pattern,
		// min/maxLength… — with the browser's own localized message.
		if (element.willValidate && element.validity && !element.validity.valid) {
			errors[name] = element.validationMessage || 'Invalid value'
			continue
		}
		const validator = validate?.[name]
		if (validator) {
			const message = validator(values[name], values)
			if (message) errors[name] = message
		}
	}
	return errors
}

function sameErrors(a: FormErrors, b: FormErrors): boolean {
	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)
	return aKeys.length === bKeys.length && aKeys.every(key => a[key] === b[key])
}

/**
 * A form that catches validation problems before submission, inline at the
 * fields — never as after-the-fact toasts.
 *
 * The contract ("reward early, punish late"): typing is never interrupted
 * before the first submit attempt; an invalid submit blocks `onSubmit`,
 * renders each problem under its field, and focuses the first invalid
 * control; from then on fields re-validate as they change, so errors
 * disappear the moment they're fixed.
 *
 * Fields need no registration — any control with a `name` participates,
 * including native inputs. Browser constraint validation (required,
 * type=email, minLength, pattern…) runs first, then per-field `validate`
 * functions, which also receive every other value for cross-field rules.
 *
 * @example
 * <Form
 *   onSubmit={values => api.signUp(values)}
 *   validate={{
 *     confirm: (value, values) =>
 *       value !== values.password ? 'Passwords do not match' : undefined,
 *   }}
 * >
 *   <TextInput name="email" label="Email" type="email" required />
 *   <TextInput name="password" label="Password" type="password" required minLength={8} />
 *   <TextInput name="confirm" label="Confirm password" type="password" required />
 *   <Button type="submit">Create account</Button>
 * </Form>
 */
export function Form({ onSubmit, validate, onValidityChange, children, ...props }: FormProps) {
	const [errors, setErrors] = React.useState<FormErrors>({})
	const attempted = React.useRef(false)

	const applyErrors = React.useCallback(
		(next: FormErrors) => {
			setErrors(previous => {
				if (sameErrors(previous, next)) return previous
				onValidityChange?.(next)
				return next
			})
		},
		[onValidityChange]
	)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const form = event.currentTarget
		const nextErrors = collectErrors(form, validate)
		attempted.current = true

		if (Object.keys(nextErrors).length > 0) {
			event.preventDefault()
			applyErrors(nextErrors)
			// Focus the first invalid control in DOM order; skip unfocusable
			// carriers like a Combobox's hidden input.
			for (const element of Array.from(form.elements) as NamedControl[]) {
				if (element.name && nextErrors[element.name] && element.type !== 'hidden') {
					element.focus()
					break
				}
			}
			return
		}

		applyErrors({})
		if (onSubmit) {
			event.preventDefault()
			onSubmit(readValues(form), event)
		}
		// Without onSubmit, the native submission (e.g. `action`) proceeds —
		// validation has already gated it.
	}

	// After the first failed attempt, every change re-validates the whole
	// form (not just the changed field) so cross-field rules stay honest —
	// fixing the password also clears a stale "passwords do not match" on
	// the confirmation field.
	const revalidate = (event: React.FormEvent<HTMLFormElement>) => {
		if (!attempted.current) return
		applyErrors(collectErrors(event.currentTarget, validate))
	}

	// A native reset returns the form to its pristine state — including the
	// validation lifecycle, or cleared fields would flash "required" errors.
	const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
		attempted.current = false
		applyErrors({})
		props.onReset?.(event)
	}

	const context = React.useMemo(() => ({ errors }), [errors])

	return (
		<FormContext.Provider value={context}>
			<form
				noValidate
				onSubmit={handleSubmit}
				onInput={revalidate}
				onChange={revalidate}
				{...props}
				onReset={handleReset}
			>
				{children}
			</form>
		</FormContext.Provider>
	)
}
