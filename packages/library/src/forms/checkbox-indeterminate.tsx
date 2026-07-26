"use client"
import * as React from 'react'

/**
 * Tiny client island that syncs the DOM `indeterminate` property (which has
 * no HTML attribute) for a server-rendered checkbox. This keeps `Checkbox`
 * itself a zero-JS Server Component unless indeterminate is used.
 */
export function CheckboxIndeterminate({ htmlFor, value }: { htmlFor: string; value: boolean }) {
	React.useEffect(() => {
		const el = document.getElementById(htmlFor) as HTMLInputElement | null
		if (el) el.indeterminate = value
	}, [htmlFor, value])
	return null
}
