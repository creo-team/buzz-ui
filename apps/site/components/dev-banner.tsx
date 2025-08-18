export function DevBanner() {
	return (
		<div className="fixed inset-x-0 top-0 z-[60] w-full bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 backdrop-blur-sm text-white border-b border-amber-400/30 shadow-lg">
			<div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
			<div className="relative w-full px-4 sm:px-6 lg:px-8 py-2.5">
				<div className="flex items-center justify-center gap-3 text-sm font-medium">
					<div className="flex-shrink-0">
						<div className="relative">
							<svg className="h-4 w-4 text-amber-100 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
							</svg>
							<div className="absolute -inset-1 bg-amber-200/20 rounded-full animate-ping" />
						</div>
					</div>
					<div className="flex items-center gap-1.5">
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
		</div>
	)
}
