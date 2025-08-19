import { Banner } from '@creo-team/buzz-ui/server'

export function DevBanner() {
	return (
		<Banner variant="development" sticky position="top" animated>
			<span className="font-bold tracking-wide">DEVELOPMENT PREVIEW</span>
			<span className="hidden sm:inline text-amber-100/90">•</span>
			<span className="hidden sm:inline text-amber-100/90 font-normal">
				Active development in progress with experimental features
			</span>
			<span className="sm:hidden text-amber-100/90 font-normal text-xs">
				In development
			</span>
		</Banner>
	)
}