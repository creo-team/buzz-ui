interface SimpleCodeBlockProps {
	code: string
	className?: string
}

export function SimpleCodeBlock({ code, className = "" }: SimpleCodeBlockProps) {
	return (
		<pre className={`overflow-x-auto rounded-md border border-[var(--c-border)] bg-black/40 p-3 text-xs ${className}`}>
			<code>{code}</code>
		</pre>
	)
}
