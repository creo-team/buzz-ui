"use client"
import React from 'react'
import { Card, Kbd } from '@creo-team/buzz-ui/server'
import { Combobox } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'

const FRAMEWORKS = [
	{ value: 'react', label: 'React', description: 'A library for building user interfaces' },
	{ value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
	{ value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
	{ value: 'solid', label: 'Solid', description: 'Simple and performant reactivity' },
	{ value: 'angular', label: 'Angular', description: 'Platform for building mobile and desktop apps' },
	{ value: 'ember', label: 'Ember', disabled: true, description: 'Currently unavailable' },
]

const COUNTRIES = [
	{ value: 'us', label: 'United States' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'mx', label: 'Mexico' },
	{ value: 'gb', label: 'United Kingdom' },
	{ value: 'fr', label: 'France' },
	{ value: 'de', label: 'Germany' },
	{ value: 'jp', label: 'Japan' },
]

export default function ComboboxDocs() {
	const [framework, setFramework] = React.useState<string | null>('react')
	const [country, setCountry] = React.useState<string | null>(null)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-2xl font-semibold">Combobox</h1>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				A filterable single-select input (WAI-ARIA combobox + listbox pattern) built on the same
				overlay engine as Dropdown and Popover — portal rendering, collision-aware positioning, and
				the shared layer stack for Escape/outside-press dismissal.
			</p>

			<Card className="mt-6" header="Basic">
				<div className="max-w-sm">
					<Combobox
						label="Framework"
						options={FRAMEWORKS}
						value={framework}
						onChange={setFramework}
						placeholder="Search frameworks…"
					/>
				</div>
				<p className="mt-3 text-sm text-[var(--c-text-secondary)]">
					Selected: <strong>{framework ?? 'none'}</strong>
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`import { Combobox } from '@creo-team/buzz-ui/client'

const [framework, setFramework] = useState<string | null>('react')

<Combobox
	label="Framework"
	options={[
		{ value: 'react', label: 'React', description: 'A library for building user interfaces' },
		{ value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
		{ value: 'ember', label: 'Ember', disabled: true, description: 'Currently unavailable' },
	]}
	value={framework}
	onChange={setFramework}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Uncontrolled, clearable, and required">
				<div className="max-w-sm">
					<Combobox
						label="Country"
						required
						options={COUNTRIES}
						defaultValue="us"
						onChange={setCountry}
						helpText="Pick the country your team is based in."
					/>
				</div>
				<p className="mt-3 text-sm text-[var(--c-text-secondary)]">
					onChange fired with: <strong>{country ?? 'nothing yet — still "us" from defaultValue'}</strong>
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`// Works uncontrolled too — just read the committed value via onChange
<Combobox
	label="Country"
	required
	options={countries}
	defaultValue="us"
	onChange={setCountry}
	helpText="Pick the country your team is based in."
/>

// Hide the (×) clear button
<Combobox options={countries} clearable={false} />`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Async options and custom filtering">
				<p className="text-sm text-[var(--c-text-secondary)]">
					<code>onInputChange</code> fires on every keystroke — debounce it yourself and swap in
					fresh <code>options</code> for server-side search. Pass <code>loading</code> to swap the
					chevron for a spinner while a request is in flight. <code>filter</code> overrides the
					default case-insensitive substring match entirely (useful once you're filtering
					server-side and want the client to trust whatever `options` it's given).
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`const [options, setOptions] = useState(initialOptions)
const [loading, setLoading] = useState(false)

<Combobox
	label="Search users"
	options={options}
	loading={loading}
	onInputChange={useDebouncedCallback(async query => {
		setLoading(true)
		setOptions(await searchUsers(query))
		setLoading(false)
	}, 300)}
	// Trust the server's ranking instead of re-filtering client-side
	filter={() => true}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Forms">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Pass <code>name</code> to render a hidden input carrying the committed value, so the
					selection posts like any other field — no client-side submit handler required.
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`<form action={updateSettings}>
	<Combobox name="country" label="Country" options={countries} defaultValue="us" />
	<Button type="submit">Save</Button>
</form>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Keyboard">
				<ul className="space-y-2 text-sm text-[var(--c-text-secondary)]">
					<li className="flex items-center gap-2"><Kbd>↓</Kbd> / <Kbd>↑</Kbd> move the highlight (skips disabled options)</li>
					<li className="flex items-center gap-2"><Kbd>Enter</Kbd> select the highlighted option</li>
					<li className="flex items-center gap-2"><Kbd>Escape</Kbd> close without selecting, reverting to the current value</li>
					<li className="flex items-center gap-2"><Kbd>Tab</Kbd> close and move on, same as Escape</li>
				</ul>
			</Card>
		</div>
	)
}
