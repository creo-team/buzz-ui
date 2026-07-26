"use client"
import * as React from 'react'

/**
 * Client island for Avatar images: hides the image on load failure so the
 * server-rendered initials underneath show through. Keeps `Avatar` itself a
 * zero-JS Server Component.
 */
export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
	const [failed, setFailed] = React.useState(false)
	if (failed) return null
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			{...props}
			className="bz-avatar__img"
			onError={event => {
				props.onError?.(event)
				setFailed(true)
			}}
			alt={props.alt ?? ''}
		/>
	)
}
