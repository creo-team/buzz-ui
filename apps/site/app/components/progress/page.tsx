import { Card, Progress } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function ProgressDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Progress</h1>
			<Card>
				<div className="grid gap-3">
					<Progress value={25} />
					<Progress value={60} />
					<Progress value={90} />
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Progress } from '@creo-team/buzz-ui/server'

<Progress value={45} />`} />
				</div>
			</Card>
			<ApiTable
				title="API"
				className="mt-8"
				rows={[
					{
						prop: "value",
						type: "number (0-100)",
						required: true,
						description: "Progress percentage"
					}
				]}
			/>
		</div>
	)
}
