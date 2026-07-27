"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconMenu, IconX } from '../internal/icons.js'

export interface TopNavItem {
	key: string
	label: React.ReactNode
	href?: string
	onClick?: () => void
	active?: boolean
}

export interface TopNavProps {
	brand?: React.ReactNode
	items?: TopNavItem[]
	right?: React.ReactNode
	/** Rendered above the bar (e.g. a `Banner`). */
	before?: React.ReactNode
	/** Distance from the top of the viewport (number = px). */
	offsetTop?: number | string
	/** Custom link renderer (e.g. Next.js `Link`). Defaults to `<a>`. */
	linkComponent?: React.ComponentType<{
		href: string
		className: string
		children: React.ReactNode
		onClick?: (event: React.MouseEvent) => void
		'aria-current'?: 'page'
	}>
	className?: string
}

const DefaultLink: NonNullable<TopNavProps['linkComponent']> = ({ href, ...props }) => (
	<a href={href} {...props} />
)

/**
 * Fixed top navigation bar with a frosted-glass surface, active-item
 * indication and an accessible mobile menu (Escape closes, state announced).
 */
export function TopNav({
	brand,
	items = [],
	right,
	before,
	offsetTop,
	linkComponent: Link = DefaultLink,
	className,
}: TopNavProps) {
	const menuId = React.useId()
	const [mobileOpen, setMobileOpen] = React.useState(false)

	React.useEffect(() => {
		if (!mobileOpen) return
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMobileOpen(false)
		}
		document.addEventListener('keydown', onKeydown)
		return () => document.removeEventListener('keydown', onKeydown)
	}, [mobileOpen])

	const top = offsetTop !== undefined ? offsetTop : before ? 40 : 0

	const renderItem = (item: TopNavItem, mobile: boolean) => {
		const itemClass = mobile ? 'bz-top-nav__mobile-link' : 'bz-top-nav__link'
		const handleClick = () => {
			item.onClick?.()
			if (mobile) setMobileOpen(false)
		}
		const className = cx(itemClass)
		const shared = {
			className,
			'aria-current': item.active ? ('page' as const) : undefined,
			'data-active': item.active || undefined,
		}
		return item.href ? (
			<Link key={item.key} href={item.href} onClick={handleClick} {...shared}>
				{item.label}
			</Link>
		) : (
			<button key={item.key} type="button" onClick={handleClick} {...shared}>
				{item.label}
			</button>
		)
	}

	return (
		<>
			{before}
			<header className={cx('bz-top-nav', className)} style={{ top }}>
				<div className="bz-top-nav__inner">
					<div className="bz-top-nav__bar">
						{brand != null && <div className="bz-top-nav__brand">{brand}</div>}
						<nav className="bz-top-nav__nav" aria-label="Main">
							{items.map(item => renderItem(item, false))}
						</nav>
						<div className="bz-top-nav__right">
							{right}
							<button
								type="button"
								className="bz-top-nav__menu-button"
								aria-expanded={mobileOpen}
								aria-controls={menuId}
								aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
								onClick={() => setMobileOpen(open => !open)}
							>
								{mobileOpen ? <IconX /> : <IconMenu />}
							</button>
						</div>
					</div>
				</div>
				{mobileOpen && (
					<nav id={menuId} className="bz-top-nav__mobile" aria-label="Main">
						<div className="bz-top-nav__mobile-list">{items.map(item => renderItem(item, true))}</div>
					</nav>
				)}
			</header>
		</>
	)
}
