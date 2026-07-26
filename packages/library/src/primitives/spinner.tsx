import * as React from 'react'
import { cx } from '../internal/cx.js'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
	size?: SpinnerSize
	/** Accessible label. Default "Loading". Pass null to mark decorative. */
	label?: string | null
}

/**
 * Indeterminate loading indicator. Pure SVG + CSS animation, so it renders in
 * Server Components and costs zero JavaScript.
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
	{ size = 'md', label = 'Loading', className, ...props },
	ref
) {
	return (
		<svg
			ref={ref}
			className={cx('bz-spinner', className)}
			data-size={size}
			viewBox="0 0 24 24"
			fill="none"
			role={label == null ? undefined : 'status'}
			aria-hidden={label == null ? true : undefined}
			aria-label={label ?? undefined}
			{...props}
		>
			<circle className="bz-spinner__track" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" />
			<path
				className="bz-spinner__head"
				d="M12 2a10 10 0 0 1 10 10"
				strokeWidth="4"
				stroke="currentColor"
				strokeLinecap="round"
			/>
		</svg>
	)
})
