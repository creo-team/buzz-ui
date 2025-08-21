"use client"
import { Button, Tooltip } from '@creo-team/buzz-ui/client'

export default function DebugTooltip() {
	return (
		<div className="p-8 space-y-8">
			<h1>Tooltip Debug</h1>
			
			<div className="grid grid-cols-2 gap-8">
				<div className="space-y-4">
					<h2>Top Tooltip</h2>
					<div className="flex justify-center">
						<Tooltip content="Top tooltip" placement="top">
							<Button>Top</Button>
						</Tooltip>
					</div>
				</div>
				
				<div className="space-y-4">
					<h2>Bottom Tooltip</h2>
					<div className="flex justify-center">
						<Tooltip content="Bottom tooltip" placement="bottom">
							<Button>Bottom</Button>
						</Tooltip>
					</div>
				</div>
				
				<div className="space-y-4">
					<h2>Left Tooltip</h2>
					<div className="flex justify-center">
						<Tooltip content="Left tooltip" placement="left">
							<Button>Left</Button>
						</Tooltip>
					</div>
				</div>
				
				<div className="space-y-4">
					<h2>Right Tooltip</h2>
					<div className="flex justify-center">
						<Tooltip content="Right tooltip" placement="right">
							<Button>Right</Button>
						</Tooltip>
					</div>
				</div>
			</div>
			
			{/* Debug info */}
			<div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
				<h3>Debug Info</h3>
				<p>Check the positioning of tooltips above. They should be:</p>
				<ul>
					<li>Top: Above button, horizontally centered</li>
					<li>Bottom: Below button, horizontally centered</li>
					<li>Left: Left of button, vertically centered</li>
					<li>Right: Right of button, vertically centered</li>
				</ul>
			</div>
		</div>
	)
}
