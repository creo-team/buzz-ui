"use client"
import * as React from 'react'

/** Props for {@link CopyFallback}. */
export interface CopyFallbackProps {
	/** The text the clipboard refused; shown and selected so the user can copy it by hand. */
	text: string
	/** How to copy it by hand: a shortcut on desktop, press-and-hold on touch. */
	hint: string
}

/**
 * Shown when a copy fails: the text, selected on mount, followed by a hint. Shared by Timestamp and
 * CopyButton so a failure always leaves something to copy.
 */
export function CopyFallback({ text, hint }: CopyFallbackProps) {
	const textRef = React.useRef<HTMLSpanElement>(null)

	React.useEffect(() => {
		const node = textRef.current
		if (!node) return
		window.getSelection()?.selectAllChildren(node)
	}, [text])

	return (
		<span className="bz-copy-fallback">
			<span ref={textRef} className="bz-copy-fallback__text">
				{text}
			</span>
			<span className="bz-copy-fallback__hint">{hint}</span>
		</span>
	)
}
