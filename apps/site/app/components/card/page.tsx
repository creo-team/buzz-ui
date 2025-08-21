import { Card } from '@creo-team/buzz-ui/client'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { Button as BuzzButton } from '@creo-team/buzz-ui/client'

export default function CardDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Card</h1>
			<p className="mt-2 text-sm text-white/70">A lightweight container with optional header and actions.</p>
			<h2 className="mt-6 text-lg font-semibold">Usage</h2>
			<Card header="Header" actions={<BuzzButton variant="subtle">Action</BuzzButton>}>
				<p className="text-sm text-white/80">Content inside a card.</p>
				<div className="mt-4">
					<CodeBlock code={`import { Card } from '@creo-team/buzz-ui/client'

<Card header="Header" actions={<BuzzButton variant="subtle">Action</BuzzButton>}>
  Content
</Card>`} />
				</div>
			</Card>
			<h2 className="mt-8 text-lg font-semibold">API</h2>
			<table className="mt-2 w-full text-left text-sm">
				<thead>
					<tr className="text-white/60">
						<th className="py-2 pr-4">Prop</th>
						<th className="py-2 pr-4">Type</th>
						<th className="py-2">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="py-2 pr-4">header</td>
						<td className="py-2 pr-4">React.ReactNode</td>
						<td className="py-2">Optional header content</td>
					</tr>
					<tr>
						<td className="py-2 pr-4">actions</td>
						<td className="py-2 pr-4">React.ReactNode</td>
						<td className="py-2">Right-aligned action area</td>
					</tr>
				</tbody>
			</table>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/card/api">/components/card/api</Link></p>
		</div>
	)
}

