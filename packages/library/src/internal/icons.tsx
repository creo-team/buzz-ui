import * as React from 'react'

/**
 * Internal icon set. Hand-rolled 24×24 stroke icons so the library ships with
 * zero dependencies. All are server-component safe (pure SVG, no hooks).
 */
export type IconProps = React.SVGProps<SVGSVGElement>

function createIcon(paths: React.ReactNode, displayName: string) {
	const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
		return (
			<svg
				ref={ref}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="1em"
				height="1em"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				focusable="false"
				{...props}
			>
				{paths}
			</svg>
		)
	})
	Icon.displayName = displayName
	return Icon
}

export const IconCheck = createIcon(<path d="M20 6 9 17l-5-5" />, 'IconCheck')

export const IconX = createIcon(
	<>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</>,
	'IconX'
)

export const IconChevronDown = createIcon(<path d="m6 9 6 6 6-6" />, 'IconChevronDown')
export const IconChevronUp = createIcon(<path d="m18 15-6-6-6 6" />, 'IconChevronUp')
export const IconChevronLeft = createIcon(<path d="m15 18-6-6 6-6" />, 'IconChevronLeft')
export const IconChevronRight = createIcon(<path d="m9 18 6-6-6-6" />, 'IconChevronRight')

export const IconSearch = createIcon(
	<>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</>,
	'IconSearch'
)

export const IconInfo = createIcon(
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	</>,
	'IconInfo'
)

export const IconWarning = createIcon(
	<>
		<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
		<path d="M12 9v4" />
		<path d="M12 17h.01" />
	</>,
	'IconWarning'
)

export const IconDanger = createIcon(
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 8v4" />
		<path d="M12 16h.01" />
	</>,
	'IconDanger'
)

export const IconSuccess = createIcon(
	<>
		<circle cx="12" cy="12" r="10" />
		<path d="m9 12 2 2 4-4" />
	</>,
	'IconSuccess'
)

export const IconCopy = createIcon(
	<>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</>,
	'IconCopy'
)

export const IconMenu = createIcon(
	<>
		<path d="M4 6h16" />
		<path d="M4 12h16" />
		<path d="M4 18h16" />
	</>,
	'IconMenu'
)

export const IconEllipsis = createIcon(
	<>
		<circle cx="12" cy="12" r="1" />
		<circle cx="19" cy="12" r="1" />
		<circle cx="5" cy="12" r="1" />
	</>,
	'IconEllipsis'
)

export const IconSun = createIcon(
	<>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</>,
	'IconSun'
)

export const IconMoon = createIcon(
	<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
	'IconMoon'
)

export const IconPalette = createIcon(
	<>
		<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
		<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
		<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
		<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
		<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
	</>,
	'IconPalette'
)

export const IconTree = createIcon(
	<>
		<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
		<path d="M12 22v-3" />
	</>,
	'IconTree'
)

export const IconWaves = createIcon(
	<>
		<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
		<path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
		<path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
	</>,
	'IconWaves'
)

export const IconSparkles = createIcon(
	<>
		<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
		<path d="M20 3v4" />
		<path d="M22 5h-4" />
	</>,
	'IconSparkles'
)
