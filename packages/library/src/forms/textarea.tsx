import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ label, error, className = '', ...props },
	ref
) {
	return (
		<label className="block text-sm text-white">
			{label && <span className="mb-1 block text-white/80">{label}</span>}
			<textarea
				ref={ref}
				className={[
					'block w-full rounded-md border bg-zinc-900 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50',
					error ? 'border-red-500' : 'border-white/10',
					className,
				].join(' ')}
				{...props}
			/>
			{error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
		</label>
	)
})

