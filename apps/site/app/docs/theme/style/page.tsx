import { Badge } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../../components/code-block'
import { StyleGallery } from '../../../../components/style-gallery'

const PRESETS = [
	{ name: 'Soft', tag: 'Default', description: 'The shipped default. Balanced corners and standard shadows — nothing to opt into; upgrading consumers see no change.' },
	{ name: 'Crisp', tag: 'Enterprise', description: 'Instrument-panel density: 2px corners, conservative shadows, compact spacing, keyboard-first focus treatment.' },
	{ name: 'Sharp', tag: 'Architectural', description: 'Tight corners and hairline-ring elevation instead of blur. Reads as precise and dashboard-dense.' },
	{ name: 'Flat', tag: 'Minimal', description: 'Hairlines and ink — shadows almost abolished, hover feedback is a wash, never a lift.' },
	{ name: 'Depth', tag: 'Cinematic', description: 'Three-layer stacked shadows; cards drop their border and let elevation carry the edge.' },
	{ name: 'Glass', tag: 'Liquid', description: 'Translucent, blurred, saturated surfaces with a specular top edge and capsule controls. Falls back to opaque where backdrop-filter is unsupported.' },
	{ name: 'Round', tag: 'Plush', description: 'Generous corners, diffuse glow shadows, and a gentle overshoot on motion.' },
	{ name: 'Puff', tag: 'Extruded', description: 'Soft-extruded controls pressed out of the page itself — both shadow poles derive from the theme background, so it survives every theme.' },
	{ name: 'Toy', tag: 'Playful', description: 'Chunky pills with a physical 3D bottom edge that collapses when pressed. Springy, bouncy motion.' },
	{ name: 'Brutal', tag: 'Neo-brutalist', description: 'Zero radius, 2px ink borders, hard offset shadows, and a press that slams into its own shadow.' },
]

export default function StyleDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Style</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					A whole look-and-feel, independent of color: corners, elevation, borders, surface
					treatment, density and motion — as one coherent personality.
				</p>
			</div>

			<section>
				<div className="bg-[var(--c-info-light)] border border-[var(--c-info)] rounded-[var(--radius-lg)] p-6">
					<p className="text-[var(--c-text)]">
						Color theme answers <em>light or dark, which brand color</em>. Style answers{' '}
						<em>what personality does this product have</em> — from enterprise instrument panel to
						liquid glass to neo-brutalism — and the two compose freely. Six color themes × ten
						styles is sixty distinct looks from one stylesheet, with zero extra CSS to write.
						Lock one in during setup, or let people choose.
					</p>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Try every style live</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					Each panel below is the same markup scoped to a different <code>data-style</code> — real
					tokens, not screenshots. Click one to apply it to the whole site.
				</p>
				<StyleGallery />
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">The ten presets</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{PRESETS.map(preset => (
						<div key={preset.name} className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-semibold text-[var(--c-text)]">{preset.name}</h3>
								<Badge variant="outline">{preset.tag}</Badge>
							</div>
							<p className="text-sm text-[var(--c-text-secondary)]">{preset.description}</p>
						</div>
					))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Setup</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					Drop <code>StyleSwitcher</code> in anywhere — it persists to its own cookie, independent
					of the color-theme cookie, and reads it back with <code>getServerStyle</code> for
					flicker-free SSR, exactly like the color theme system:
				</p>
				<CodeBlock
					code={`// app/layout.tsx
import { cookies } from 'next/headers'
import { getServerStyle, styleInitScript } from '@creo-team/buzz-ui/server'
import { StyleSwitcher } from '@creo-team/buzz-ui/client'

export default async function RootLayout({ children }) {
	const style = getServerStyle(await cookies(), 'soft')
	return (
		<html data-style={style}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: styleInitScript(style) }} />
			</head>
			<body>
				<StyleSwitcher initialStyle={style} />
				{children}
			</body>
		</html>
	)
}`}
					label="Flicker-free SSR"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Lock a style in — no JS at all</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					The switcher is a convenience. If your product should always feel a certain way, set{' '}
					<code>data-style</code> once and ship no switcher — or scope a style to a single section
					by putting the attribute on any container:
				</p>
				<CodeBlock
					code={`<!-- Whole app -->
<html data-style="glass">

<!-- Just one section (every trait is an inherited custom property) -->
<div data-style="brutal">
	<Card>…renders neo-brutalist while the rest of the page doesn't…</Card>
</div>

/* Or write your own eleventh preset */
[data-style='blueprint'] {
	--radius-sm: 0; --radius-md: 0; --radius-lg: 0;
	--bz-border-w: 1px;
	--bz-border-c: var(--c-info);
	--shadow-md: 0 0 0 0 transparent;
	--bz-duration: 100ms;
}`}
					label="Locking, scoping, extending"
				/>
				<p className="text-sm text-[var(--c-text-muted)] mt-3">
					One caveat: portaled overlays (menus, modals, toasts) render under{' '}
					<code>&lt;body&gt;</code>, so they escape a container-scoped style. Setting{' '}
					<code>data-style</code> on <code>&lt;html&gt;</code> is the supported way to style
					overlays.
				</p>
			</section>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🎨 Color Themes</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">The other half of the system.</p>
					<a href="/docs/theme" className="text-[var(--c-primary)] hover:underline font-medium">
						Theme overview →
					</a>
				</div>
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🔧 Design Tokens</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">Every token styles override.</p>
					<a href="/docs/theme/tokens" className="text-[var(--c-primary)] hover:underline font-medium">
						Token reference →
					</a>
				</div>
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🌙 Dark Mode</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">Set up color-scheme switching.</p>
					<a href="/docs/theme/dark-mode" className="text-[var(--c-primary)] hover:underline font-medium">
						Dark mode guide →
					</a>
				</div>
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🧩 Provider</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">Runtime context for color theme.</p>
					<a href="/docs/theme/provider" className="text-[var(--c-primary)] hover:underline font-medium">
						ThemeProvider →
					</a>
				</div>
			</div>
		</div>
	)
}
