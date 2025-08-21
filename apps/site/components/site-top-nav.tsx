"use client"
import { TopNav } from '@creo-team/buzz-ui/client'
import { Button as BuzzButton, ThemeSwitcher } from '@creo-team/buzz-ui/client'

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
					<a href="https://github.com/creo-team/buzz-ui" className="no-underline"><BuzzButton variant="subtle" size="sm">GitHub</BuzzButton></a>
				</div>
			}
		/>
	)
}

