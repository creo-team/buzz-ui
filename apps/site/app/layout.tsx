import './globals.css'
import { TopNav, getServerTheme, Banner } from '@creo-team/buzz-ui/server'
import { ThemeSwitcher } from '@creo-team/buzz-ui/client'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { DevBanner } from '../components/dev-banner'
import { ToastProvider } from '@creo-team/buzz-ui/client'
import { Logo } from '../components/logo'
import { BuzzTextLogo } from '../components/buzz-text-logo'
import { SiteFooter } from '../components/site-footer'
const MobileMenu = dynamic(() => import('../components/mobile-menu'), { ssr: false })
 

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const initialTheme = getServerTheme('light')
	
	return (
		<html lang="en" data-theme={initialTheme} className={initialTheme}>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `try{var t=document.cookie.match(/theme=([^;]+)/)?.[1]||'${initialTheme}';if(t!=='${initialTheme}'){document.documentElement.setAttribute('data-theme',t);document.documentElement.className=t}}catch(e){}`,
					}}
				/>
			</head>
			<body>
				<div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--c-background)', color: 'var(--c-text)' }}>
					<DevBanner />
					<ToastProvider>
						<div className="pt-10">
							<TopNav
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
								offsetTop={40}
							/>
						</div>
						<main className="flex-1">
							{children}
						</main>
						<Toaster
							position="top-center"
							toastOptions={{
								duration: 1500,
								style: {
									background: 'var(--c-surface)',
									color: 'var(--c-text)',
									border: '1px solid var(--c-border)',
									fontSize: '0.875rem',
									maxWidth: '260px',
									padding: '0.625rem 0.75rem',
									borderRadius: '8px',
								},
							}}
						/>
						<SiteFooter />
					</ToastProvider>
				</div>
			</body>
		</html>
	)
}

