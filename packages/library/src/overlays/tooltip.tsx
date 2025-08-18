"use client"
import * as React from 'react'

export interface TooltipProps {
	content: React.ReactNode
	children: React.ReactElement<any, any>
	open?: boolean
	delayMs?: number
	placement?: 'top' | 'right' | 'bottom' | 'left'
	contentClassName?: string
	widthClassName?: string
	title?: string
	size?: 'sm' | 'md' | 'lg'
}

const placementToClasses: Record<NonNullable<TooltipProps['placement']>, string> = {
	bottom: 'left-1/2 top-full -translate-x-1/2 mt-2',
	left: 'right-full top-1/2 -translate-y-1/2 mr-2',
	right: 'left-full top-1/2 -translate-y-1/2 ml-2',
	top: 'left-1/2 bottom-full -translate-x-1/2 mb-2',
}

const sizeToClasses: Record<NonNullable<TooltipProps['size']>, string> = {
	sm: 'text-xs px-3 py-2',
	md: 'text-sm px-4 py-2.5',
	lg: 'text-sm px-5 py-3.5',
}

export function Tooltip({ 
	content, 
	children, 
	open, 
	delayMs = 200, 
	placement = 'top', 
	contentClassName = 'whitespace-nowrap', 
	widthClassName = 'max-w-xs',
	size = 'sm',
	title
}: TooltipProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const [actualPlacement, setActualPlacement] = React.useState(placement)
	const timeoutRef = React.useRef<number | null>(null)
	const triggerRef = React.useRef<HTMLElement | null>(null)
	const panelRef = React.useRef<HTMLDivElement | null>(null)

	const calculateBestPlacement = React.useCallback(() => {
		if (!triggerRef.current || typeof window === 'undefined') return placement
		
		try {
			const rect = triggerRef.current.getBoundingClientRect()
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight
			}
			
			// Estimate tooltip dimensions
			const tooltipWidth = 320 // Approximate max width
			const tooltipHeight = 40 // Approximate height
			const margin = 8
			
			let bestPlacement = placement
			
			// Check if preferred placement would go off-screen and flip if needed
			switch (placement) {
				case 'bottom':
					if (rect.bottom + tooltipHeight + margin > viewport.height) {
						bestPlacement = 'top'
					}
					break
				case 'top':
					if (rect.top - tooltipHeight - margin < 0) {
						bestPlacement = 'bottom'
					}
					break
				case 'right':
					if (rect.right + tooltipWidth + margin > viewport.width) {
						bestPlacement = 'left'
					}
					break
				case 'left':
					if (rect.left - tooltipWidth - margin < 0) {
						bestPlacement = 'right'
					}
					break
			}
			
			return bestPlacement
		} catch {
			return placement
		}
	}, [placement])

	const show = React.useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
		timeoutRef.current = window.setTimeout(() => {
			setActualPlacement(calculateBestPlacement())
			setIsOpen(true)
		}, delayMs)
	}, [delayMs, calculateBestPlacement])

	const hide = React.useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
		setIsOpen(false)
	}, [])

	React.useEffect(() => {
		if (!isOpen) return
		const onKeyDown = (e: KeyboardEvent) => { 
			if (e.key === 'Escape') setIsOpen(false) 
		}
		const onClick = (e: MouseEvent) => {
			const target = e.target as Node
			if (panelRef.current && panelRef.current.contains(target)) return
			if (triggerRef.current && triggerRef.current.contains(target)) return
			setIsOpen(false)
		}
		document.addEventListener('keydown', onKeyDown)
		document.addEventListener('mousedown', onClick)
		return () => { 
			document.removeEventListener('keydown', onKeyDown)
			document.removeEventListener('mousedown', onClick) 
		}
	}, [isOpen])

	const controlled = open !== undefined
	const shouldShow = controlled ? open : isOpen

	const tooltipContent = shouldShow && (
		<div 
			ref={panelRef}
			className={`pointer-events-none absolute z-[100] ${placementToClasses[actualPlacement]} ${widthClassName}`}
			role="tooltip"
			style={{
				opacity: shouldShow ? 1 : 0,
				transform: `${placementToClasses[actualPlacement].includes('translate') ? '' : 'translateY(0)'} scale(${shouldShow ? 1 : 0.95})`,
				transition: 'opacity 150ms ease-out, transform 150ms ease-out'
			}}
		>
			<div className={`rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur-sm shadow-lg ${sizeToClasses[size]} text-[var(--c-text)]`}>
				{title && <div className="mb-1 text-[11px] font-semibold text-[var(--c-text)]">{title}</div>}
				<div className={contentClassName}>{content}</div>
			</div>
		</div>
	)

	return (
		<span 
			className="relative inline-flex" 
			onMouseEnter={show} 
			onMouseLeave={hide}
			onFocus={show} 
			onBlur={(e) => {
				const next = e.relatedTarget as Node | null
				if (!next) return
				if (panelRef.current && panelRef.current.contains(next)) return
				hide()
			}}
		>
			{React.cloneElement(children, {
				ref: (node: HTMLElement) => {
					triggerRef.current = node
					const originalRef = (children as any).ref
					if (typeof originalRef === 'function') originalRef(node)
					else if (originalRef && typeof originalRef === 'object') originalRef.current = node
				},
				'aria-expanded': shouldShow,
				title: typeof content === 'string' ? content : title,
			})}
			{tooltipContent}
		</span>
	)
}

