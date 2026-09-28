"use client"
import React from 'react'
import { Card, Section, PageHeader, Button } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function SectionDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<PageHeader
				title="Section & PageHeader"
				description="The standard page bones: full-bleed bands with width-capped columns, and one consistent heading block — instead of every page hand-rolling its own."
			/>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">PageHeader</h2>
			<Card className="mt-4" header="Page title with actions">
				<div className="rounded-lg border border-[var(--c-border)] p-6">
					<PageHeader
						eyebrow="Settings / Team"
						title="Members"
						description="Everyone with access to this workspace."
						actions={
							<>
								<Button variant="outline" size="sm">
									Export
								</Button>
								<Button size="sm">Invite</Button>
							</>
						}
						divider
					/>
				</div>
				<div className="mt-6">
					<CodeBlock
						code={`import { PageHeader, Button } from '@creo-team/buzz-ui/server'

<PageHeader
  eyebrow="Settings / Team"
  title="Members"
  description="Everyone with access to this workspace."
  actions={<><Button variant="outline" size="sm">Export</Button><Button size="sm">Invite</Button></>}
  divider
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Scales and levels">
				<div className="space-y-8 rounded-lg border border-[var(--c-border)] p-6">
					<PageHeader size="lg" title="Landing hero" description="clamp()-sized with tight tracking." />
					<PageHeader size="md" level={2} title="Page title" description="The default scale." />
					<PageHeader size="sm" level={3} title="Section heading" description="For headers inside a page." />
				</div>
				<p className="mt-4 text-sm text-[var(--c-text-secondary)]">
					<code>size</code> is visual; <code>level</code> sets the heading element — keep one{' '}
					<code>h1</code> per page and pick sizes freely.
				</p>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Section</h2>
			<Card className="mt-4" header="Alternating bands">
				<div className="overflow-hidden rounded-lg border border-[var(--c-border)]">
					<Section padding="compact">
						<PageHeader size="sm" level={3} align="center" title="Default band" description="Page background." />
					</Section>
					<Section variant="muted" padding="compact">
						<PageHeader size="sm" level={3} align="center" title="Muted band" description="Secondary surface." />
					</Section>
					<Section variant="raised" padding="compact">
						<PageHeader size="sm" level={3} align="center" title="Raised band" description="Surface with hairline borders." />
					</Section>
				</div>
				<div className="mt-6">
					<CodeBlock
						code={`import { Section } from '@creo-team/buzz-ui/server'

<Section width="wide" padding="spacious">…hero…</Section>
<Section variant="muted" width="wide" padding="spacious">…features…</Section>
<Section width="narrow">…prose…</Section>`}
					/>
				</div>
				<p className="mt-4 text-sm text-[var(--c-text-secondary)]">
					This site's homepage is built from exactly these bands — no wrapper divs, no bespoke
					max-width utilities.
				</p>
			</Card>

			<ApiTable
				title="Section API"
				className="mt-12"
				rows={[
					{ prop: 'variant', type: "'default' | 'muted' | 'raised'", default: "'default'", description: 'Band surface treatment.' },
					{ prop: 'width', type: "'narrow' | 'default' | 'wide' | 'full'", default: "'default'", description: 'Inner column max-width: 42rem / 72rem / 80rem / none.' },
					{ prop: 'padding', type: "'none' | 'compact' | 'default' | 'spacious'", default: "'default'", description: 'Vertical rhythm of the band.' },
					{ prop: 'as', type: "'section' | 'div' | 'article' | 'aside'", default: "'section'", description: 'Rendered element.' },
				]}
			/>

			<ApiTable
				title="PageHeader API"
				className="mt-8"
				rows={[
					{ prop: 'title', type: 'ReactNode', required: true, description: 'The heading.' },
					{ prop: 'description', type: 'ReactNode', description: 'Supporting sentences, max-width 65ch.' },
					{ prop: 'eyebrow', type: 'ReactNode', description: 'Slot above the title — breadcrumbs, back link, label.' },
					{ prop: 'actions', type: 'ReactNode', description: 'Trailing-edge actions; wraps under the title on small screens.' },
					{ prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Type scale.' },
					{ prop: 'level', type: '1 | 2 | 3', default: '1', description: 'Heading element, independent of size.' },
					{ prop: 'align', type: "'start' | 'center'", default: "'start'", description: 'Center for landing-page section headers.' },
					{ prop: 'divider', type: 'boolean', default: 'false', description: 'Hairline rule under the header.' },
				]}
			/>
		</div>
	)
}
