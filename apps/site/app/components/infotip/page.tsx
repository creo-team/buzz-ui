import { Card, Infotip } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'

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
		</div>
	)
}

