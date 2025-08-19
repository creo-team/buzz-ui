"use client"
import * as React from 'react'
import { Button, ButtonVariant } from '../primitives/button'
import { Modal } from '../overlays/modal'
import { Drawer } from '../overlays/drawer'
import { CommandPalette, type CommandItem } from '../overlays/command-palette'
import { useHotkey } from '../hooks/use-hotkey'

/**
 * Demo component showcasing the hotkey system
 * This demonstrates various ways to use hotkeys across components
 */
export function HotkeyDemo() {
	const [modalOpen, setModalOpen] = React.useState(false)
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	const [paletteOpen, setPaletteOpen] = React.useState(false)
	const [message, setMessage] = React.useState('')

	// Global hotkeys (always active)
	useHotkey([
		{
			key: 'ctrl+k',
			action: () => setPaletteOpen(true),
			description: 'Open command palette'
		},
		{
			key: 'ctrl+m',
			action: () => setModalOpen(true),
			description: 'Open modal'
		},
		{
			key: 'ctrl+d',
			action: () => setDrawerOpen(true),
			description: 'Open drawer'
		}
	])

	const commands: CommandItem[] = [
		{
			id: 'open-modal',
			label: 'Open Modal',
			description: 'Open the demo modal',
			onSelect: () => setModalOpen(true),
			group: 'Actions'
		},
		{
			id: 'open-drawer',
			label: 'Open Drawer',
			description: 'Open the demo drawer',
			onSelect: () => setDrawerOpen(true),
			group: 'Actions'
		},
		{
			id: 'clear-message',
			label: 'Clear Message',
			description: 'Clear the current message',
			onSelect: () => setMessage(''),
			group: 'Actions'
		}
	]

	return (
		<div className="p-8 space-y-6">
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Hotkey System Demo</h1>
				<p className="text-[var(--c-text-secondary)]">
					This demo showcases the reusable hotkey system across different components.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Global Hotkeys</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="p-4 border border-[var(--c-border)] rounded-lg">
						<kbd className="px-2 py-1 text-xs font-mono bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded">
							Ctrl+K
						</kbd>
						<p className="mt-2 text-sm">Open Command Palette</p>
					</div>
					<div className="p-4 border border-[var(--c-border)] rounded-lg">
						<kbd className="px-2 py-1 text-xs font-mono bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded">
							Ctrl+M
						</kbd>
						<p className="mt-2 text-sm">Open Modal</p>
					</div>
					<div className="p-4 border border-[var(--c-border)] rounded-lg">
						<kbd className="px-2 py-1 text-xs font-mono bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded">
							Ctrl+D
						</kbd>
						<p className="mt-2 text-sm">Open Drawer</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Button Hotkeys</h2>
				<div className="flex flex-wrap gap-3">
					<Button 
						hotkey="ctrl+1"
						onClick={() => setMessage('Button 1 clicked!')}
						variant={ButtonVariant.Bold}
					>
						Action 1 (Ctrl+1)
					</Button>
					<Button 
						hotkey="ctrl+2"
						onClick={() => setMessage('Button 2 clicked!')}
						variant={ButtonVariant.Outline}
					>
						Action 2 (Ctrl+2)
					</Button>
					<Button 
						hotkey="ctrl+3"
						onClick={() => setMessage('Button 3 clicked!')}
						variant={ButtonVariant.Subtle}
					>
						Action 3 (Ctrl+3)
					</Button>
				</div>
				{message && (
					<div className="p-3 bg-[var(--c-primary-light)] border border-[var(--c-primary)] rounded-lg">
						<p className="text-sm font-medium">{message}</p>
					</div>
				)}
			</div>

			{/* Modal with hotkeys */}
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				header="Demo Modal"
				hotkeys={[
					{
						key: 'ctrl+s',
						action: () => {
							setMessage('Modal: Save action triggered!')
							setModalOpen(false)
						},
						description: 'Save and close'
					}
				]}
				actions={
					<>
						<Button variant={ButtonVariant.Outline} onClick={() => setModalOpen(false)}>
							Cancel
						</Button>
						<Button 
							hotkey="enter"
							onClick={() => {
								setMessage('Modal: Confirmed!')
								setModalOpen(false)
							}}
						>
							Confirm (Enter)
						</Button>
					</>
				}
			>
				<div className="space-y-4">
					<p>This modal demonstrates hotkey integration:</p>
					<ul className="space-y-2 text-sm">
						<li>• <kbd className="px-1 py-0.5 text-xs bg-[var(--c-surface-2)] rounded">Esc</kbd> - Close modal</li>
						<li>• <kbd className="px-1 py-0.5 text-xs bg-[var(--c-surface-2)] rounded">Ctrl+S</kbd> - Save and close</li>
						<li>• <kbd className="px-1 py-0.5 text-xs bg-[var(--c-surface-2)] rounded">Enter</kbd> - Confirm button</li>
					</ul>
				</div>
			</Modal>

			{/* Drawer with hotkeys */}
			<Drawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				title="Demo Drawer"
				description="Drawer with custom hotkeys"
				hotkeys={[
					{
						key: 'ctrl+shift+d',
						action: () => {
							setMessage('Drawer: Special action triggered!')
						}
					}
				]}
			>
				<div className="space-y-4">
					<p>This drawer has additional hotkeys:</p>
					<ul className="space-y-2 text-sm">
						<li>• <kbd className="px-1 py-0.5 text-xs bg-[var(--c-surface-2)] rounded">Esc</kbd> - Close drawer</li>
						<li>• <kbd className="px-1 py-0.5 text-xs bg-[var(--c-surface-2)] rounded">Ctrl+Shift+D</kbd> - Special action</li>
					</ul>
				</div>
			</Drawer>

			{/* Command Palette */}
			<CommandPalette
				open={paletteOpen}
				onOpenChange={setPaletteOpen}
				items={commands}
				placeholder="Search commands... (try typing 'open' or 'clear')"
			/>
		</div>
	)
}
