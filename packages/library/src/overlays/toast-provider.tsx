"use client"

import { Toaster } from "react-hot-toast"

export function HotToastProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster />
		</>
	)
}
