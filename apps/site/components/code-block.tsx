"use client"

import { useState } from 'react'
import { CopyButton } from '@creo-team/buzz-ui/client'

export function CodeBlock({ code, label = 'Snippet' }: { code: string, label?: string }) {
	return (
		<div className="relative group">
			{label && (
				<div className="flex items-center justify-between px-4 py-2 bg-[var(--c-surface-2)] border border-[var(--c-border)] border-b-0 rounded-t-[var(--radius-md)] text-xs font-medium text-[var(--c-text-secondary)]">
					<span>{label}</span>
				</div>
			)}
			
			<div className="relative">
				<pre className={`overflow-x-auto bg-[var(--c-surface-3)] border border-[var(--c-border)] p-4 text-sm font-mono text-[var(--c-text)] ${
					label ? 'rounded-b-[var(--radius-md)]' : 'rounded-[var(--radius-md)]'
				}`}>
					<code className="block">{code}</code>
				</pre>
				
				<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<CopyButton value={code} label={label} />
				</div>
			</div>
		</div>
	)
}
