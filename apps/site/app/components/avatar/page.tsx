import { Card, Avatar } from '@creo-team/buzz-ui/server'

export default function AvatarDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Avatar</h1>
			<Card>
				<div className="flex items-center gap-4">
					<Avatar name="Buzz Lightyear" />
					<Avatar name="Star Command" size="lg" />
					<Avatar name="LC" size="sm" />
				</div>
			</Card>
		</div>
	)
}


