import * as React from 'react'

export function Switch({ checked, onChange }: { checked?: boolean, onChange?: (v: boolean) => void }) {
	return (
		<button
			role="switch"
			aria-checked={!!checked}
			onClick={() => onChange?.(!checked)}
			className={[
				'inline-flex h-6 w-10 items-center rounded-full transition-colors',
				checked ? 'bg-[var(--c-primary)]' : 'bg-white/20',
			].join(' ')}
		>
			<span className={['h-5 w-5 rounded-full bg-white transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5'].join(' ')} />
		</button>
	)
}

