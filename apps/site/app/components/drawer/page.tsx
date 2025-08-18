"use client"
import { useState } from 'react'
import { Breadcrumbs } from '@creo-team/buzz-ui/server'
import { Button, Drawer } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '@/components/code-block'
import { ApiTable } from '@/components/api-table'

export default function DrawerPage() {
	const [rightOpen, setRightOpen] = useState(false)
	const [leftOpen, setLeftOpen] = useState(false)
	const [topOpen, setTopOpen] = useState(false)
	const [bottomOpen, setBottomOpen] = useState(false)

	return (
		<div>
			<Breadcrumbs items={[
				{ key: 'home', label: 'Home', href: '/' },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'drawer', label: 'Drawer' }
			]} />
			
			<h1 className="mt-6 text-4xl font-bold text-[var(--c-text)]">Drawer</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				A sliding panel that appears from the edge of the screen.
			</p>

			<div className="mt-10">
				<h2 className="text-2xl font-bold text-[var(--c-text)]">Examples</h2>

				<div className="mt-6">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Basic Usage</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						Click the buttons to open drawers from different sides.
					</p>
					
					<div className="mt-4 flex flex-wrap gap-4">
						<Button onClick={() => setRightOpen(true)}>
							Open Right Drawer
						</Button>
						<Button onClick={() => setLeftOpen(true)} variant="subtle">
							Open Left Drawer
						</Button>
						<Button onClick={() => setTopOpen(true)} variant="outline">
							Open Top Drawer
						</Button>
						<Button onClick={() => setBottomOpen(true)} variant="text">
							Open Bottom Drawer
						</Button>
					</div>

					<CodeBlock 
						code={`import { useState } from 'react'
import { Button, Drawer } from '@creo-team/buzz-ui/client'

export default function Example() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				Open Drawer
			</Button>
			
			<Drawer
				open={open}
				onOpenChange={setOpen}
				side="right"
				size="md"
				title="Drawer Title"
				description="This is a drawer description"
			>
				<div className="space-y-4">
					<p>Drawer content goes here.</p>
					<Button onClick={() => setOpen(false)}>
						Close Drawer
					</Button>
				</div>
			</Drawer>
		</>
	)
}`}
						label="Drawer Example"
					/>
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Sizes</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						Drawers support different sizes: sm, md, lg, xl, and full.
					</p>
				</div>

				<ApiTable
					rows={[
						{
							prop: "open",
							type: "boolean",
							required: true,
							description: "Whether the drawer is open"
						},
						{
							prop: "onOpenChange",
							type: "(open: boolean) => void",
							required: true,
							description: "Callback when open state changes"
						},
						{
							prop: "side",
							type: "'left' | 'right' | 'top' | 'bottom'",
							default: "'right'",
							description: "Which side the drawer slides from"
						},
						{
							prop: "size",
							type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
							default: "'md'",
							description: "Size of the drawer"
						},
						{
							prop: "title",
							type: "string",
							description: "Optional title for the drawer"
						},
						{
							prop: "showCloseButton",
							type: "boolean",
							default: "true",
							description: "Whether to show the close button"
						}
					]}
				/>
			</div>

			{/* Drawers */}
			<Drawer
				open={rightOpen}
				onOpenChange={setRightOpen}
				side="right"
				size="md"
				title="Right Drawer"
				description="This drawer slides in from the right side"
			>
				<div className="space-y-4">
					<p>This is the content of the right drawer. You can put any content here.</p>
					<Button onClick={() => setRightOpen(false)}>
						Close Drawer
					</Button>
				</div>
			</Drawer>

			<Drawer
				open={leftOpen}
				onOpenChange={setLeftOpen}
				side="left"
				size="md"
				title="Left Drawer"
			>
				<div className="space-y-4">
					<p>This drawer slides in from the left side.</p>
					<Button onClick={() => setLeftOpen(false)} variant="subtle">
						Close Drawer
					</Button>
				</div>
			</Drawer>

			<Drawer
				open={topOpen}
				onOpenChange={setTopOpen}
				side="top"
				size="lg"
				title="Top Drawer"
			>
				<div className="space-y-4">
					<p>This drawer slides down from the top.</p>
					<Button onClick={() => setTopOpen(false)} variant="outline">
						Close Drawer
					</Button>
				</div>
			</Drawer>

			<Drawer
				open={bottomOpen}
				onOpenChange={setBottomOpen}
				side="bottom"
				size="lg"
				title="Bottom Drawer"
			>
				<div className="space-y-4">
					<p>This drawer slides up from the bottom.</p>
					<Button onClick={() => setBottomOpen(false)} variant="text">
						Close Drawer
					</Button>
				</div>
			</Drawer>
		</div>
	)
}
