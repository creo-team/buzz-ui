"use client"

import { Tooltip, TooltipSize, TooltipDirection } from '../overlays/tooltip'
import { Button } from '../primitives/button'

const shortContent = "Short tooltip"
const mediumContent = "This is a medium length tooltip with more descriptive content that explains something important"
const longContent = "This is a much longer tooltip that contains extensive information. It might include multiple sentences explaining complex concepts, providing detailed instructions, or offering comprehensive help text. The spacious size allows for this kind of detailed content to be displayed comfortably without being too narrow or cramped. This is especially useful for onboarding flows, complex form fields, or detailed feature explanations where users need more context."

export function TooltipSizesDemo() {
	return (
		<div className="space-y-8 p-8">
			<div>
				<h2 className="text-2xl font-bold mb-4">Tooltip Size Comparison</h2>
				<p className="text-[var(--c-text-secondary)] mb-8">
					Different tooltip sizes with appropriate max-widths for various content lengths.
				</p>
			</div>

			<div className="space-y-12">
				{/* Compact Size */}
				<div>
					<h3 className="text-lg font-semibold mb-4">Compact Size (max 320px)</h3>
					<div className="flex gap-4">
						<Tooltip content={shortContent} size={TooltipSize.Compact}>
							<Button variant="outline">Short Content</Button>
						</Tooltip>
						<Tooltip content={mediumContent} size={TooltipSize.Compact}>
							<Button variant="outline">Medium Content</Button>
						</Tooltip>
						<Tooltip content={longContent} size={TooltipSize.Compact}>
							<Button variant="outline">Long Content</Button>
						</Tooltip>
					</div>
				</div>

				{/* Comfortable Size */}
				<div>
					<h3 className="text-lg font-semibold mb-4">Comfortable Size (max 576px)</h3>
					<div className="flex gap-4">
						<Tooltip content={shortContent} size={TooltipSize.Comfortable}>
							<Button variant="outline">Short Content</Button>
						</Tooltip>
						<Tooltip content={mediumContent} size={TooltipSize.Comfortable}>
							<Button variant="outline">Medium Content</Button>
						</Tooltip>
						<Tooltip content={longContent} size={TooltipSize.Comfortable}>
							<Button variant="outline">Long Content</Button>
						</Tooltip>
					</div>
				</div>

				{/* Spacious Size */}
				<div>
					<h3 className="text-lg font-semibold mb-4">Spacious Size (max 896px)</h3>
					<div className="flex gap-4">
						<Tooltip content={shortContent} size={TooltipSize.Spacious}>
							<Button variant="outline">Short Content</Button>
						</Tooltip>
						<Tooltip content={mediumContent} size={TooltipSize.Spacious}>
							<Button variant="outline">Medium Content</Button>
						</Tooltip>
						<Tooltip content={longContent} size={TooltipSize.Spacious}>
							<Button variant="outline">Long Content</Button>
						</Tooltip>
					</div>
				</div>

				{/* Edge cases */}
				<div>
					<h3 className="text-lg font-semibold mb-4">Edge Detection</h3>
					<p className="text-[var(--c-text-secondary)] mb-4">
						Tooltips near viewport edges automatically reposition to stay visible.
					</p>
					<div className="flex justify-between">
						<Tooltip 
							content="This tooltip is near the left edge and will automatically adjust its position if it would overflow" 
							size={TooltipSize.Comfortable}
							direction={TooltipDirection.Left}
						>
							<Button variant="outline">Left Edge</Button>
						</Tooltip>
						<Tooltip 
							content="This tooltip is near the right edge and will automatically adjust its position if it would overflow" 
							size={TooltipSize.Comfortable}
							direction={TooltipDirection.Right}
						>
							<Button variant="outline">Right Edge</Button>
						</Tooltip>
					</div>
				</div>

				{/* Rich content example */}
				<div>
					<h3 className="text-lg font-semibold mb-4">Rich Content</h3>
					<Tooltip 
						content={
							<div className="space-y-2">
								<div className="font-semibold">Rich Tooltip Content</div>
								<div className="text-sm">
									Tooltips can contain React components, not just strings.
								</div>
								<ul className="text-sm list-disc list-inside">
									<li>Formatted text</li>
									<li>Lists and structure</li>
									<li>Multiple paragraphs</li>
								</ul>
							</div>
						}
						size={TooltipSize.Spacious}
					>
						<Button variant="outline">Hover for Rich Content</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	)
}
