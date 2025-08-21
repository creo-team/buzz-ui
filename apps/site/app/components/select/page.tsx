import { Card, Select } from '@creo-team/buzz-ui/client'
import Link from 'next/link'
import { CodeBlock } from '../../../components/code-block'

export default function SelectDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Select</h1>
			<p className="mt-2 text-sm text-white/70">A native select styled to match the system.</p>
			<Card className="mt-4">
				<Select label="Favorite" defaultValue="">
					<option value="" disabled>Select one</option>
					<option value="buzz">Buzz</option>
					<option value="lightyear">Lightyear</option>
					<option value="starcommand">Star Command</option>
				</Select>
				<div className="mt-4">
					<CodeBlock code={`import { Select } from '@creo-team/buzz-ui/client'

<Select label="Favorite" defaultValue="">
  <option value="" disabled>Select one</option>
  <option value="a">Option A</option>
</Select>`} />
				</div>
			</Card>
			<p className="mt-4 text-xs text-white/60">Accessibility: ensure the label is associated; include a disabled placeholder option if nothing is selected.</p>
			<p className="mt-6 text-sm text-white/70">Full API: <Link className="text-[var(--c-link)]" href="/components/select/api">/components/select/api</Link></p>
		</div>
	)
}


