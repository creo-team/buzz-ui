"use client"
import React from 'react'
import { Card, TextInput, Textarea, Select, RadioGroup, Checkbox, PageHeader } from '@creo-team/buzz-ui/server'
import { Form, Button, type FormValues } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import Link from 'next/link'
import { z } from 'zod'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

// Zod slots straight into Form's per-field validators — browser constraint
// validation handles the required/empty cases first, zod refines the rest.
const email = z.string().email('Enter a valid email address.')
const message = z.string().min(10, 'Tell us a little more — at least 10 characters.')

const zodMessage = (schema: z.ZodType, value: unknown) =>
	schema.safeParse(value).error?.issues[0]?.message

export default function FormsValidationDocs() {
	const [submitted, setSubmitted] = React.useState<FormValues | null>(null)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<PageHeader
				title="Forms & Validation"
				description="Problems are caught before submission and shown inline at the fields — not collected in a summary box, not thrown as toasts. Submit the empty form to see it."
			/>

			<Form
				className="mt-8 grid gap-4"
				validate={{
					email: value => zodMessage(email, value),
					message: value => zodMessage(message, value),
				}}
				onSubmit={values => setSubmitted(values)}
			>
				<Card>
					<div className="grid gap-3">
						<TextInput name="email" label="Email" type="email" required placeholder="you@example.com" />
						<Select name="role" label="Role" required defaultValue="">
							<option value="" disabled>
								Select one
							</option>
							<option value="dev">Developer</option>
							<option value="designer">Designer</option>
							<option value="pm">Product Manager</option>
						</Select>
						<RadioGroup
							label="Plan"
							name="plan"
							defaultValue="free"
							options={[
								{ value: 'free', label: 'Free' },
								{ value: 'pro', label: 'Pro' },
								{ value: 'enterprise', label: 'Enterprise' },
							]}
						/>
						<Textarea name="message" label="Message" rows={4} required placeholder="Tell us more..." helpText="At least 10 characters." />
						<Checkbox name="agree" label="I agree to the terms" required />
					</div>
				</Card>
				<div className="flex items-center gap-2">
					<Button type="submit">Submit</Button>
					<Button variant="soft" type="reset" onClick={() => setSubmitted(null)}>
						Reset
					</Button>
					{submitted && (
						<span className="text-sm text-[var(--c-success)]" role="status">
							Submitted — thanks, {String(submitted.email)}!
						</span>
					)}
				</div>
			</Form>

			<Card className="mt-8" header="How this works">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Every control just has a <code>name</code> — no controlled state, no error threading. The{' '}
					<code>Form</code> runs browser constraint validation first (<code>required</code>,{' '}
					<code>type="email"</code>…), then the zod-backed <code>validate</code> functions, and
					renders each problem under its own field. After the first attempt, errors clear live as
					you fix them.
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`const email = z.string().email('Enter a valid email address.')
const zodMessage = (schema, value) => schema.safeParse(value).error?.issues[0]?.message

<Form
  validate={{ email: value => zodMessage(email, value) }}
  onSubmit={values => api.contact(values)}
>
  <TextInput name="email" label="Email" type="email" required />
  <Checkbox name="agree" label="I agree to the terms" required />
  <Button type="submit">Submit</Button>
</Form>`}
					/>
				</div>
				<p className="mt-4 text-sm text-[var(--c-text-secondary)]">
					Full contract — focus management, cross-field rules, custom controls — on the{' '}
					<Link className="text-[var(--c-primary)] hover:underline" href="/components/form">
						Form page
					</Link>
					.
				</p>
			</Card>
		</div>
	)
}
