'use client'

import { TopNav } from '@creo-team/buzz-ui/client'
import { ThemeSwitcher, HotToastProvider } from '@creo-team/buzz-ui/client'
import { DevBanner } from './dev-banner'
import { Logo } from './logo'
import { BuzzTextLogo } from './buzz-text-logo'
import { SiteFooter } from './site-footer'

export function LayoutClient({ 
	children,
	initialTheme 
}: { 
	children: React.ReactNode
	initialTheme: string
}) {
	return (
		<HotToastProvider>
			<TopNav
				before={<DevBanner />}
				brand={
					<a href="/" className="flex items-center gap-2 group no-underline">
						<div className="transition-transform duration-200 group-hover:scale-105">
							<Logo width={32} className="drop-shadow-sm" />
						</div>
						<div className="transition-transform duration-200 group-hover:scale-105">
							<BuzzTextLogo width={65} className="drop-shadow-sm" />
						</div>
					</a>
				}
				right={
					<div className="flex items-center gap-3">
						<ThemeSwitcher initialTheme={initialTheme} />
						<a href="https://github.com/creo-team/buzz-ui" className="no-underline">
							<button className="rounded-[var(--radius-md)] border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2 text-sm text-[var(--c-text)] hover:bg-[var(--c-hover)] transition-colors">
								GitHub
							</button>
						</a>
					</div>
				}
				items={[
					{ key: 'home', label: 'Home', href: '/' },
					{ key: 'docs', label: 'Docs', href: '/docs' },
					{ key: 'components', label: 'Components', href: '/components' }
				]}
			/>
			<main className="flex-1 pt-[104px]">
				{children}
			</main>
			<SiteFooter />
		</HotToastProvider>
	)
}
