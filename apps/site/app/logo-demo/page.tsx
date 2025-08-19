'use client'

import { Logo } from '../../components/logo'
import { BuzzTextLogo } from '../../components/buzz-text-logo'

export default function LogoDemoPage() {
	return (
		<div className="min-h-screen" style={{ backgroundColor: 'var(--c-background)' }}>
			<div className="max-w-6xl mx-auto p-8 space-y-12">
				<header className="text-center">
					<h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>
						Logo Showcase
					</h1>
					<p style={{ color: 'var(--c-text-secondary)' }}>
						Flame logo and Buzz UI text in the design system
					</p>
				</header>

				{/* Combined Logo (as in navigation) */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Combined Logo (Navigation Style)
					</h2>
					<div 
						className="p-8 rounded-lg shadow-lg"
						style={{ 
							backgroundColor: 'var(--c-surface)',
							border: '1px solid var(--c-border)'
						}}
					>
						<div className="flex items-center justify-center gap-2">
							<Logo width={32} className="drop-shadow-sm" />
							<BuzzTextLogo width={65} className="drop-shadow-sm" />
						</div>
						<p className="mt-4 text-center text-sm" style={{ color: 'var(--c-text-secondary)' }}>
							As shown in top navigation
						</p>
					</div>
				</section>

				{/* Text Logo Variations */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Buzz UI Text Logo
					</h2>
					<div 
						className="flex flex-wrap items-end gap-8 p-8 rounded-lg shadow-lg"
						style={{ 
							backgroundColor: 'var(--c-surface)',
							border: '1px solid var(--c-border)'
						}}
					>
						<div className="text-center">
							<BuzzTextLogo width={60} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>60px</p>
						</div>
						<div className="text-center">
							<BuzzTextLogo width={65} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>65px (Navigation)</p>
						</div>
						<div className="text-center">
							<BuzzTextLogo width={80} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>80px</p>
						</div>
						<div className="text-center">
							<BuzzTextLogo width={100} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>100px</p>
						</div>
						<div className="text-center">
							<BuzzTextLogo width={120} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>120px</p>
						</div>
					</div>
				</section>

				{/* Flame Logo Sizes */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Flame Logo Sizes
					</h2>
					<div 
						className="flex flex-wrap items-end gap-8 p-8 rounded-lg shadow-lg"
						style={{ 
							backgroundColor: 'var(--c-surface)',
							border: '1px solid var(--c-border)'
						}}
					>
						<div className="text-center">
							<Logo width={24} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>24px</p>
						</div>
						<div className="text-center">
							<Logo width={32} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>32px</p>
						</div>
						<div className="text-center">
							<Logo width={40} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>40px</p>
						</div>
						<div className="text-center">
							<Logo width={60} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>60px</p>
						</div>
						<div className="text-center">
							<Logo width={80} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>80px</p>
						</div>
						<div className="text-center">
							<Logo width={100} />
							<p className="mt-2 text-sm" style={{ color: 'var(--c-text-secondary)' }}>100px</p>
						</div>
					</div>
				</section>

				{/* Theme Adaptive */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Theme Adaptive
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div 
							className="p-8 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={60} />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Using Theme Primary
							</p>
						</div>
						<div 
							className="p-8 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface-2)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={60} color="var(--c-accent)" />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Using Accent Color
							</p>
						</div>
					</div>
				</section>

				{/* Color Variations */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Color Variations
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div 
							className="p-6 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={50} color="#cb372e" />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Original
							</p>
						</div>
						<div 
							className="p-6 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={50} color="#3b82f6" />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Blue
							</p>
						</div>
						<div 
							className="p-6 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={50} color="#10b981" />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Green
							</p>
						</div>
						<div 
							className="p-6 rounded-lg shadow-lg text-center"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<Logo width={50} color="#8b5cf6" />
							<p className="mt-3 text-sm font-mono" style={{ color: 'var(--c-text-secondary)' }}>
								Purple
							</p>
						</div>
					</div>
				</section>

				{/* Combined Variations */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Combined Variations
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Horizontal Layout */}
						<div 
							className="p-6 rounded-lg shadow-lg"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<div className="flex items-center gap-3">
								<Logo width={40} />
								<BuzzTextLogo width={100} />
							</div>
							<p className="mt-3 text-sm text-center" style={{ color: 'var(--c-text-secondary)' }}>
								Horizontal Layout
							</p>
						</div>

						{/* Stacked Layout */}
						<div 
							className="p-6 rounded-lg shadow-lg"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<div className="flex flex-col items-center gap-2">
								<Logo width={50} />
								<BuzzTextLogo width={100} />
							</div>
							<p className="mt-3 text-sm text-center" style={{ color: 'var(--c-text-secondary)' }}>
								Stacked Layout
							</p>
						</div>

						{/* Large Display */}
						<div 
							className="p-6 rounded-lg shadow-lg md:col-span-2"
							style={{ 
								backgroundColor: 'var(--c-surface-2)',
								border: '1px solid var(--c-border)'
							}}
						>
							<div className="flex items-center justify-center gap-4">
								<Logo width={60} />
								<BuzzTextLogo width={150} />
							</div>
							<p className="mt-3 text-sm text-center" style={{ color: 'var(--c-text-secondary)' }}>
								Large Display
							</p>
						</div>
					</div>
				</section>

				{/* Usage Examples */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						Usage Examples
					</h2>
					<div className="space-y-4">
						{/* Navigation Example */}
						<div 
							className="p-6 rounded-lg shadow-lg"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Logo width={32} />
									<BuzzTextLogo width={80} />
								</div>
								<nav className="flex items-center gap-4">
									<a href="#" className="text-sm" style={{ color: 'var(--c-text-secondary)' }}>Home</a>
									<a href="#" className="text-sm" style={{ color: 'var(--c-text-secondary)' }}>Docs</a>
									<a href="#" className="text-sm" style={{ color: 'var(--c-text-secondary)' }}>Components</a>
								</nav>
							</div>
						</div>

						{/* Card Example */}
						<div 
							className="p-8 rounded-lg shadow-lg"
							style={{ 
								background: 'linear-gradient(135deg, var(--c-surface), var(--c-surface-2))',
								border: '1px solid var(--c-border)'
							}}
						>
							<div className="text-center">
								<div className="flex items-center justify-center gap-3 mb-4">
									<Logo width={60} />
									<BuzzTextLogo width={140} />
								</div>
								<h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>
									Welcome
								</h3>
								<p className="max-w-md mx-auto" style={{ color: 'var(--c-text-secondary)' }}>
									A modern component library with this flame logo representing passion and energy.
								</p>
							</div>
						</div>

						{/* Loading State */}
						<div 
							className="p-6 rounded-lg shadow-lg"
							style={{ 
								backgroundColor: 'var(--c-surface)',
								border: '1px solid var(--c-border)'
							}}
						>
							<style jsx>{`
								@keyframes pulse {
									0%, 100% { opacity: 1; }
									50% { opacity: 0.5; }
								}
								.pulse-animation {
									animation: pulse 2s ease-in-out infinite;
								}
							`}</style>
							<div className="flex items-center gap-4">
								<div className="pulse-animation flex items-center gap-2">
									<Logo width={30} />
									<BuzzTextLogo width={70} />
								</div>
								<div>
									<p className="font-medium" style={{ color: 'var(--c-text)' }}>
										Loading...
									</p>
									<p className="text-sm" style={{ color: 'var(--c-text-secondary)' }}>
										Please wait while we fetch your data
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Animations */}
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>
						With Animations
					</h2>
					<div 
						className="p-8 rounded-lg shadow-lg"
						style={{ 
							backgroundColor: 'var(--c-surface)',
							border: '1px solid var(--c-border)'
						}}
					>
						<style jsx>{`
							@keyframes flicker {
								0%, 100% { opacity: 1; transform: scale(1); }
								25% { opacity: 0.9; transform: scale(1.02); }
								50% { opacity: 0.95; }
								75% { opacity: 0.85; transform: scale(1.01); }
							}
							.flicker {
								animation: flicker 3s ease-in-out infinite;
							}
							@keyframes rotate {
								from { transform: rotate(0deg); }
								to { transform: rotate(360deg); }
							}
							.rotate {
								animation: rotate 10s linear infinite;
							}
							@keyframes bounce {
								0%, 100% { transform: translateY(0); }
								50% { transform: translateY(-10px); }
							}
							.bounce {
								animation: bounce 2s ease-in-out infinite;
							}
						`}</style>
						<div className="flex justify-around items-center">
							<div className="text-center">
								<div className="flicker">
									<Logo width={60} />
								</div>
								<p className="mt-3 text-sm" style={{ color: 'var(--c-text-secondary)' }}>
									Flicker
								</p>
							</div>
							<div className="text-center">
								<div className="rotate">
									<Logo width={60} />
								</div>
								<p className="mt-3 text-sm" style={{ color: 'var(--c-text-secondary)' }}>
									Rotate
								</p>
							</div>
							<div className="text-center">
								<div className="bounce">
									<Logo width={60} />
								</div>
								<p className="mt-3 text-sm" style={{ color: 'var(--c-text-secondary)' }}>
									Bounce
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
