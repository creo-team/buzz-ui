import { Card, Chip } from '@creo-team/buzz-ui/server'

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
			</Card>
		</div>
	)
}


