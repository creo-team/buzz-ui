import { Breadcrumbs, Card } from '@creo-team/buzz-ui/server'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function BreadcrumbsDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Breadcrumbs</h1>
			<p className="mt-2 text-sm text-white/70">Hierarchical navigation indicating the current page’s location within a site.</p>
			<Card>
				<Breadcrumbs items={[{ key: 'home', label: 'Home', href: '/' }, { key: 'docs', label: 'Docs', href: '/docs' }, { key: 'breadcrumbs', label: 'Breadcrumbs' }]} />
				<div className="mt-4">
					<CodeBlock code={`import { Breadcrumbs } from '@creo-team/buzz-ui/server'

<Breadcrumbs items={[{ key: 'home', label: 'Home', href: '/' }, { key: 'docs', label: 'Docs', href: '/docs' }]} />`} />
				</div>
			</Card>
			<ApiTable
				title="API"
				className="mt-8"
				rows={[
					{
						prop: "items",
						type: "{ key: string, label: ReactNode, href?: string }[]",
						required: true,
						description: "List of breadcrumb links"
					}
				]}
			/>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/breadcrumbs/api">/components/breadcrumbs/api</Link></p>
		</div>
	)
}


