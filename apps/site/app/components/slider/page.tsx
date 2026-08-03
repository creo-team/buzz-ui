"use client"
import React from 'react'
import { Card } from '@creo-team/buzz-ui/server'
import { Slider } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

export default function SliderDocs() {
	const [volume, setVolume] = React.useState(65)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Slider</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				Range input built on the native platform control — arrows, Home/End, PageUp/PageDown,
				form submission and screen-reader semantics all come for free. The library adds the
				themed track, filled progress, marks and value display.
			</p>

			<Card className="mt-6" header="Basic">
				<div className="max-w-md space-y-8">
					<Slider label="Volume" value={volume} onChange={setVolume} formatValue={v => `${v}%`} />
					<Slider label="Opacity" defaultValue={40} />
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`import { Slider } from '@creo-team/buzz-ui/client'

// Controlled
<Slider label="Volume" value={volume} onChange={setVolume} formatValue={v => \`\${v}%\`} />

// Uncontrolled
<Slider label="Opacity" defaultValue={40} />`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Steps and marks">
				<div className="max-w-md space-y-10">
					<Slider
						label="Quality"
						min={0}
						max={100}
						step={25}
						defaultValue={50}
						marks={[
							{ value: 0, label: 'Low' },
							{ value: 25 },
							{ value: 50, label: 'Medium' },
							{ value: 75 },
							{ value: 100, label: 'High' },
						]}
					/>
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`<Slider
	label="Quality"
	min={0} max={100} step={25} defaultValue={50}
	marks={[
		{ value: 0, label: 'Low' },
		{ value: 50, label: 'Medium' },
		{ value: 100, label: 'High' },
	]}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Sizes and commit events">
				<div className="max-w-md space-y-8">
					<Slider label="Small" size="sm" defaultValue={30} />
					<Slider label="Large" size="lg" defaultValue={70} />
				</div>
				<div className="mt-4">
					<CodeBlock
						code={`// onChange fires continuously while dragging;
// onChangeEnd fires once when the user releases — ideal for expensive updates.
<Slider
	label="Price range"
	onChange={setPreview}
	onChangeEnd={value => refetchResults(value)}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Forms">
				<CodeBlock
					code={`// Posts like any native input — works with server actions.
<form action={updateSettings}>
	<Slider name="volume" label="Volume" defaultValue={50} />
	<Button type="submit">Save</Button>
</form>`}
				/>
			</Card>
		</div>
	)
}
