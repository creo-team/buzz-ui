"use client"
import React from 'react'
import { Card, TextInput, Textarea, Select, RadioGroup, Checkbox } from '@creo-team/buzz-ui/server'
import { Button } from '@creo-team/buzz-ui/client'
import { z } from 'zod'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

const schema = z.object({
	email: z.string().email('Enter a valid email'),
	role: z.string().min(1, 'Pick a role'),
	plan: z.enum(['free', 'pro', 'enterprise']),
	agree: z.boolean().refine(v => v, 'You must agree to continue'),
	message: z.string().min(10, 'Message must be at least 10 chars'),
})

type FormData = z.infer<typeof schema>

export default function FormsValidationDocs() {
	const [data, setData] = React.useState<FormData>({ email: '', role: '', plan: 'free', agree: false, message: '' })
	const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({})

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setData(prev => ({ ...prev, [key]: value }))
	}

	function submit(e: React.FormEvent) {
		e.preventDefault()
		const res = schema.safeParse(data)
		if (!res.success) {
			const errs: Partial<Record<keyof FormData, string>> = {}
			for (const issue of res.error.issues) {
				const k = issue.path[0] as keyof FormData
				errs[k] = issue.message
			}
			setErrors(errs)
			return
		}
		setErrors({})
		// Show simple alert instead of toast for now
		alert('Submitted successfully')
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Forms & Validation</h1>
			<form onSubmit={submit} className="mt-4 grid gap-4">
				<Card>
					<div className="grid gap-3">
						<TextInput label="Email" placeholder="you@example.com" value={data.email} onChange={e => set('email', e.currentTarget.value)} className={errors.email ? 'border-red-500' : ''} />
						<Select label="Role" value={data.role} onChange={e => set('role', e.currentTarget.value)} className={errors.role ? 'border-red-500' : ''}>
							<option value="" disabled>Select one</option>
							<option value="dev">Developer</option>
							<option value="designer">Designer</option>
							<option value="pm">Product Manager</option>
						</Select>
						<RadioGroup
							label="Plan"
							name="plan"
							options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'enterprise', label: 'Enterprise' }]}
							value={data.plan}
							onChange={v => set('plan', v as FormData['plan'])}
						/>
						<Textarea label="Message" rows={4} placeholder="Tell us more..." value={data.message} onChange={e => set('message', e.currentTarget.value)} className={errors.message ? 'border-red-500' : ''} />
						<Checkbox label="I agree to the terms" checked={data.agree} onChange={e => set('agree', e.currentTarget.checked)} />
					</div>
				</Card>
				<div className="flex gap-2">
					<Button type="submit">Submit</Button>
					<Button variant="subtle" type="button" onClick={() => { setData({ email: '', role: '', plan: 'free', agree: false, message: '' }); setErrors({}) }}>Reset</Button>
				</div>
				{Object.values(errors).length > 0 && (
					<Card>
						<ul className="list-disc pl-4 text-sm text-red-300">
							{Object.entries(errors).map(([k, v]) => v && <li key={k}>{v}</li>)}
						</ul>
					</Card>
				)}
			</form>
		</div>
	)
}
