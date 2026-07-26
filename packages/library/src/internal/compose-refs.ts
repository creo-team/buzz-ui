import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

function setRef<T>(ref: PossibleRef<T>, value: T) {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref != null) {
		;(ref as React.MutableRefObject<T>).current = value
	}
}

/** Compose multiple refs into a single ref callback. */
export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
	return node => {
		for (const ref of refs) setRef(ref, node)
	}
}

/** Hook form of composeRefs with a stable identity per ref set. */
export function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return React.useCallback(composeRefs(...refs), refs)
}
