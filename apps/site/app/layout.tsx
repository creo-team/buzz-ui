import './globals.css'
// The site consumes the built workspace package — the same dist + exports map
// npm consumers get — so every site build exercises the shipped artifact.
import '@creo-team/buzz-ui/styles.css'
import { cookies } from 'next/headers'
import { TopNav, getServerTheme, getServerStyle } from '@creo-team/buzz-ui/server'
import { ThemeSwitcher, StyleSwitcher, ToastProvider } from '@creo-team/buzz-ui/client'
import { themeInitScript, styleInitScript } from '@creo-team/buzz-ui/server'
import { DevBanner } from '../components/dev-banner'
import { Logo } from '../components/logo'
import { BuzzTextLogo } from '../components/buzz-text-logo'
import { SiteFooter } from '../components/site-footer'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = await cookies()
	const initialTheme = getServerTheme(cookieStore, 'light')
	const initialStyle = getServerStyle(cookieStore, 'soft')

	return (
		<html lang="en" data-theme={initialTheme} data-style={initialStyle} className={initialTheme}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript(initialTheme) }} />
				<script dangerouslySetInnerHTML={{ __html: styleInitScript(initialStyle) }} />
			</head>
			<body>
				<div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--c-background)', color: 'var(--c-text)' }}>
					<ToastProvider position="top-center">
						<TopNav
							before={<DevBanner />}
							brand={
								<a href="/" className="flex items-center gap-2 group no-underline">
									<div className="transition-transform duration-200 group-hover:scale-105">
										<Logo width={32} className="drop-shadow-xs" />
									</div>
									<div className="transition-transform duration-200 group-hover:scale-105">
										<BuzzTextLogo width={65} className="drop-shadow-xs" />
									</div>
								</a>
							}
							right={
								<div className="flex items-center gap-3">
									<StyleSwitcher initialStyle={initialStyle} />
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
					</ToastProvider>
				</div>
			</body>
		</html>
	)
}
