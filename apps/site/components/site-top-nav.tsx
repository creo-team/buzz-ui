"use client"
import { TopNav } from '@creo-team/buzz-ui/server'
import { Button, ThemeSwitcher } from '@creo-team/buzz-ui/client'

export function SiteTopNav() {
	return (
		<TopNav
			brand="Buzz UI"
			items={[
				{ key: 'home', label: 'Home', href: '/' },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'components', label: 'Components', href: '/components' },
			]}
			right={
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
					<a href="https://github.com/creo-team/buzz-ui" className="no-underline"><Button variant="subtle" size="sm">GitHub</Button></a>
				</div>
			}
		/>
	)
}

