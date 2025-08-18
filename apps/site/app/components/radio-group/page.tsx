import { Card, RadioGroup } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function RadioGroupDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">RadioGroup</h1>
			<p className="mt-2 text-sm text-white/70">A labeled set of radio options.</p>
			<Card>
				<RadioGroup
					label="Subscription"
					name="sub"
					options={[
						{ value: 'free', label: 'Free' },
						{ value: 'pro', label: 'Pro' },
						{ value: 'enterprise', label: 'Enterprise' },
					]}
				/>
				<div className="mt-4">
					<CodeBlock code={`import { RadioGroup } from '@creo-team/buzz-ui/server'

<RadioGroup label="Plan" name="plan" options={[{ value: 'free', label: 'Free' }]} />`} />
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: group with a visible label; ensure each radio has a unique id; focus is managed by the browser.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/radio-group/api">/components/radio-group/api</Link></p>
		</div>
	)
}


