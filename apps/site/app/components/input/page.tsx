import { Card, TextInput } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function InputDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">TextInput</h1>
			<p className="mt-2 text-sm text-white/70">A basic text input with label and helper text.</p>
			<Card>
				<div className="grid gap-3">
					<TextInput label="Email" type="email" placeholder="you@example.com" />
					<TextInput label="Disabled" placeholder="Cannot edit" disabled />
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { TextInput } from '@creo-team/buzz-ui/server'

<TextInput label="Email" placeholder="you@example.com" />`} />
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: labels should be associated; use aria-invalid for errors.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/input/api">/components/input/api</Link></p>
		</div>
	)
}


