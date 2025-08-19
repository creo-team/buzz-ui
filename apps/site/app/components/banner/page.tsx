"use client"
import { useState } from 'react'
import { Banner, Card } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function BannerDocs() {
	const [showDismissible, setShowDismissible] = useState(true)
	const [showActionBanner, setShowActionBanner] = useState(true)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12 overflow-x-hidden">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Banner</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Display important messages and announcements at the top or bottom of your interface.
			</p>

			{/* Basic Examples */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Basic Variants</h2>
				<div className="space-y-4">
					<Banner variant="info">
						<span className="font-semibold">Information:</span> This is an informational banner message.
					</Banner>
					
					<Banner variant="success">
						<span className="font-semibold">Success!</span> Your operation completed successfully.
					</Banner>
					
					<Banner variant="warning">
						<span className="font-semibold">Warning:</span> Please review this important information.
					</Banner>
					
					<Banner variant="danger">
						<span className="font-semibold">Error:</span> Something went wrong. Please try again.
					</Banner>
				</div>

				<div className="mt-6">
					<CodeBlock
						code={`<Banner variant="info">
  <span className="font-semibold">Information:</span> This is an informational banner message.
</Banner>

<Banner variant="success">
  <span className="font-semibold">Success!</span> Your operation completed successfully.
</Banner>

<Banner variant="warning">
  <span className="font-semibold">Warning:</span> Please review this important information.
</Banner>

<Banner variant="danger">
  <span className="font-semibold">Error:</span> Something went wrong. Please try again.
</Banner>`}
					/>
				</div>
			</section>

			{/* Special Variants */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Special Variants</h2>
				<div className="space-y-4">
					<Banner variant="development" animated>
						<span className="font-bold tracking-wide">DEVELOPMENT PREVIEW</span>
						<span className="hidden sm:inline text-amber-100/90">•</span>
						<span className="hidden sm:inline text-amber-100/90 font-normal">
							Active development in progress with experimental features
						</span>
						<span className="sm:hidden text-amber-100/90 font-normal text-xs">
							In development
						</span>
					</Banner>
					
					<Banner variant="glass">
						<span className="font-semibold">Glass Effect:</span> A beautiful frosted glass banner style.
					</Banner>
					
					<Banner variant="gradient">
						<span className="font-semibold">✨ New Feature:</span> Check out our amazing gradient banner!
					</Banner>
				</div>

				<div className="mt-6">
					<CodeBlock
						code={`<Banner variant="development" animated>
  <span className="font-bold tracking-wide">DEVELOPMENT PREVIEW</span>
  <span className="hidden sm:inline text-amber-100/90">•</span>
  <span className="hidden sm:inline text-amber-100/90 font-normal">
    Active development in progress with experimental features
  </span>
</Banner>

<Banner variant="glass">
  <span className="font-semibold">Glass Effect:</span> A beautiful frosted glass banner style.
</Banner>

<Banner variant="gradient">
  <span className="font-semibold">✨ New Feature:</span> Check out our amazing gradient banner!
</Banner>`}
					/>
				</div>
			</section>

			{/* Dismissible Banner */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Dismissible Banner</h2>
				<Card className="p-6">
					{showDismissible ? (
						<Banner 
							variant="info" 
							dismissible 
							onDismiss={() => setShowDismissible(false)}
						>
							<span className="font-semibold">Dismissible:</span> Click the X to dismiss this banner.
						</Banner>
					) : (
						<div className="text-center py-4">
							<button
								onClick={() => setShowDismissible(true)}
								className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:bg-[var(--c-primary-hover)] transition-colors"
							>
								Show Banner Again
							</button>
						</div>
					)}
				</Card>

				<div className="mt-6">
					<CodeBlock
						code={`const [showBanner, setShowBanner] = useState(true)

<Banner 
  variant="info" 
  dismissible 
  onDismiss={() => setShowBanner(false)}
>
  <span className="font-semibold">Dismissible:</span> Click the X to dismiss this banner.
</Banner>`}
					/>
				</div>
			</section>

			{/* Banner with Action */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Banner with Action</h2>
				<Card className="p-6">
					{showActionBanner ? (
						<Banner 
							variant="gradient"
							action={{
								label: 'Learn More',
								onClick: () => alert('Action clicked!')
							}}
							dismissible
							onDismiss={() => setShowActionBanner(false)}
						>
							<span className="font-semibold">🎉 Special Offer:</span> Get 50% off your first month!
						</Banner>
					) : (
						<div className="text-center py-4">
							<button
								onClick={() => setShowActionBanner(true)}
								className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:bg-[var(--c-primary-hover)] transition-colors"
							>
								Show Banner Again
							</button>
						</div>
					)}
				</Card>

				<div className="mt-6">
					<CodeBlock
						code={`<Banner 
  variant="gradient"
  action={{
    label: 'Learn More',
    onClick: () => alert('Action clicked!')
  }}
  dismissible
  onDismiss={() => setShowBanner(false)}
>
  <span className="font-semibold">🎉 Special Offer:</span> Get 50% off your first month!
</Banner>`}
					/>
				</div>
			</section>

			{/* Fixed Position */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Fixed Position</h2>
				<Card className="p-6">
					<p className="text-[var(--c-text-secondary)] mb-4">
						Banners can be fixed to the top or bottom of the viewport. This is useful for global announcements.
					</p>
					<div className="flex gap-4">
						<button
							onClick={() => {
								const banner = document.createElement('div')
								banner.innerHTML = `
									<div class="fixed inset-x-0 top-0 z-[60] bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-purple-600/95 text-white border-b border-purple-500/30 backdrop-blur-sm shadow-lg">
										<div class="relative w-full px-4 sm:px-6 lg:px-8 py-2.5">
											<div class="flex items-center justify-center gap-3 text-sm font-medium">
												<span>📢 This is a fixed banner at the top!</span>
												<button onclick="this.closest('div').remove()" class="ml-2 p-1 hover:bg-white/10 rounded transition-colors">
													<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
														<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
													</svg>
												</button>
											</div>
										</div>
									</div>
								`
								document.body.appendChild(banner.firstElementChild!)
								setTimeout(() => banner.firstElementChild?.remove(), 5000)
							}}
							className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							Show Fixed Top Banner (5s)
						</button>
						<button
							onClick={() => {
								const banner = document.createElement('div')
								banner.innerHTML = `
									<div class="fixed inset-x-0 bottom-0 z-[60] bg-gradient-to-r from-blue-600/95 to-blue-700/95 text-white border-t border-blue-500/30 backdrop-blur-sm shadow-lg">
										<div class="relative w-full px-4 sm:px-6 lg:px-8 py-2.5">
											<div class="flex items-center justify-center gap-3 text-sm font-medium">
												<span>🍪 We use cookies to improve your experience</span>
												<button onclick="this.closest('div').remove()" class="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-xs font-semibold">
													Accept
												</button>
											</div>
										</div>
									</div>
								`
								document.body.appendChild(banner.firstElementChild!)
								setTimeout(() => banner.firstElementChild?.remove(), 5000)
							}}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Show Fixed Bottom Banner (5s)
						</button>
					</div>
				</Card>

				<div className="mt-6">
					<CodeBlock
						code={`<Banner 
  variant="info" 
  fixed 
  position="top"
>
  This banner is fixed to the top of the viewport
</Banner>

<Banner 
  variant="info" 
  fixed 
  position="bottom"
>
  This banner is fixed to the bottom of the viewport
</Banner>`}
					/>
				</div>
			</section>

			{/* Custom Icon */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">Custom Icons</h2>
				<div className="space-y-4">
					<Banner 
						variant="info"
						icon={
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
						}
					>
						<span className="font-semibold">New Message:</span> You have unread emails in your inbox.
					</Banner>
					
					<Banner 
						variant="success"
						icon={
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
						}
					>
						<span className="font-semibold">Achievement Unlocked:</span> You've completed all tasks!
					</Banner>

					<Banner 
						variant="glass"
						icon={null}
					>
						<span className="font-semibold">No Icon:</span> This banner has no icon at all.
					</Banner>
				</div>

				<div className="mt-6">
					<CodeBlock
						code={`<Banner 
  variant="info"
  icon={
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  }
>
  <span className="font-semibold">New Message:</span> You have unread emails.
</Banner>

<Banner variant="glass" icon={null}>
  <span className="font-semibold">No Icon:</span> This banner has no icon at all.
</Banner>`}
					/>
				</div>
			</section>

			{/* API Reference */}
			<section className="mt-12">
				<h2 className="text-xl font-semibold text-[var(--c-text)] mb-6">API Reference</h2>
				<ApiTable
					rows={[
						{
							prop: 'variant',
							type: "'info' | 'success' | 'warning' | 'danger' | 'development' | 'glass' | 'gradient'",
							default: "'info'",
							description: 'The visual style variant of the banner'
						},
						{
							prop: 'children',
							type: 'React.ReactNode',
							required: true,
							description: 'The content to display in the banner'
						},
						{
							prop: 'icon',
							type: 'React.ReactNode',
							default: 'variant icon',
							description: 'Custom icon to display. Pass null to hide the icon'
						},
						{
							prop: 'dismissible',
							type: 'boolean',
							default: 'false',
							description: 'Whether the banner can be dismissed'
						},
						{
							prop: 'onDismiss',
							type: '() => void',
							default: 'undefined',
							description: 'Callback when the banner is dismissed'
						},
						{
							prop: 'fixed',
							type: 'boolean',
							default: 'false',
							description: 'Whether the banner is fixed positioned'
						},
						{
							prop: 'position',
							type: "'top' | 'bottom'",
							default: "'top'",
							description: 'Position when fixed is true'
						},
						{
							prop: 'animated',
							type: 'boolean',
							default: 'false',
							description: 'Whether to show animations (for development variant)'
						},
						{
							prop: 'action',
							type: '{ label: string, onClick: () => void }',
							default: 'undefined',
							description: 'Action button configuration'
						},
						{
							prop: 'className',
							type: 'string',
							default: "''",
							description: 'Additional CSS classes'
						}
					]}
				/>
			</section>
		</div>
	)
}