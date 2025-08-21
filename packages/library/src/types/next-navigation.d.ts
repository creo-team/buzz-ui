declare module 'next/navigation' {
	export interface NextRouter {
		push: (url: string) => void
		replace?: (url: string) => void
		back?: () => void
	}

	export interface ReadonlyURLSearchParams {
		get: (name: string) => string | null
		toString: () => string
	}

	export function useRouter(): NextRouter
	export function useSearchParams(): ReadonlyURLSearchParams
}


