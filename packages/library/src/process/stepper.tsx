import * as React from 'react'

export interface StepperProps {
	steps: { key: string, label: React.ReactNode }[]
	current: string
}

export function Stepper({ steps, current }: StepperProps) {
	return (
		<ol className="flex items-center gap-3 text-sm">
			{steps.map((s, i) => {
				const isActive = s.key === current
				return (
					<li key={s.key} className="flex items-center gap-2">
						<span className={["inline-flex h-6 w-6 items-center justify-center rounded-full border", isActive ? 'border-[var(--c-primary)] text-[var(--c-primary)]' : 'border-[var(--c-border)] text-white/70'].join(' ')}>{i+1}</span>
						<span className={isActive ? 'text-[var(--c-primary)]' : 'text-white/70'}>{s.label}</span>
					</li>
				)
			})}
		</ol>
	)
}


