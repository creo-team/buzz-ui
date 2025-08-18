import { Badge, Card } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function BadgeDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Badge</h1>
			<Card>
				<div className="flex flex-wrap gap-2">
					<Badge>Default</Badge>
					<Badge variant="info">Info</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="danger">Danger</Badge>
					<Badge variant="outline">Outline</Badge>
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Badge } from '@creo-team/buzz-ui/server'

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>`} />
				</div>
			</Card>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/badge/api">/components/badge/api</Link></p>
		</div>
	)
}

