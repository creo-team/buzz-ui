import { Card } from '@creo-team/buzz-ui/client'
import { Alert } from '@creo-team/buzz-ui/client'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function AlertDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Alert</h1>
			<Card>
				<div className="grid gap-3">
					<Alert variant="info" header="Heads up">Informational alert message.</Alert>
					<Alert variant="success" header="All good">Everything saved successfully.</Alert>
					<Alert variant="warning" header="Careful">This action could have side effects.</Alert>
					<Alert variant="danger" header="Error">There was a problem processing your request.</Alert>
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Alert } from '@creo-team/buzz-ui/client'

<Alert variant="info" header="Heads up">Informational message</Alert>`} />
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: alerts should use role="status" or role="alert" depending on urgency.</p>
			<p className="mt-4 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/alert/api">/components/alert/api</Link></p>
		</div>
	)
}

