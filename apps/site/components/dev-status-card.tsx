import { Card } from '@creo-team/buzz-ui/client'

export function DevStatusCard() {
	return (
		<Card variant="elevated" className="border-[var(--c-warning)]/20 bg-gradient-to-br from-[var(--c-warning-light)]/50 to-[var(--c-warning-light)]/30">
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-1">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c-warning-light)]">
						<svg 
							className="h-5 w-5 text-[var(--c-warning)]" 
							fill="currentColor" 
							viewBox="0 0 20 20"
						>
							<path 
								fillRule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
								clipRule="evenodd" 
							/>
						</svg>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-2">
						Development Status
					</h3>
					<p className="text-sm text-[var(--c-text-secondary)] leading-relaxed">
						Buzz UI is currently in active development. Core components are stable and production-ready, 
						but expect frequent updates and potential API changes as we iterate toward v1.0. 
						We recommend pinning to specific versions in production environments.
					</p>
				</div>
			</div>
		</Card>
	)
}
