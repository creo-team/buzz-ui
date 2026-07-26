"use client"

import * as React from 'react'
import { Toaster, type ToasterProps } from './toast.js'

/**
 * @deprecated Buzz UI no longer depends on react-hot-toast. This shim keeps
 * the old name working — it renders the built-in `<Toaster />`. Mount
 * `<Toaster />` directly instead.
 */
export function HotToastProvider({ children, ...props }: { children: React.ReactNode } & ToasterProps) {
	return (
		<>
			{children}
			<Toaster {...props} />
		</>
	)
}
