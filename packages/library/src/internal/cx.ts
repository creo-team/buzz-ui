export type ClassValue = string | number | null | false | undefined

/** Minimal class-name combiner (falsy values dropped). */
export function cx(...classes: ClassValue[]): string {
	let out = ''
	for (const c of classes) {
		if (c) out += (out ? ' ' : '') + c
	}
	return out
}
