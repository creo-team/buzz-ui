"use client"
import * as React from 'react'

/** useLayoutEffect on the client, useEffect on the server (silences SSR warnings). */
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
