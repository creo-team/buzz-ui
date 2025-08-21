"use client"
import * as React from 'react'

export enum TabsVariant {
	Default = 'default',
	Pills = 'pills',
	Underline = 'underline',
	Buttons = 'buttons',
	Glass = 'glass'
}

export enum TabsSize {
	Small = 'sm',
	Medium = 'md',
	Large = 'lg'
}

export interface TabItem { 
	key: string
	label: React.ReactNode
	icon?: React.ReactNode
	badge?: string | number
	disabled?: boolean
}

export interface TabsProps {
	items: TabItem[]
	value: string
	onChange: (key: string) => void
	variant?: TabsVariant | `${TabsVariant}`
	size?: TabsSize | `${TabsSize}`
	fullWidth?: boolean
	className?: string
}

const sizeClasses = {
	[TabsSize.Small]: 'text-xs px-3 py-1.5',
	[TabsSize.Medium]: 'text-sm px-4 py-2',
	[TabsSize.Large]: 'text-base px-5 py-2.5'
}

export function Tabs({ 
	items, 
	value, 
	onChange,
	variant = TabsVariant.Default,
	size = TabsSize.Medium,
	fullWidth = false,
	className = ''
}: TabsProps) {
	const containerClasses = {
		[TabsVariant.Default]: 'inline-flex gap-0.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/50 p-0.5',
		[TabsVariant.Pills]: 'inline-flex gap-2',
		[TabsVariant.Underline]: 'flex border-b border-[var(--c-border)]',
		[TabsVariant.Buttons]: 'inline-flex gap-1',
		[TabsVariant.Glass]: 'inline-flex gap-1 rounded-xl bg-white/8 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/10 dark:border-white/5 p-1'
	}
	
	const getItemClasses = (item: TabItem) => {
		const isActive = value === item.key
		const baseClasses = `
			relative flex items-center gap-2 font-medium transition-all duration-200
			${sizeClasses[size as TabsSize]}
			${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
			${fullWidth ? 'flex-1 justify-center' : ''}
		`
		
		switch (variant as TabsVariant) {
			case TabsVariant.Pills:
				return `${baseClasses} rounded-xl ${
					isActive 
						? 'bg-[var(--c-primary)] text-white shadow-md' 
						: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]/40'
				}`
			
			case TabsVariant.Underline:
				return `${baseClasses} rounded-none border-b-2 ${
					isActive
						? 'border-[var(--c-primary)] text-[var(--c-primary)]'
						: 'border-transparent text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:border-[var(--c-border-strong)]'
				}`
			
			case TabsVariant.Buttons:
				return `${baseClasses} rounded-xl border ${
					isActive
						? 'bg-[var(--c-primary)] text-white border-[var(--c-primary)] shadow-sm'
						: 'border-[var(--c-border)] text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]/30 hover:border-[var(--c-border-strong)]'
				}`
			
			case TabsVariant.Glass:
				return `${baseClasses} rounded-lg ${
					isActive
						? 'bg-white/15 dark:bg-white/10 text-[var(--c-text)] shadow-sm'
						: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-white/10 dark:hover:bg-white/5'
				}`
			
			default: // default
				return `${baseClasses} rounded-lg ${
					isActive
						? 'bg-[var(--c-hover)]/60 text-[var(--c-text)]'
						: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]/20'
				}`
		}
	}
	
	const containerClass = fullWidth ? 'flex w-full' : containerClasses[variant as TabsVariant]
	
	return (
		<div className={`${containerClass} ${className}`} role="tablist">
			{items.map(item => (
				<button
					key={item.key}
					onClick={() => !item.disabled && onChange(item.key)}
					className={getItemClasses(item)}
					role="tab"
					aria-selected={value === item.key}
					aria-disabled={item.disabled}
					disabled={item.disabled}
				>
					{item.icon && (
						<span className="flex-shrink-0">
							{item.icon}
						</span>
					)}
					<span>{item.label}</span>
					{item.badge !== undefined && (
						<span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold bg-[var(--c-primary)] text-white rounded-full">
							{item.badge}
						</span>
					)}
					{variant === TabsVariant.Underline && value === item.key && (
						<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--c-primary)]" />
					)}
				</button>
			))}
		</div>
	)
}

// TabPanel component for tab content
export interface TabPanelProps {
	value: string
	selectedValue: string
	children: React.ReactNode
	className?: string
}

export function TabPanel({ value, selectedValue, children, className = '' }: TabPanelProps) {
	if (value !== selectedValue) return null
	
	return (
		<div 
			role="tabpanel"
			className={`animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ${className}`}
		>
			{children}
		</div>
	)
}