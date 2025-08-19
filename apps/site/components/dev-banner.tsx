export function DevBanner() {
	return (
		<div className="fixed top-0 left-0 right-0 z-[100] w-full bg-gradient-to-r from-amber-500/95 to-amber-600/95 text-white border-b border-amber-400/30 backdrop-blur-sm shadow-lg">
			<div className="w-full px-4 sm:px-6 lg:px-8 py-2.5">
				<div className="flex items-center justify-center gap-3 text-sm font-medium">
					<span className="font-bold tracking-wide">DEVELOPMENT PREVIEW</span>
					<span className="hidden sm:inline text-amber-100/90">•</span>
					<span className="hidden sm:inline text-amber-100/90 font-normal">
						Active development in progress with experimental features
					</span>
					<span className="sm:hidden text-amber-100/90 font-normal text-xs">
						In development
					</span>
				</div>
			</div>
		</div>
	)
}