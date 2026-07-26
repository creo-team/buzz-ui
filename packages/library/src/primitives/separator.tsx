import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical'
	/** Purely visual (skipped by assistive tech). Default true. */
	decorative?: boolean
}

/** Thin themed divider line, horizontal or vertical. */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
	{ orientation = 'horizontal', decorative = true, className, ...props },
	ref
) {
	return (
		<div
			ref={ref}
			className={cx('bz-separator', className)}
			data-orientation={orientation}
			role={decorative ? 'none' : 'separator'}
			aria-orientation={decorative ? undefined : orientation}
			{...props}
		/>
	)
})
