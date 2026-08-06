import './globals.css'
// The site consumes the library's workspace source (see tsconfig paths), so
// import the stylesheet source too — npm consumers use '@creo-team/buzz-ui/styles.css'.
import '../../../packages/library/src/styles/buzz.css'
import { cookies } from 'next/headers'
import { TopNav, getServerTheme, getServerShape } from '@creo-team/buzz-ui/server'
import { ThemeSwitcher, ShapeSwitcher, ToastProvider } from '@creo-team/buzz-ui/client'
import { themeInitScript, shapeInitScript } from '@creo-team/buzz-ui/server'
import { DevBanner } from '../components/dev-banner'
import { Logo } from '../components/logo'
import { BuzzTextLogo } from '../components/buzz-text-logo'
import { SiteFooter } from '../components/site-footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const initialTheme = getServerTheme(cookies(), 'light')
	const initialShape = getServerShape(cookies(), 'soft')

	return (
		<html lang="en" data-theme={initialTheme} data-shape={initialShape} className={initialTheme}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript(initialTheme) }} />
				<script dangerouslySetInnerHTML={{ __html: shapeInitScript(initialShape) }} />
			</head>
			<body>
				<div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--c-background)', color: 'var(--c-text)' }}>
					<ToastProvider position="top-center">
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
									<ShapeSwitcher initialShape={initialShape} />
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
