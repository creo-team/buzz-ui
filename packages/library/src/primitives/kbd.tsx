import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode
}

/**
 * Keyboard-key chip for displaying shortcuts, e.g. `<Kbd>⌘K</Kbd>`.
 * Pair with `formatHotkey()` to render registered hotkeys.
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
	{ className, ...props },
	ref
) {
	return <kbd ref={ref} className={cx('bz-kbd', className)} {...props} />
})
