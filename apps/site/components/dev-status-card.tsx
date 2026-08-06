import { Card, Badge, Progress, Separator } from '@creo-team/buzz-ui/server'

const stats = [
	{ key: 'components', value: '35+', label: 'Components' },
	{ key: 'tests', value: '238', label: 'Tests passing' },
	{ key: 'deps', value: '0', label: 'Dependencies' },
	{ key: 'themes', value: '6', label: 'Built-in themes' },
]

export function DevStatusCard() {
	return (
		<Card variant="elevated" className="text-left">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2.5">
					<span className="relative flex h-2.5 w-2.5" aria-hidden="true">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--c-success)] opacity-60" />
						<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--c-success)]" />
					</span>
					<h3 className="text-base font-semibold text-[var(--c-text)]">Active development</h3>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline">v0.5.0</Badge>
					<Badge variant="warning">Pre-1.0</Badge>
				</div>
			</div>

			<p className="mt-3 text-sm text-[var(--c-text-secondary)] leading-relaxed">
				Core components are stable and tested, but APIs may still shift before v1.0 — pin exact
				versions in production and check the changelog when upgrading.
			</p>

			<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{stats.map(stat => (
					<div
						key={stat.key}
						className="rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2.5 text-center"
					>
						<div className="text-lg font-bold text-[var(--c-text)] tabular-nums">{stat.value}</div>
						<div className="text-[11px] font-medium uppercase tracking-wide text-[var(--c-text-muted)]">
							{stat.label}
						</div>
					</div>
				))}
			</div>

			<div className="mt-5">
				<Progress value={65} showLabel label="Road to v1.0" size="sm" shape="pill" />
			</div>

			<Separator className="my-4" />

			<div className="flex flex-wrap items-center gap-4 text-sm">
				<a
					className="text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] transition-colors no-underline font-medium"
					href="https://github.com/creo-team/buzz-ui/blob/main/packages/library/CHANGELOG.md"
				>
					Changelog →
				</a>
				<a
					className="text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] transition-colors no-underline font-medium"
					href="https://github.com/creo-team/buzz-ui/blob/main/ROADMAP.md"
				>
					Roadmap →
				</a>
				<a
					className="text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] transition-colors no-underline font-medium"
					href="/docs/migration"
				>
					Migration guide →
				</a>
			</div>
		</Card>
	)
}
