import { Card, Chip } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function ChipDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Chip</h1>
			<Card>
				<div className="flex flex-wrap gap-2">
					<Chip>Default</Chip>
					<Chip variant="info">Info</Chip>
					<Chip variant="success">Success</Chip>
					<Chip variant="warning">Warning</Chip>
					<Chip variant="danger">Danger</Chip>
					<Chip variant="outline">Outline</Chip>
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Chip } from '@creo-team/buzz-ui/server'

<Chip>Default</Chip>
<Chip variant="success">Success</Chip>
<Chip variant="outline">Outline</Chip>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">API Reference</h2>
			<ApiTable
				title="Chip Props"
				className="mt-4"
				rows={[
					{
						prop: "variant",
						type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'outline'",
						default: "'default'",
						description: "Visual style variant"
					},
					{
						prop: "size",
						type: "'sm' | 'md' | 'lg'",
						default: "'md'",
						description: "Size of the chip"
					},
					{
						prop: "children",
						type: "React.ReactNode",
						required: true,
						description: "Chip content"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/chip/api">/components/chip/api</Link>
				</p>
			</div>
		</div>
	)
}


