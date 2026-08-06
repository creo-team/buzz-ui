/**
 * The "shape" dimension — corner radius, elevation and motion feel — kept
 * orthogonal to color theme. Any shape combines with any color theme (e.g.
 * "Ocean + Sharp" or "Umbro + Round"): 6 themes × 3 shapes = 18 looks from
 * one stylesheet, zero extra CSS to write.
 */
export enum Shape {
	Sharp = 'sharp',
	Soft = 'soft',
	Round = 'round',
}

export interface ShapeConfig {
	value: Shape | string
	label: string
	/** Short description shown by switchers that have room for one. */
	description?: string
}

/**
 * Built-in shape presets:
 *  - Sharp  — tight corners, flat shadows, snappy motion. Architectural,
 *    editorial, dashboard-dense (Linear/Vercel-adjacent).
 *  - Soft   — the shipped default. Balanced corners and shadows.
 *  - Round  — generous corners, soft glow shadows, gentle overshoot motion.
 *    Warm and consumer-friendly (Arc/Craft-adjacent).
 */
export const ALL_SHAPES: ShapeConfig[] = [
	{ value: Shape.Sharp, label: 'Sharp', description: 'Tight corners, flat shadows' },
	{ value: Shape.Soft, label: 'Soft', description: 'Balanced, the default' },
	{ value: Shape.Round, label: 'Round', description: 'Generous corners, soft glow' },
]

export const SHAPE_COOKIE_NAME = 'shape'

export function setShapeCookie(shape: Shape | string): void {
	document.cookie = `${SHAPE_COOKIE_NAME}=${shape}; path=/; max-age=31536000; SameSite=Lax`
}

export function getShapeFromCookie(defaultShape: Shape | string = Shape.Soft): string {
	if (typeof document === 'undefined') return defaultShape.toString()

	const saved = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${SHAPE_COOKIE_NAME}=`))
		?.split('=')[1]

	return saved || defaultShape.toString()
}
