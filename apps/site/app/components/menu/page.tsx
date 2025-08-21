"use client"
import { Card } from '@creo-team/buzz-ui/client'
import { Menu } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function MenuDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Menu</h1>
			<Card>
				<Menu button={<>Actions</>} items={[
					{ key: 'a', label: 'Edit' },
					{ key: 'b', label: 'Duplicate' },
					{ key: 'c', label: 'Archive' },
				]} />
				<div className="mt-4">
					<CodeBlock code={`import { Menu } from '@creo-team/buzz-ui/client'

<Menu button={<>Actions</>} items={[
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
]} />`} />
				</div>
			</Card>
		</div>
	)
}


