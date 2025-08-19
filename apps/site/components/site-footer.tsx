"use client"
import { Footer } from '@creo-team/buzz-ui/server'
import { Tooltip, TooltipDirection, TooltipSize } from '@creo-team/buzz-ui/client'
import packageJson from '../package.json'

// This will be generated at build time
let deploymentTime: string
let buildId: string
let environment: string

try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const metadata = require('../deployment-metadata.json')
	deploymentTime = metadata.deploymentTime
	buildId = metadata.buildId
	environment = metadata.environment
} catch {
	// Local development fallback
	deploymentTime = 'local'
	buildId = 'local'
	environment = 'development'
}

export function SiteFooter() {
	const formatDeploymentInfo = () => {
		if (deploymentTime === 'local') {
			return 'Local Development'
		}
		
		try {
			const date = new Date(deploymentTime)
			const formatted = date.toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
				timeZoneName: 'short'
			})
			
			// Include build ID for production deployments
			if (buildId && buildId !== 'local') {
				const shortBuildId = buildId.substring(0, 7)
				return `Deployed: ${formatted} (${shortBuildId})`
			}
			
			return `Deployed: ${formatted}`
		} catch {
			return 'Deployment info unavailable'
		}
	}

	const versionElement = (
		<span className="text-[var(--c-text-muted)] hover:text-[var(--c-text-secondary)] transition-colors">
			{packageJson.version}
		</span>
	)

	// Wrap in link to GitHub release if it's a proper version
	const versionDisplay = packageJson.version.includes('.') ? (
		<a 
			href={`https://github.com/creo-team/buzz-ui/releases/tag/v${packageJson.version}`}
			target="_blank"
			rel="noopener noreferrer"
			className="no-underline"
		>
			{versionElement}
		</a>
	) : versionElement

	return (
		<Footer
			links={[
				{ key: 'github', label: 'GitHub', href: 'https://github.com/creo-team/buzz-ui' },
				{ key: 'npm', label: 'npm', href: 'https://www.npmjs.com/package/@creo-team/buzz-ui' },
				{ key: 'privacy', label: 'Privacy', href: '/privacy' },
				{ key: 'terms', label: 'Terms', href: '/terms' },
			]}
			copyright={
				<div className="flex items-center gap-3">
					<span>© {new Date().getFullYear()} Creo Team</span>
					<span className="text-[var(--c-text-muted)]">•</span>
					<Tooltip 
						content={formatDeploymentInfo()}
						direction={TooltipDirection.Top}
						size={TooltipSize.Compact}
						delayMs={300}
					>
						{versionDisplay}
					</Tooltip>
				</div>
			}
		/>
	)
}

