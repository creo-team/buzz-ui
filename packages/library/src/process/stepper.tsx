import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconCheck } from '../internal/icons.js'

export interface Step {
	key: string
	label: React.ReactNode
	/** Secondary line under the label. */
	description?: React.ReactNode
}

export interface StepperProps {
	steps: Step[]
	/** Key of the current step. */
	current: string
	/** Layout direction. Default 'horizontal'. */
	orientation?: 'horizontal' | 'vertical'
	className?: string
}

/**
 * Multi-step progress indicator. Steps before the current one render as
 * completed with a check. Server-component safe.
 */
export function Stepper({ steps, current, orientation = 'horizontal', className }: StepperProps) {
	const currentIndex = steps.findIndex(s => s.key === current)

	return (
		<ol className={cx('bz-stepper', className)} data-orientation={orientation}>
			{steps.map((step, index) => {
				const state = index < currentIndex ? 'complete' : index === currentIndex ? 'active' : 'upcoming'
				return (
					<li
						key={step.key}
						className="bz-stepper__step"
						data-state={state}
						aria-current={state === 'active' ? 'step' : undefined}
					>
						<span className="bz-stepper__marker" aria-hidden="true">
							{state === 'complete' ? <IconCheck className="bz-stepper__check" /> : index + 1}
						</span>
						<span className="bz-stepper__text">
							<span className="bz-stepper__label">{step.label}</span>
							{step.description != null && (
								<span className="bz-stepper__description">{step.description}</span>
							)}
						</span>
						{index < steps.length - 1 && <span className="bz-stepper__connector" aria-hidden="true" />}
					</li>
				)
			})}
		</ol>
	)
}
