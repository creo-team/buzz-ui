"use client"
import * as React from 'react'

export interface CopyButtonProps {
	value: string
	label?: string
	className?: string
}

export function CopyButton({ value, label = 'Copy', className = '' }: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false)

	async function onCopy() {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch {}
	}

	return (
		<button
			type="button"
			onClick={onCopy}
			title={copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
			className={[
				'inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
				className,
			].join(' ')}
		>
			{copied ? (
				<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
				</svg>
			) : (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<rect x="9" y="9" width="12" height="12" rx="2" fill="currentColor" opacity="0.15" />
					<rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
				</svg>
			)}
		</button>
	)
}


