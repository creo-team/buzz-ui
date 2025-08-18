import { Card, Stepper } from '@creo-team/buzz-ui/server'

export default function StepperDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Stepper</h1>
			<Card>
				<Stepper
					steps={[
						{ key: 'account', label: 'Account' },
						{ key: 'profile', label: 'Profile' },
						{ key: 'confirm', label: 'Confirm' },
					]}
					current="profile"
				/>
			</Card>
		</div>
	)
}


