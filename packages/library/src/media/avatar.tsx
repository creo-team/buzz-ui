import * as React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name?: string
	src?: string
	size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, src, size = 'md', className = '', ...props }: AvatarProps) {
	const sizeCls = size === 'sm' ? 'h-6 w-6 text-xs' : size === 'lg' ? 'h-12 w-12 text-lg' : 'h-8 w-8 text-sm'
	const initials = name ? name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() : ''
	return (
		<div className={["inline-flex items-center justify-center rounded-full bg-[var(--c-surface-2)] text-white/80", sizeCls, className].join(' ')} {...props}>
			{src ? <img alt={name} src={src} className="h-full w-full rounded-full object-cover" /> : initials}
		</div>
	)
}


