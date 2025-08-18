'use client'
import { TopNav, TopNavProps } from '@creo-team/buzz-ui/server'

export function TopNavWithBanner(props: TopNavProps) {
	return (
		<div className="fixed inset-x-0 top-10 z-50">
			<TopNav {...props} />
		</div>
	)
}
