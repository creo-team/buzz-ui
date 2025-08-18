import * as React from 'react'

export interface RadioOption {
	value: string
	label: string
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	label?: string
	name: string
	options: RadioOption[]
	value?: string
	onChange?: (value: string) => void
}

export function RadioGroup({ label, name, options, value, onChange, className = '', ...props }: RadioGroupProps) {
	return (
		<div className={['text-sm text-white', className].join(' ')} {...props}>
			{label && <div className="mb-1 text-white/80">{label}</div>}
			<div className="flex flex-wrap gap-3">
				{options.map(opt => (
					<label key={opt.value} className="inline-flex items-center gap-2">
						<input
							type="radio"
							name={name}
							value={opt.value}
							checked={value === opt.value}
							{...(onChange ? { onChange: () => onChange(opt.value) } : {})}
							className="h-4 w-4 rounded-full border-white/20 bg-zinc-900 text-yellow-400 focus:ring-yellow-400/50"
						/>
						<span>{opt.label}</span>
					</label>
				))}
			</div>
		</div>
	)
}

