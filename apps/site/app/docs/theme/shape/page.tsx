import { Card, Badge, TextInput } from '@creo-team/buzz-ui/server'
import { Button, ShapeSwitcher } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../../components/code-block'

const PRESETS = [
	{
		name: 'Sharp',
		tag: 'Architectural',
		description:
			'Tight corners, flat shadows, snappy 120ms motion. Reads as precise and dashboard-dense — a Linear or Vercel-console feel.',
	},
	{
		name: 'Soft',
		tag: 'Default',
		description:
			'The shipped default. Balanced corners and shadows — nothing to opt into, upgrading consumers see no change.',
	},
	{
		name: 'Round',
		tag: 'Plush',
		description:
			'Generous corners, soft glow shadows, a gentle 220ms overshoot. Warm and consumer-friendly — an Arc or Craft feel.',
	},
]

export default function ShapeDocsPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Shape</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					A second design dimension, independent of color: corner radius, elevation and motion feel.
				</p>
			</div>

			<section>
				<div className="bg-[var(--c-info-light)] border border-[var(--c-info)] rounded-[var(--radius-lg)] p-6">
					<p className="text-[var(--c-text)]">
						Color theme answers <em>light or dark, which brand color</em>. Shape answers a completely
						different question — <em>how tight are the corners, how heavy are the shadows, how snappy
						is the motion</em> — and the two combine freely. Six color themes × three shapes is eighteen
						distinct looks from one stylesheet, with zero extra CSS to write.
					</p>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Try it live</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					This switches every rectangular surface on the page — including the one in the top nav.
				</p>
				<Card className="flex flex-col items-center gap-6 p-8">
					<ShapeSwitcher />
					<div className="w-full max-w-sm space-y-4">
						<Card variant="elevated" className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-[var(--c-text)]">Team plan</span>
								<Badge variant="success">Active</Badge>
							</div>
							<TextInput label="Workspace name" defaultValue="Acme Inc." />
							<Button className="w-full">Save changes</Button>
						</Card>
					</div>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">The three presets</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
					Drop <code>ShapeSwitcher</code> in anywhere — it persists to its own cookie, independent of
					the color-theme cookie, and reads it back with <code>getServerShape</code> for flicker-free
					SSR, exactly like the color theme system:
				</p>
				<CodeBlock
					code={`// app/layout.tsx
import { cookies } from 'next/headers'
import { getServerShape, shapeInitScript } from '@creo-team/buzz-ui/server'
import { ShapeSwitcher } from '@creo-team/buzz-ui/client'

export default async function RootLayout({ children }) {
	const shape = getServerShape(await cookies(), 'soft')
	return (
		<html data-shape={shape}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: shapeInitScript(shape) }} />
			</head>
			<body>
				<ShapeSwitcher initialShape={shape} />
				{children}
			</body>
		</html>
	)
}`}
					label="Flicker-free SSR"
				/>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Pure CSS, no JS at all</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					The switcher is a convenience — the underlying mechanism is three plain attribute selectors.
					Set <code>data-shape</code> on <code>&lt;html&gt;</code> by hand, or write your own preset:
				</p>
				<CodeBlock
					code={`<html data-shape="round">

/* Your own fourth preset — the switcher can drive it too,
   just add it to the \`shapes\` prop with a matching value. */
[data-shape='brutalist'] {
	--radius-sm: 0;
	--radius-md: 0;
	--radius-lg: 0;
	--radius-xl: 0;
	--shadow-md: none;
	--bz-duration: 0ms;
}`}
					label="Extending the system"
				/>
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
					<p className="text-[var(--c-text-secondary)] mb-4">Every token shape overrides.</p>
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
