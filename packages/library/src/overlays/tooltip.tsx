"use client"

import { ReactNode, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type TooltipAnimationVariants, AnimationPresets } from '../types/animations'

export enum TooltipDirection {
	Top = "TOP",
	Bottom = "BOTTOM",
	Left = "LEFT",
	Right = "RIGHT"
}

export enum TooltipSize {
	Compact = "COMPACT",
	Comfortable = "COMFORTABLE",
	Spacious = "SPACIOUS",
	ExtraLarge = "EXTRA_LARGE"
}

export interface TooltipProps {
	children: ReactNode
	content: ReactNode // Allow both string and ReactNode for backward compatibility
	direction?: TooltipDirection
	size?: TooltipSize | 'sm' | 'md' | 'lg' | 'xl' // Support both new and legacy size formats
	delayMs?: number
	// Legacy props for backward compatibility
	placement?: 'top' | 'right' | 'bottom' | 'left'
	contentClassName?: string
	widthClassName?: string
	title?: string
	open?: boolean
	/** Custom animation variants for tooltip entrance/exit */
	animationVariants?: TooltipAnimationVariants
}

export function Tooltip({ 
	children, 
	content, 
	direction = TooltipDirection.Bottom, 
	size = TooltipSize.Compact, 
	delayMs = 500,
	// Legacy props - map to new system
	placement,
	open,
	animationVariants,
	...legacyProps
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [actualPlacement, setActualPlacement] = useState(direction)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)

	// Map legacy placement to new direction system
	const preferredDirection = placement ? mapPlacementToDirection(placement) : direction

	const calculateBestPlacement = () => {
		if (!containerRef.current || !tooltipRef.current || typeof window === 'undefined') {
			return preferredDirection
		}

		const container = containerRef.current.getBoundingClientRect()
		const tooltip = tooltipRef.current.getBoundingClientRect()
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		}

		const spacing = 8 // Space between tooltip and target
		const margin = 16 // Minimum margin from viewport edge

		// Check if tooltip fits in each direction
		const canFit = {
			[TooltipDirection.Top]: container.top - tooltip.height - spacing >= margin,
			[TooltipDirection.Bottom]: container.bottom + tooltip.height + spacing <= viewport.height - margin,
			[TooltipDirection.Left]: container.left - tooltip.width - spacing >= margin,
			[TooltipDirection.Right]: container.right + tooltip.width + spacing <= viewport.width - margin
		}

		// Check horizontal space for vertical placements
		const horizontalFits = container.left + container.width / 2 - tooltip.width / 2 >= margin &&
			container.left + container.width / 2 + tooltip.width / 2 <= viewport.width - margin

		// Check vertical space for horizontal placements
		const verticalFits = container.top + container.height / 2 - tooltip.height / 2 >= margin &&
			container.top + container.height / 2 + tooltip.height / 2 <= viewport.height - margin

		// Try preferred direction first
		if (preferredDirection === TooltipDirection.Top || preferredDirection === TooltipDirection.Bottom) {
			if (canFit[preferredDirection] && horizontalFits) return preferredDirection
		} else {
			if (canFit[preferredDirection] && verticalFits) return preferredDirection
		}

		// Try opposite direction
		const opposite = {
			[TooltipDirection.Top]: TooltipDirection.Bottom,
			[TooltipDirection.Bottom]: TooltipDirection.Top,
			[TooltipDirection.Left]: TooltipDirection.Right,
			[TooltipDirection.Right]: TooltipDirection.Left
		}[preferredDirection]

		if (opposite === TooltipDirection.Top || opposite === TooltipDirection.Bottom) {
			if (canFit[opposite] && horizontalFits) return opposite
		} else {
			if (canFit[opposite] && verticalFits) return opposite
		}

		// Try other directions
		const fallbackOrder = [TooltipDirection.Bottom, TooltipDirection.Top, TooltipDirection.Right, TooltipDirection.Left]
		for (const dir of fallbackOrder) {
			if (dir === TooltipDirection.Top || dir === TooltipDirection.Bottom) {
				if (canFit[dir] && horizontalFits) return dir
			} else {
				if (canFit[dir] && verticalFits) return dir
			}
		}

		// Default to bottom if nothing fits well
		return TooltipDirection.Bottom
	}

	const handleMouseEnter = () => {
		if (open !== undefined) return // Controlled mode
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		timeoutRef.current = setTimeout(() => {
			setIsVisible(true)
		}, delayMs)
	}

	const handleMouseLeave = () => {
		if (open !== undefined) return // Controlled mode
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		setIsVisible(false)
		setActualPlacement(preferredDirection) // Reset to preferred on hide
	}

	// Update placement when tooltip becomes visible
	useEffect(() => {
		if (isVisible || open) {
			// Use requestAnimationFrame to ensure DOM is updated
			requestAnimationFrame(() => {
				const bestPlacement = calculateBestPlacement()
				setActualPlacement(bestPlacement)
			})
		}
	}, [isVisible, open, preferredDirection])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	const getSizeStyles = () => {
		// Handle both new enum values and legacy string values
		// Returns both padding and max-width classes
		switch (size) {
			case TooltipSize.Compact:
			case 'sm':
				return {
					padding: 'text-xs px-3 py-1.5',
					maxWidth: 'max-w-[min(20rem,90vw)]' // 320px max
				}
			case TooltipSize.Comfortable:
			case 'md':
				return {
					padding: 'text-sm px-4 py-2.5',
					maxWidth: 'max-w-[min(36rem,90vw)]' // 576px max
				}
			case TooltipSize.Spacious:
			case 'lg':
				return {
					padding: 'text-sm px-5 py-3.5',
					maxWidth: 'max-w-[min(56rem,90vw)]' // 896px max
				}
			case TooltipSize.ExtraLarge:
			case 'xl':
				return {
					padding: 'text-base px-6 py-4',
					maxWidth: 'max-w-[min(80rem,95vw)]' // 1280px max - very large for extensive content
				}
			default:
				return {
					padding: 'text-xs px-3 py-1.5',
					maxWidth: 'max-w-[min(20rem,90vw)]'
				}
		}
	}

	const getPositionStyles = () => {
		switch (actualPlacement) {
			case TooltipDirection.Top:
				return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
			case TooltipDirection.Bottom:
				return 'top-full left-1/2 -translate-x-1/2 mt-2'
			case TooltipDirection.Left:
				return 'right-full top-1/2 -translate-y-1/2 mr-2'
			case TooltipDirection.Right:
				return 'left-full top-1/2 -translate-y-1/2 ml-2'
		}
	}

	// Use controlled state if open prop is provided, otherwise use internal state
	const shouldShow = open !== undefined ? open : isVisible
	
	// Get size styles once to avoid multiple calls
	const sizeStyles = getSizeStyles()

	return (
		<div 
			ref={containerRef}
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			<AnimatePresence>
				{shouldShow && (
					<motion.div
						ref={tooltipRef}
						initial={animationVariants?.initial || AnimationPresets.tooltip.fade.initial}
						animate={animationVariants?.animate || AnimationPresets.tooltip.fade.animate}
						exit={animationVariants?.exit || AnimationPresets.tooltip.fade.exit}
						transition={animationVariants?.transition || AnimationPresets.tooltip.fade.transition}
						className={`absolute z-[9999] ${getPositionStyles()} pointer-events-none`}
						role="tooltip"
					>
						<div 
							className={`
								bg-[var(--c-tooltip-bg,var(--c-surface))] 
								text-[var(--c-tooltip-text,var(--c-text))] 
								border border-[var(--c-tooltip-border,var(--c-border))] 
								backdrop-blur-xl shadow-xl rounded-lg
								whitespace-normal
								${sizeStyles.padding}
								${sizeStyles.maxWidth}
							`}
						>
							{typeof content === 'string' ? (
								<div className="break-words hyphens-auto">
									{content}
								</div>
							) : (
								content
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// Helper function to map legacy placement to new direction system
function mapPlacementToDirection(placement: 'top' | 'right' | 'bottom' | 'left'): TooltipDirection {
	switch (placement) {
		case 'top': return TooltipDirection.Top
		case 'right': return TooltipDirection.Right
		case 'bottom': return TooltipDirection.Bottom
		case 'left': return TooltipDirection.Left
		default: return TooltipDirection.Bottom
	}
}