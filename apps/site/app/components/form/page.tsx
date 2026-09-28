"use client"
import React from 'react'
import { Card, PageHeader, TextInput, Checkbox } from '@creo-team/buzz-ui/server'
import { Form, Button, type FormValues } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

function SignUpDemo() {
	const [submitted, setSubmitted] = React.useState<FormValues | null>(null)

	return (
		<div className="max-w-sm">
			<Form
				className="space-y-4"
				onSubmit={values => setSubmitted(values)}
				validate={{
					password: value =>
						typeof value === 'string' && value.length > 0 && value.length < 8
							? 'Use at least 8 characters.'
							: undefined,
					confirm: (value, values) =>
						value !== values.password ? 'Passwords do not match.' : undefined,
				}}
			>
				<TextInput name="email" label="Email" type="email" required placeholder="you@example.com" />
				<TextInput name="password" label="Password" type="password" required helpText="At least 8 characters." />
				<TextInput name="confirm" label="Confirm password" type="password" required />
				<Checkbox name="tos" label="I accept the terms" required />
				<Button type="submit" fullWidth>
					Create account
				</Button>
			</Form>
			{submitted && (
				<p className="mt-4 text-sm text-[var(--c-success)]" role="status">
					Submitted! {String(submitted.email)} is ready to go.
				</p>
			)}
		</div>
	)
}

export default function FormDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<PageHeader
				title="Form"
				description="Validation caught before submission, inline at the fields — never as after-the-fact toasts. Try submitting the demo empty."
			/>

			<Card className="mt-8" header="Sign-up form — submit it empty">
				<SignUpDemo />
				<div className="mt-6">
					<CodeBlock
						code={`import { Form, TextInput, Checkbox, Button } from '@creo-team/buzz-ui/client'

<Form
  onSubmit={values => api.signUp(values)}   // only fires when valid
  validate={{
    password: value =>
      value.length < 8 ? 'Use at least 8 characters.' : undefined,
    confirm: (value, values) =>
      value !== values.password ? 'Passwords do not match.' : undefined,
  }}
>
  <TextInput name="email" label="Email" type="email" required />
  <TextInput name="password" label="Password" type="password" required />
  <TextInput name="confirm" label="Confirm password" type="password" required />
  <Checkbox name="tos" label="I accept the terms" required />
  <Button type="submit">Create account</Button>
</Form>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="How validation flows">
				<ul className="list-disc space-y-2 pl-5 text-sm text-[var(--c-text-secondary)]">
					<li>
						<strong className="text-[var(--c-text)]">Reward early, punish late.</strong> Typing is
						never interrupted before the first submit attempt. After a failed attempt, fields
						re-validate on every change, so errors disappear the moment they're fixed.
					</li>
					<li>
						<strong className="text-[var(--c-text)]">Browser rules first.</strong>{' '}
						<code>required</code>, <code>type="email"</code>, <code>minLength</code>,{' '}
						<code>pattern</code>… run with the browser's own localized messages, then your{' '}
						<code>validate</code> functions run per field.
					</li>
					<li>
						<strong className="text-[var(--c-text)]">Cross-field rules are one-liners.</strong>{' '}
						Validators receive every field's value — password confirmation needs no extra state,
						and fixing either side clears the error.
					</li>
					<li>
						<strong className="text-[var(--c-text)]">No registration.</strong> Any control with a{' '}
						<code>name</code> participates — Buzz UI inputs, native elements, checkbox groups
						(arrays), Combobox. The first invalid control is focused for you.
					</li>
					<li>
						<strong className="text-[var(--c-text)]">Server actions welcome.</strong> Omit{' '}
						<code>onSubmit</code> and pass <code>action</code> instead — validation still gates the
						native submission.
					</li>
				</ul>
			</Card>

			<Card className="mt-6" header="Custom controls">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Building your own control? Read the surrounding form's error for a name with{' '}
					<code>useFormField</code>, or render the standard inline message with{' '}
					<code>FormFieldError</code>:
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`import { useFormField, FormFieldError } from '@creo-team/buzz-ui/client'

function ColorPicker({ name }: { name: string }) {
  const { error } = useFormField(name)
  return (
    <div>
      <input type="color" name={name} aria-invalid={error ? true : undefined} />
      <FormFieldError name={name} />
    </div>
  )
}`}
					/>
				</div>
			</Card>

			<ApiTable
				title="API Reference"
				className="mt-12"
				rows={[
					{
						prop: 'onSubmit',
						type: '(values: FormValues, event) => void',
						description: 'Called with collected values only after every field passes. Prevents native submission.',
					},
					{
						prop: 'validate',
						type: 'Record<string, (value, values) => string | undefined>',
						description: 'Per-field validators keyed by control name, run after browser constraint validation.',
					},
					{
						prop: 'onValidityChange',
						type: '(errors: Record<string, string>) => void',
						description: 'Observes the error map as it changes.',
					},
					{
						prop: '...props',
						type: "React.FormHTMLAttributes<HTMLFormElement>",
						description: 'All standard form attributes, including action for server actions.',
					},
				]}
			/>
		</div>
	)
}
