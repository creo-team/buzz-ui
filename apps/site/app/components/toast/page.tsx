"use client"
import React from 'react'
import { Card, Button } from '@creo-team/buzz-ui/server'
import { toast } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function ToastDocs() {
	const fakeSave = () =>
		new Promise<string>((resolve, reject) =>
			setTimeout(() => (Math.random() > 0.3 ? resolve('draft') : reject(new Error('offline'))), 1200)
		)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Toast</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Built-in, zero-dependency notifications. Imperative API, promise tracking, pause-on-hover,
				and screen-reader announcements out of the box.
			</p>

			<Card className="mt-6" header="Variants">
				<div className="flex flex-wrap gap-3">
					<Button variant="subtle" onClick={() => toast('Plain message')}>Default</Button>
					<Button variant="success" onClick={() => toast.success('Successfully saved!')}>Success</Button>
					<Button variant="danger" onClick={() => toast.error('Something went wrong')}>Error</Button>
					<Button variant="subtle" onClick={() => toast.warning('Storage almost full')}>Warning</Button>
					<Button variant="subtle" onClick={() => toast.info('New version available')}>Info</Button>
					<Button
						variant="outline"
						onClick={() =>
							toast('Profile updated', { description: 'Your changes are visible to everyone.' })
						}
					>
						With description
					</Button>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { toast } from '@creo-team/buzz-ui/client'

toast('Plain message')
toast.success('Successfully saved!')
toast.error('Something went wrong')
toast('Profile updated', { description: 'Your changes are visible to everyone.' })`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Promise tracking">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					One call renders loading → success/error as the promise settles.
				</p>
				<Button
					onClick={() =>
						toast
							.promise(fakeSave(), {
								loading: 'Saving…',
								success: value => `Saved ${value}`,
								error: 'Could not save',
							})
							.catch(() => {})
					}
				>
					Save (random outcome)
				</Button>
				<div className="mt-4">
					<CodeBlock
						code={`toast.promise(save(), {
	loading: 'Saving…',
	success: value => \`Saved \${value}\`,
	error: 'Could not save',
})`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Actions & persistence">
				<div className="flex flex-wrap gap-3">
					<Button
						variant="outline"
						onClick={() =>
							toast('Message archived', {
								action: { label: 'Undo', onClick: () => toast.success('Restored') },
							})
						}
					>
						With action
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							toast.warning('Persistent until dismissed', { duration: Infinity })
						}
					>
						Persistent
					</Button>
					<Button variant="ghost" onClick={() => toast.dismiss()}>
						Dismiss all
					</Button>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`toast('Message archived', {
	action: { label: 'Undo', onClick: restore },
})

toast.warning('Persistent until dismissed', { duration: Infinity })
toast.dismiss()        // dismiss everything
toast.dismiss(id)      // dismiss one`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Setup">
				<p className="text-sm text-[var(--c-text-secondary)] mb-3">
					Mount a single <code>&lt;Toaster /&gt;</code> near the app root (this site does it in the
					layout). Position it per app; individual toasts may override.
				</p>
				<CodeBlock
					code={`import { Toaster } from '@creo-team/buzz-ui/client'

export default function RootLayout({ children }) {
	return (
		<>
			{children}
			<Toaster position="bottom-right" />
		</>
	)
}`}
				/>
			</Card>

			<Card className="mt-6" header="Updating in place">
				<Button
					variant="outline"
					onClick={() => {
						const id = toast.loading('Uploading…')
						setTimeout(() => toast.success('Uploaded', { id }), 1500)
					}}
				>
					Loading → success
				</Button>
				<div className="mt-4">
					<CodeBlock
						code={`const id = toast.loading('Uploading…')
// later — same id replaces the toast in place
toast.success('Uploaded', { id })`}
					/>
				</div>
			</Card>
		</div>
	)
}
