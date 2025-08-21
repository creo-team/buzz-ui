import { Card, Table } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

type Row = { id: number, name: string, role: string }

export default function TableDocs() {
	const rows: Row[] = [
		{ id: 1, name: 'Buzz Lightyear', role: 'Space Ranger' },
		{ id: 2, name: 'Commander Nebula', role: 'Commander' },
	]
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Table</h1>
			<Card>
				<Table<Row>
					columns={[
						{ key: 'name', header: 'Name' },
						{ key: 'role', header: 'Role' },
					]}
					rows={rows}
				/>
				<div className="mt-4">
					<CodeBlock code={`import { Table } from '@creo-team/buzz-ui/client'

<Table columns={[{ key: 'name', header: 'Name' }]} rows={[{ id: 1, name: 'Buzz' }]} />`} />
				</div>
			</Card>
		</div>
	)
}


