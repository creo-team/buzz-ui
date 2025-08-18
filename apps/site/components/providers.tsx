"use client"
import * as React from 'react'
import { ThemeProvider, HotToastProvider, type ThemeConfig } from '@creo-team/buzz-ui/client'
import { Sun, Moon, Palette } from 'lucide-react'

const themes: ThemeConfig[] = [
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

