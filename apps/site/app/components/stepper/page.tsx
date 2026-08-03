"use client"
import React from 'react'
import { Card, Stepper } from '@creo-team/buzz-ui/server'
import { Button } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

const steps = [
	{ key: 'account', label: 'Account', description: 'Sign-in details' },
	{ key: 'profile', label: 'Profile', description: 'About you' },
	{ key: 'review', label: 'Review', description: 'Confirm everything' },
]

export default function StepperDocs() {
	const [index, setIndex] = React.useState(1)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Stepper</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Multi-step progress indicator. Completed steps render a check, the current step is
				announced with <code>aria-current="step"</code>, and completed/upcoming states carry
				screen-reader text.
			</p>

			<Card className="mt-6" header="Horizontal">
				<Stepper steps={steps} current={steps[index].key} />
				<div className="mt-6 flex gap-2">
					<Button variant="outline" size="sm" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>
						Back
					</Button>
					<Button size="sm" disabled={index === steps.length - 1} onClick={() => setIndex(i => i + 1)}>
						Next
					</Button>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Stepper } from '@creo-team/buzz-ui/server'

<Stepper
	steps={[
		{ key: 'account', label: 'Account' },
		{ key: 'profile', label: 'Profile' },
		{ key: 'review', label: 'Review' },
	]}
	current="profile"
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Vertical with descriptions">
				<Stepper steps={steps} current={steps[index].key} orientation="vertical" />
				<div className="mt-4">
					<CodeBlock
						code={`<Stepper steps={steps} current="profile" orientation="vertical" />`}
					/>
				</div>
			</Card>
		</div>
	)
}
