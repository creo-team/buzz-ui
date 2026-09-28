import * as React from 'react'
import { cx } from '../internal/cx.js'

/** Props for {@link Separator}. */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Line axis. @default 'horizontal' */
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
