import { Card, Skeleton } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function SkeletonDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Skeleton</h1>
			<Card>
				<div className="grid gap-3">
					<Skeleton className="h-6 w-1/2" />
					<Skeleton className="h-24 w-full" />
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Skeleton } from '@creo-team/buzz-ui/server'

<Skeleton className="h-6 w-1/2" />`} />
				</div>
			</Card>
			<ApiTable
				title="API"
				className="mt-8"
				rows={[
					{
						prop: "className",
						type: "string",
						description: "Size/shape classes"
					}
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/skeleton/api">/components/skeleton/api</Link>
				</p>
			</div>
		</div>
	)
}
