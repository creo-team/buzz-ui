import { Card, Infotip } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function InfotipDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Infotip</h1>
			<Card>
				<Infotip title="What is an Infotip?" description="Infotip is a pre-styled tooltip with an information icon, ideal for inline explanations." />
				<div className="mt-4">
					<CodeBlock code={`import { Infotip } from '@creo-team/buzz-ui/server'

<Infotip title="Heads up" description="Short context inline." />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">API Reference</h2>
			<ApiTable
				title="Infotip Props"
				className="mt-4"
				rows={[
					{
						prop: "title",
						type: "string",
						required: true,
						description: "Tooltip title text"
					},
					{
						prop: "description",
						type: "string | React.ReactNode",
						required: true,
						description: "Tooltip content"
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
					Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/infotip/api">/components/infotip/api</Link>
				</p>
			</div>
		</div>
	)
}

