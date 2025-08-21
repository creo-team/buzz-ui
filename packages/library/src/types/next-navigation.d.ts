declare module 'next/navigation' {
	// Minimal shims to satisfy typecheck during library publish
	export function useSearchParams(): URLSearchParams
	export function useRouter(): { push: (href: string) => void }
}


