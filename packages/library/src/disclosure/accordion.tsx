"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { useControllableState } from '../internal/use-controllable-state.js'
import { IconChevronDown } from '../internal/icons.js'

export interface AccordionItem {
	key: string
	header: React.ReactNode
	content: React.ReactNode
	disabled?: boolean
}

export interface AccordionProps {
	items: AccordionItem[]
	/** Controlled open key (null = all closed). */
	openKey?: string | null
	/** Initial open key for uncontrolled usage. */
	defaultOpenKey?: string | null
	onChange?: (key: string | null) => void
	className?: string
}

/**
 * Single-open accordion with correct disclosure semantics
 * (`aria-expanded` + `aria-controls` + labelled regions) and a pure-CSS
 * expand animation (grid-rows trick — no JS measurement).
 */
export function Accordion({ items, openKey, defaultOpenKey = null, onChange, className }: AccordionProps) {
	const baseId = React.useId()
	const [current, setCurrent] = useControllableState<string | null>({
		value: openKey,
		defaultValue: defaultOpenKey,
		onChange,
	})

	return (
		<div className={cx('bz-accordion', className)}>
			{items.map(item => {
				const isOpen = current === item.key
				const headerId = `${baseId}-header-${item.key}`
				const panelId = `${baseId}-panel-${item.key}`
				return (
					<div key={item.key} className="bz-accordion__item" data-state={isOpen ? 'open' : 'closed'}>
						<h3 className="bz-accordion__heading">
							<button
								type="button"
								id={headerId}
								className="bz-accordion__trigger"
								aria-expanded={isOpen}
								aria-controls={panelId}
								disabled={item.disabled}
								onClick={() => setCurrent(isOpen ? null : item.key)}
							>
								<span className="bz-accordion__header">{item.header}</span>
								<IconChevronDown className="bz-accordion__chevron" aria-hidden="true" />
							</button>
						</h3>
						<div
							id={panelId}
							role="region"
							aria-labelledby={headerId}
							className="bz-accordion__panel"
							data-state={isOpen ? 'open' : 'closed'}
						>
							<div className="bz-accordion__panel-inner">
								<div className="bz-accordion__content">{item.content}</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
