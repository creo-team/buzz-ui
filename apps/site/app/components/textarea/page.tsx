import { Card, Textarea } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function TextareaDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Textarea</h1>
			<p className="mt-2 text-sm text-white/70">A multi-line text input.</p>
			<Card className="mt-4">
				<div className="grid gap-3">
					<Textarea label="Message" placeholder="Write your message..." rows={4} />
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Textarea } from '@creo-team/buzz-ui/server'

<Textarea label="Message" rows={4} />`} />
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: associate labels; use aria-invalid for errors; consider character counters for limits.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/textarea/api">/components/textarea/api</Link></p>
		</div>
	)
}


