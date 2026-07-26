import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
	children?: React.ReactNode
}

/**
 * Renders content for screen readers only. Use for icon-button labels,
 * table captions, and other context that shouldn't be visible.
 */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
	function VisuallyHidden({ className, ...props }, ref) {
		return <span ref={ref} className={cx('bz-visually-hidden', className)} {...props} />
	}
)
