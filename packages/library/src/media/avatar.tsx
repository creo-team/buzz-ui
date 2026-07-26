import * as React from 'react'
import { cx } from '../internal/cx.js'
import { AvatarImage } from './avatar-image.js'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name?: string
	src?: string
	size?: AvatarSize
}

function initialsOf(name?: string): string {
	if (!name) return ''
	return name
		.split(' ')
		.filter(Boolean)
		.map(part => part[0])
		.slice(0, 2)
		.join('')
		.toUpperCase()
}

/**
 * User avatar with automatic initials fallback — the initials render
 * underneath and show whenever the image is absent or fails to load.
 * Server-component safe (image error handling is a tiny client island).
 */
export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
	return (
		<div
			className={cx('bz-avatar', className)}
			data-size={size}
			role={name ? 'img' : undefined}
			aria-label={name}
			{...props}
		>
			<span className="bz-avatar__initials" aria-hidden="true">
				{initialsOf(name)}
			</span>
			{src && <AvatarImage src={src} alt="" />}
		</div>
	)
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Cap on visible avatars; the rest collapse into a "+N" counter. */
	max?: number
	size?: AvatarSize
	children: React.ReactNode
}

/** Overlapping stack of avatars with an overflow counter. */
export function AvatarGroup({ max, size = 'md', className, children, ...props }: AvatarGroupProps) {
	const items = React.Children.toArray(children)
	const visible = max != null && max < items.length ? items.slice(0, max) : items
	const hidden = items.length - visible.length

	return (
		<div className={cx('bz-avatar-group', className)} {...props}>
			{visible}
			{hidden > 0 && (
				<div className="bz-avatar" data-size={size} aria-label={`${hidden} more`}>
					<span className="bz-avatar__initials">+{hidden}</span>
				</div>
			)}
		</div>
	)
}
