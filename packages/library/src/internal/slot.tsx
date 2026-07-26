import * as React from 'react'
import { composeRefs } from './compose-refs.js'
import { cx } from './cx.js'

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode
}

/**
 * Slot merges its props onto its single child element instead of rendering a
 * wrapper. This powers the `asChild` pattern: any component can lend its
 * behavior and styling to an element the consumer controls (e.g. a Next.js
 * `<Link>`), keeping the DOM flat and semantics correct.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
	{ children, ...slotProps },
	forwardedRef
) {
	if (!React.isValidElement(children)) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('[buzz-ui] `asChild` expects a single React element child.')
		}
		return null
	}

	const child = children as React.ReactElement<Record<string, unknown>>
	const childProps = child.props

	const merged: Record<string, unknown> = { ...slotProps }
	for (const key of Object.keys(childProps)) {
		const slotValue = (slotProps as Record<string, unknown>)[key]
		const childValue = childProps[key]
		if (/^on[A-Z]/.test(key) && typeof slotValue === 'function' && typeof childValue === 'function') {
			merged[key] = (...args: unknown[]) => {
				;(childValue as (...a: unknown[]) => void)(...args)
				;(slotValue as (...a: unknown[]) => void)(...args)
			}
		} else if (key === 'className') {
			merged.className = cx(slotValue as string, childValue as string)
		} else if (key === 'style') {
			merged.style = { ...(slotValue as object), ...(childValue as object) }
		} else {
			merged[key] = childValue
		}
	}

	// React 19 exposes element refs via props.ref; React 18 via element.ref.
	const childRef =
		(childProps as { ref?: React.Ref<HTMLElement> }).ref ??
		(child as unknown as { ref?: React.Ref<HTMLElement> }).ref
	merged.ref = composeRefs(forwardedRef, childRef)

	return React.cloneElement(child, merged)
})
