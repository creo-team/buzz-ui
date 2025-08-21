"use client"

import * as React from 'react'

export enum CircularProgressVariant {
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Info = 'info'
}

export interface CircularProgressProps {
	/** percentage 0-100 */
	value?: number
	/** Size in pixels */
	size?: number
	/** Stroke width */
	strokeWidth?: number
	/** Color variant */
	variant?: CircularProgressVariant | `${CircularProgressVariant}`
	/** Show percentage label */
	showLabel?: boolean
	/** Indeterminate state (loading) */
	indeterminate?: boolean
	className?: string
}

const variantColors = {
	[CircularProgressVariant.Primary]: 'var(--c-primary)',
	[CircularProgressVariant.Success]: 'var(--c-success)',
	[CircularProgressVariant.Warning]: 'var(--c-warning)',
	[CircularProgressVariant.Danger]: 'var(--c-danger)',
	[CircularProgressVariant.Info]: '#3b82f6'
}

/**
 * Circular progress indicator with SVG
 */
export function CircularProgress({ 
	value = 0, 
	size = 48,
	strokeWidth = 4,
	variant = CircularProgressVariant.Primary,
	showLabel = false,
	indeterminate = false,
	className = ''
}: CircularProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const strokeDashoffset = circumference - (clamped / 100) * circumference
	
	return (
		<div className={`inline-flex items-center justify-center relative ${className}`}>
			<svg
				width={size}
				height={size}
				className={indeterminate ? 'animate-spin' : ''}
			>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--c-border)"
					strokeWidth={strokeWidth}
					opacity={0.3}
				/>
				{/* Progress circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={variantColors[variant as CircularProgressVariant]}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
					className="transition-all duration-300 ease-out"
				/>
			</svg>
			{showLabel && !indeterminate && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-xs font-medium text-[var(--c-text)]">
						{Math.round(clamped)}%
					</span>
				</div>
			)}
		</div>
	)
}
