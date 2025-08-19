"use client"

import { useState } from 'react'

export interface CodeBoxProps {
	code: string
	language?: string
	label?: string
	showLineNumbers?: boolean
	className?: string
	copyable?: boolean
}

export function CodeBox({ 
	code, 
	language = 'typescript', 
	label = 'Code', 
	showLineNumbers = false,
	className = '',
	copyable = true
}: CodeBoxProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (!copyable) return
		
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
		}
	}

	const lines = code.split('\n')
	const isEmpty = code.trim().length === 0

	return (
		<div className={`relative group ${className}`} role="none">
			{label && (
				<div className="flex items-center justify-between px-4 py-2 bg-[var(--c-surface-3)] border border-[var(--c-border)] border-b-0 rounded-t-[var(--radius-md)] text-xs font-medium text-[var(--c-text-secondary)]" role="none">
					<span role="none">{label}</span>
					{language && (
						<span className="text-[var(--c-text-muted)]" role="none">{language}</span>
					)}
				</div>
			)}
			
			<div className="relative" role="none">
				<pre className={`overflow-x-auto bg-[var(--c-surface-3)] border border-[var(--c-border)] p-4 text-sm font-mono text-[var(--c-text)] ${
					label ? 'rounded-b-[var(--radius-md)]' : 'rounded-[var(--radius-md)]'
				}`} role={isEmpty ? 'generic' : undefined}>
					{isEmpty ? (
						<code className="block" aria-hidden="true" />
					) : (
						<code className="block">
							{showLineNumbers ? (
								<div className="table w-full" role="none">
									{lines.map((line, index) => (
										<div key={index} className="table-row" role="none">
											<span className="table-cell pr-4 text-[var(--c-text-muted)] select-none text-right w-8" role="none">{index + 1}</span>
											<span className="table-cell whitespace-pre" role="none">{line}</span>
										</div>
									))}
								</div>
							) : (
								<span className="whitespace-pre">{code}</span>
							)}
						</code>
					)}
				</pre>
				
				{copyable && (
					<button
						onClick={handleCopy}
						className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-sm)] hover:bg-[var(--c-hover)] text-[var(--c-text-secondary)] hover:text-[var(--c-text)]"
						title={copied ? 'Copied!' : 'Copy code'}
					>
						{copied ? (
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						) : (
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
						)}
					</button>
				)}
			</div>
		</div>
	)
}
