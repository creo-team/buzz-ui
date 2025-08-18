'use client'

import { CodeBlock } from '../../../components/code-block'

export default function ThemeSystemPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Theme System</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					Understanding Buzz UI's powerful and flexible theming capabilities.
				</p>
			</div>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Do You Need the Theme Provider?</h2>
				
				<div className="space-y-6">
					<div className="bg-[var(--c-info-light)] border border-[var(--c-info)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-info)] mb-3">💡 It Depends on Your Needs</h3>
						<div className="space-y-4 text-[var(--c-text)]">
							<div>
								<h4 className="font-medium mb-2">✅ Use ThemeProvider if you want:</h4>
								<ul className="space-y-1 text-sm ml-4">
									<li>• Dark mode switching</li>
									<li>• Multiple theme variants</li>
									<li>• Persistent theme preferences</li>
									<li>• Runtime theme switching</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium mb-2">❌ Skip ThemeProvider if you have:</h4>
								<ul className="space-y-1 text-sm ml-4">
									<li>• Static theme (no switching needed)</li>
									<li>• Custom theme management</li>
									<li>• Just using CSS variables directly</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Centralized Design System</h2>
				<p className="text-[var(--c-text-secondary)] mb-6">
					<strong>Yes!</strong> Buzz UI has a completely centralized design system with customizable:
				</p>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">🎨 Color Palette</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--c-primary</span>
								<div className="w-6 h-6 rounded bg-[var(--c-primary)] border border-[var(--c-border)]"></div>
							</div>
							<div className="flex items-center justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--c-success</span>
								<div className="w-6 h-6 rounded bg-[var(--c-success)] border border-[var(--c-border)]"></div>
							</div>
							<div className="flex items-center justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--c-warning</span>
								<div className="w-6 h-6 rounded bg-[var(--c-warning)] border border-[var(--c-border)]"></div>
							</div>
							<div className="flex items-center justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--c-danger</span>
								<div className="w-6 h-6 rounded bg-[var(--c-danger)] border border-[var(--c-border)]"></div>
							</div>
						</div>
					</div>

					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">📐 Design Tokens</h3>
						<div className="space-y-3">
							<div className="flex justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--radius-sm</span>
								<span className="text-[var(--c-text-secondary)] text-sm">6px</span>
							</div>
							<div className="flex justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--radius-md</span>
								<span className="text-[var(--c-text-secondary)] text-sm">8px</span>
							</div>
							<div className="flex justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--radius-lg</span>
								<span className="text-[var(--c-text-secondary)] text-sm">10px</span>
							</div>
							<div className="flex justify-between p-2 bg-[var(--c-surface-2)] rounded-[var(--radius-sm)]">
								<span className="font-mono text-sm">--shadow-md</span>
								<span className="text-[var(--c-text-secondary)] text-sm">Drop shadows</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Easy Customization</h2>
				
				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Make Everything More Rounded</h3>
						<CodeBlock 
							code={`:root {
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}`}
							label="More Rounded Design"
						/>
					</div>

					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Create a Purple Theme</h3>
						<CodeBlock 
							code={`:root {
  --c-primary: #7c3aed;
  --c-primary-hover: #6d28d9;
  --c-primary-light: #f3e8ff;
}

.dark {
  --c-primary: #a855f7;
  --c-primary-hover: #9333ea;
}`}
							label="Purple Color Scheme"
						/>
					</div>

					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Customize Shadows</h3>
						<CodeBlock 
							code={`:root {
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 8px 16px rgba(0,0,0,0.15);
  --shadow-lg: 0 16px 32px rgba(0,0,0,0.2);
}`}
							label="Custom Shadow System"
						/>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4">Theme Options</h2>
				
				<div className="space-y-6">
					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">Option 1: CSS Variables Only</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Use just the CSS variables without the theme provider:
						</p>
						<CodeBlock 
							code={`/* Add to your globals.css */
:root {
  --c-primary: #your-color;
  --radius-md: 12px;
}

/* Use in components */
.my-button {
  background: var(--c-primary);
  border-radius: var(--radius-md);
}`}
							label="CSS Variables Approach"
						/>
						<div className="mt-3 text-sm text-[var(--c-text-secondary)]">
							✅ Simple • ✅ No JS overhead • ❌ No runtime switching
						</div>
					</div>

					<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">Option 2: Theme Provider</h3>
						<p className="text-[var(--c-text-secondary)] mb-4">
							Use the theme provider for dynamic theme switching:
						</p>
						<CodeBlock 
							code={`import { ThemeProvider } from '@creo-team/buzz-ui'

export default function App({ children }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}`}
							label="Theme Provider Setup"
						/>
						<div className="mt-3 text-sm text-[var(--c-text-secondary)]">
							✅ Runtime switching • ✅ Persistent preferences • ✅ Multiple themes
						</div>
					</div>
				</div>
			</section>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🎨 Custom Colors</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">
						Learn how to customize the color palette.
					</p>
					<a href="/docs/theme/colors" className="text-[var(--c-primary)] hover:underline font-medium">
						Color Guide →
					</a>
				</div>

				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🔧 Design Tokens</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">
						Complete reference of all design tokens.
					</p>
					<a href="/docs/theme/tokens" className="text-[var(--c-primary)] hover:underline font-medium">
						Token Reference →
					</a>
				</div>

				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
					<h3 className="text-lg font-semibold text-[var(--c-text)] mb-3">🌙 Dark Mode</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">
						Set up dark mode with theme switching.
					</p>
					<a href="/docs/theme/dark-mode" className="text-[var(--c-primary)] hover:underline font-medium">
						Dark Mode Guide →
					</a>
				</div>
			</div>
		</div>
	)
}