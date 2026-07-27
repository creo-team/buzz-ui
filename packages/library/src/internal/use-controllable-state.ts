"use client"
import * as React from 'react'

interface UseControllableStateOptions<T> {
	/** Controlled value. When defined the component follows it exactly. */
	value?: T
	/** Initial value for uncontrolled usage. */
	defaultValue: T
	/** Change callback, fired for both modes. */
	onChange?: (value: T) => void
}

/**
 * The controlled/uncontrolled state pattern used across the library: every
 * stateful component works out of the box (uncontrolled) and can be fully
 * driven by props (controlled), with a single `onChange` contract.
 */
export function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
	const [internal, setInternal] = React.useState<T>(defaultValue)
	const isControlled = value !== undefined
	const current = isControlled ? (value as T) : internal

	const onChangeRef = React.useRef(onChange)
	onChangeRef.current = onChange

	const setValue = React.useCallback(
		(next: T) => {
			if (!isControlled) setInternal(next)
			onChangeRef.current?.(next)
		},
		[isControlled]
	)

	return [current, setValue]
}
