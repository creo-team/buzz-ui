"use client"

import React from 'react'
import { Badge, Card, TextInput } from '@creo-team/buzz-ui/server'
import { ALL_STYLES, Button, useStyleSwitcher } from '@creo-team/buzz-ui/client'

/**
 * Live style gallery: the same demo UI rendered once per style preset, each
 * scoped with a container-level `data-style`. Every trait of the style axis
 * is an inherited CSS custom property, so these previews are the real
 * tokens at work — not screenshots. "Use style" applies it site-wide.
 */
export function StyleGallery() {
	const { style, mounted, setStyle } = useStyleSwitcher({ styles: ALL_STYLES })

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{ALL_STYLES.map(option => {
				const value = option.value.toString()
				const isActive = mounted && style === value
				return (
					<div
						key={value}
						data-style={value}
						className="relative rounded-2xl p-5 border border-[var(--c-border)] overflow-hidden"
						style={{
							background:
								'linear-gradient(135deg, var(--c-primary-light) 0%, var(--c-surface-2) 45%, var(--c-info-light) 100%)',
						}}
					>
						<Card variant="elevated">
							<div className="flex items-center justify-between gap-3 mb-4">
								<div className="flex items-center gap-2 min-w-0">
									<h3 className="text-base font-semibold text-[var(--c-text)]">{option.label}</h3>
									{isActive && <Badge variant="success">Active</Badge>}
								</div>
								<Button
									size="sm"
									variant={isActive ? 'subtle' : 'outline'}
									selected={isActive}
									aria-label={isActive ? `${option.label} style is in use` : `Use the ${option.label} style`}
									onClick={() => {
										// No-op when already active; never disabled, so keyboard
										// focus survives the click that activates a style.
										if (!isActive && mounted) setStyle(value)
									}}
								>
									{isActive ? 'In use' : 'Use style'}
								</Button>
							</div>
							<p className="text-xs text-[var(--c-text-muted)] mb-4">{option.description}</p>
							<div className="flex flex-wrap items-center gap-2 mb-3">
								<Button size="sm">Primary</Button>
								<Button size="sm" variant="outline">
									Secondary
								</Button>
								<Badge variant="info">Badge</Badge>
							</div>
							<TextInput placeholder="you@example.com" aria-label={`Sample input in the ${option.label} style`} />
						</Card>
					</div>
				)
			})}
		</div>
	)
}
