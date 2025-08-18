"use client"
import { Footer } from '@creo-team/buzz-ui/server'

export function SiteFooter() {
	return (
		<Footer
			links={[
				{ key: 'github', label: 'GitHub', href: 'https://github.com/creo-team/buzz-ui' },
				{ key: 'npm', label: 'npm', href: 'https://www.npmjs.com/package/@creo-team/buzz-ui' },
				{ key: 'privacy', label: 'Privacy', href: '/privacy' },
				{ key: 'terms', label: 'Terms', href: '/terms' },
			]}
			copyright={<span>© {new Date().getFullYear()} Creo Team</span>}
		/>
	)
}

