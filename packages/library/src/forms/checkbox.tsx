import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
	return (
		<label className="inline-flex items-center gap-2 text-sm text-white">
			<input type="checkbox" className={[
				'h-4 w-4 rounded border-white/20 bg-zinc-900 text-yellow-400 focus:ring-yellow-400/50',
				className,
			].join(' ')} {...props} />
			{label && <span className="text-white/90">{label}</span>}
		</label>
	)
}

