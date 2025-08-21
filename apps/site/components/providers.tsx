"use client"
import React from 'react'
import { ThemeProvider, HotToastProvider } from '@creo-team/buzz-ui/client'
import { Sun, Moon, Palette } from 'lucide-react'

const themes = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "umbro", label: "Dark", icon: Moon },
]

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider themes={themes} defaultTheme="umbro">
			<HotToastProvider>{children}</HotToastProvider>
		</ThemeProvider>
	)
}

