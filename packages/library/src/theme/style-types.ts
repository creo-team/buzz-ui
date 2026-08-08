/**
 * The "style" dimension — a holistic look-and-feel, kept orthogonal to
 * color theme: corner radius, elevation character, border weight, surface
 * treatment (opaque vs. glass), spacing density and motion feel, as one
 * coherent personality per preset. Any style combines with any color theme
 * (e.g. "Ocean + Glass" or "Umbro + Brutal"): 6 themes x 10 styles = 60
 * looks from one stylesheet, zero extra CSS to write.
 */
export enum Style {
	Soft = 'soft',
	Crisp = 'crisp',
	Sharp = 'sharp',
	Flat = 'flat',
	Depth = 'depth',
	Glass = 'glass',
	Round = 'round',
	Puff = 'puff',
	Toy = 'toy',
	Brutal = 'brutal',
}

export interface StyleConfig {
	value: Style | string
	label: string
	/** Short personality description shown by pickers that have room for one. */
	description?: string
}

/**
 * Built-in style presets, ordered professional → playful:
 *  - soft   — the shipped default. Balanced corners, standard shadows.
 *  - crisp  — enterprise instrument panel: 2px corners, dense, keyboard-first.
 *  - sharp  — architectural precision: tight corners, hairline-ring elevation.
 *  - flat   — quiet utility: hairlines and ink, shadows almost abolished.
 *  - depth  — cinematic layered elevation: surfaces float on stacked shadows.
 *  - glass  — luminous liquid translucency: blurred, saturated, capsule controls.
 *  - round  — warm and plush: generous corners, diffuse glow, gentle overshoot.
 *  - puff   — soft-extruded: controls pressed out of the page itself.
 *  - toy    — chunky and bouncy: pills with a physical 3D press.
 *  - brutal — neo-brutalism: zero radius, ink borders, hard offset shadows.
 */
export const ALL_STYLES: StyleConfig[] = [
	{ value: Style.Soft, label: 'Soft', description: 'Balanced and quiet — the default' },
	{ value: Style.Crisp, label: 'Crisp', description: 'Dense instrument panel' },
	{ value: Style.Sharp, label: 'Sharp', description: 'Architectural precision' },
	{ value: Style.Flat, label: 'Flat', description: 'Hairlines and ink, no shadows' },
	{ value: Style.Depth, label: 'Depth', description: 'Cinematic layered elevation' },
	{ value: Style.Glass, label: 'Glass', description: 'Luminous liquid translucency' },
	{ value: Style.Round, label: 'Round', description: 'Generous corners, plush glow' },
	{ value: Style.Puff, label: 'Puff', description: 'Soft-extruded from the page' },
	{ value: Style.Toy, label: 'Toy', description: 'Chunky, bouncy, 3D press' },
	{ value: Style.Brutal, label: 'Brutal', description: 'Ink borders, hard offsets' },
]

export const STYLE_COOKIE_NAME = 'style'

export function setStyleCookie(style: Style | string): void {
	document.cookie = `${STYLE_COOKIE_NAME}=${style}; path=/; max-age=31536000; SameSite=Lax`
}

export function getStyleFromCookie(defaultStyle: Style | string = Style.Soft): string {
	if (typeof document === 'undefined') return defaultStyle.toString()

	const saved = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${STYLE_COOKIE_NAME}=`))
		?.split('=')[1]

	return saved || defaultStyle.toString()
}
