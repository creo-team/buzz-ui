"use client"
import { Card } from '@creo-team/buzz-ui/server'
import { Switch } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function SwitchDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Switch</h1>
			<p className="mt-2 text-sm text-white/70">A toggle switch for binary options.</p>
			<Card>
				<div className="flex items-center gap-3">
					<span className="text-sm text-white/70">Notifications</span>
					<Switch />
				</div>
				<div className="mt-4">
					<CodeBlock code={`import { Switch } from '@creo-team/buzz-ui/client'

<Switch />`} />
				</div>
			</Card>
			<ApiTable
				title="API"
				className="mt-8"
				rows={[
					{
						prop: "checked",
						type: "boolean",
						required: true,
						description: "Controlled state"
					},
					{
						prop: "onChange",
						type: "(val: boolean) => void",
						required: true,
						description: "Change handler"
					}
				]}
			/>
		</div>
	)
}
