"use client"
import { Card, Tabs } from '@creo-team/buzz-ui/server'
import React from 'react'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function TabsDocs() {
	const [tab, setTab] = React.useState('overview')
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Tabs</h1>
			<Card>
				<div className="space-y-3">
					<Tabs items={[{ key: 'overview', label: 'Overview' }, { key: 'details', label: 'Details' }]} value={tab} onChange={setTab} />
					<div className="rounded-md border border-[var(--c-border)] p-3 text-sm text-white/80">
						{tab === 'overview' ? 'Overview content' : 'Details content'}
					</div>
					<div className="mt-4">
						<CodeBlock code={`import { Tabs } from '@creo-team/buzz-ui/server'

const [tab, setTab] = useState('overview')
<Tabs items={[{ key: 'overview', label: 'Overview' }]} value={tab} onChange={setTab} />`} />
					</div>
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: ensure tabs are reachable by keyboard and the active tab is visually indicated.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/tabs/api">/components/tabs/api</Link></p>
		</div>
	)
}

