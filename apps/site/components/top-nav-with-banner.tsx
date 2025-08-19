'use client'
import { TopNav, TopNavProps } from '@creo-team/buzz-ui/server'

export function TopNavWithBanner(props: TopNavProps) {
	return (
		<TopNav {...props} offsetTop={40} />
	)
}
