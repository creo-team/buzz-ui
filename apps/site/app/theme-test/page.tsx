import { Button, Card, getServerTheme } from '@creo-team/buzz-ui/server'
import { EnhancedThemeSwitcher, type EnhancedThemeConfig } from '@creo-team/buzz-ui/client'

const allThemes: EnhancedThemeConfig[] = [
	{ value: "light", label: "Light", icon: "sun" },
	{ value: "dark", label: "Dark", icon: "moon" },
	{ value: "midnight", label: "Midnight", icon: "palette" },
	{ value: "forest", label: "Forest", icon: "tree-pine" },
	{ value: "ocean", label: "Ocean", icon: "waves" },
	{ value: "umbro", label: "Umbro", icon: "sparkles" },
]

export default function ThemeTestPage() {
	const initialTheme = getServerTheme('light')
	
	return (
		<div className="container mx-auto p-8 space-y-8">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Multi-Theme System Test</h1>
			
			<Card>
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-[var(--c-text)]">Enhanced Theme Switcher (6 Themes)</h2>
					<p className="text-[var(--c-text-secondary)]">
						This site now supports 6 themes with a dropdown interface. Features include:
					</p>
					<ul className="list-disc list-inside space-y-1 text-[var(--c-text-secondary)]">
						<li>6 beautiful built-in themes with unique personalities</li>
						<li>Primary themes as pills, additional themes in dropdown</li>
						<li>Smooth animations with framer-motion</li>
						<li>Toast notifications when switching themes</li>
						<li>Keyboard shortcut: Option+T (Alt+T)</li>
						<li>Tooltips showing keyboard shortcuts</li>
						<li>Frosted glass backdrop blur effect</li>
					</ul>
					
					<div className="flex items-center gap-4">
						<span className="text-[var(--c-text)]">Enhanced Theme Switcher:</span>
						<EnhancedThemeSwitcher 
							primaryThemes={[
								{ value: "light", label: "Light", icon: "sun" },
								{ value: "dark", label: "Dark", icon: "moon" }
							]}
							allThemes={allThemes}
							initialTheme={initialTheme}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">☀️ Light</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Clean, bright interface with red accent colors</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">🌙 Dark</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Modern dark theme with red accent colors</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">🌌 Midnight</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Deep blue theme with purple accent colors</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">🌲 Forest</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Nature-inspired green theme</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">🌊 Ocean</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Deep blue ocean theme</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
							<h3 className="font-semibold text-[var(--c-text)] mb-2">✨ Umbro</h3>
							<p className="text-sm text-[var(--c-text-secondary)]">Dark frosted glass premium theme</p>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-[var(--c-text)]">How to Test</h2>
					<div className="space-y-2 text-[var(--c-text-secondary)]">
						<p>1. <strong>Click theme icons:</strong> Click on the sun, moon, or palette icon to switch instantly</p>
						<p>2. <strong>Use keyboard shortcut:</strong> Press <kbd className="px-2 py-1 bg-[var(--c-surface-2)] rounded text-xs">Option+T</kbd> to cycle through all themes</p>
						<p>3. <strong>Hover for tooltips:</strong> Hover over the theme icons to see labels and keyboard shortcuts</p>
						<p>4. <strong>Watch animations:</strong> Notice the smooth sliding indicator and toast notifications</p>
						<p>5. <strong>Test components:</strong> See how all components adapt to each theme below</p>
					</div>
				</div>
			</Card>

			<Card>
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-[var(--c-text)]">Component Showcase</h2>
					<p className="text-[var(--c-text-secondary)]">Switch themes to see how all components adapt:</p>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="font-medium text-[var(--c-text)]">Buttons</h3>
							<div className="flex flex-wrap gap-2">
								<Button variant="bold">Bold</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="subtle">Subtle</Button>
								<Button variant="text">Text</Button>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-medium text-[var(--c-text)]">Colors</h3>
							<div className="grid grid-cols-4 gap-2">
								<div className="h-12 rounded bg-[var(--c-primary)] flex items-center justify-center text-[var(--c-on-primary)] text-xs">Primary</div>
								<div className="h-12 rounded bg-[var(--c-surface)] border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text)] text-xs">Surface</div>
								<div className="h-12 rounded bg-[var(--c-surface-2)] flex items-center justify-center text-[var(--c-text)] text-xs">Surface 2</div>
								<div className="h-12 rounded bg-[var(--c-hover)] flex items-center justify-center text-[var(--c-text)] text-xs">Hover</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-[var(--c-text)]">Configuration Examples</h2>
					<p className="text-[var(--c-text-secondary)]">
						The theme system is flexible and can be configured per project. Here are some example configurations:
					</p>
					
					<div className="space-y-4">
						<div className="p-4 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)]">
							<h4 className="font-medium text-[var(--c-text)] mb-2">Enhanced with Dropdown</h4>
							<code className="text-xs text-[var(--c-text-secondary)]">primaryThemes: [Light, Dark] + dropdown: [Midnight, Forest, Ocean, Umbro]</code>
						</div>
						
						<div className="p-4 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)]">
							<h4 className="font-medium text-[var(--c-text)] mb-2">All in Dropdown</h4>
							<code className="text-xs text-[var(--c-text-secondary)]">primaryThemes: [] + dropdown: [Light, Dark, Midnight, Forest, Ocean, Umbro]</code>
						</div>
						
						<div className="p-4 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)]">
							<h4 className="font-medium text-[var(--c-text)] mb-2">Custom Mix</h4>
							<code className="text-xs text-[var(--c-text-secondary)]">primaryThemes: [Forest, Ocean] + dropdown: [Light, Dark, Midnight, Umbro]</code>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
