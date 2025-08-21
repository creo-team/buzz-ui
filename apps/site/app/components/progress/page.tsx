"use client"
import { useState, useEffect } from 'react'
import { Card, Progress } from '@creo-team/buzz-ui/client'
import { CircularProgress } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'
import Link from 'next/link'

export default function ProgressDocs() {
	const [dynamicValue, setDynamicValue] = useState(0)
	
	// Simulate progress updates
	useEffect(() => {
		const interval = setInterval(() => {
			setDynamicValue(prev => (prev >= 100 ? 0 : prev + 10))
		}, 1000)
		return () => clearInterval(interval)
	}, [])
	
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Progress</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Display progress and loading states with linear and circular indicators.
			</p>
			
			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Basic Progress</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={25} />
					<Progress value={50} />
					<Progress value={75} />
					<Progress value={100} />
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { Progress } from '@creo-team/buzz-ui/client'

<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Sizes</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={60} size="xs" />
					<Progress value={60} size="sm" />
					<Progress value={60} size="md" />
					<Progress value={60} size="lg" />
					<Progress value={60} size="xl" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress value={60} size="xs" />
<Progress value={60} size="sm" />
<Progress value={60} size="md" />
<Progress value={60} size="lg" />
<Progress value={60} size="xl" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Variants</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={70} variant="primary" />
					<Progress value={70} variant="success" />
					<Progress value={70} variant="warning" />
					<Progress value={70} variant="danger" />
					<Progress value={70} variant="info" />
					<Progress value={70} variant="glass" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress value={70} variant="primary" />
<Progress value={70} variant="success" />
<Progress value={70} variant="warning" />
<Progress value={70} variant="danger" />
<Progress value={70} variant="info" />
<Progress value={70} variant="glass" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">With Labels</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={35} showLabel />
					<Progress value={65} showLabel label="Download Progress" />
					<Progress value={85} showLabel label="Processing" variant="success" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress value={35} showLabel />
<Progress value={65} showLabel label="Download Progress" />
<Progress value={85} showLabel label="Processing" variant="success" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Shapes</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={60} shape="rounded" />
					<Progress value={60} shape="square" />
					<Progress value={60} shape="pill" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress value={60} shape="rounded" />
<Progress value={60} shape="square" />
<Progress value={60} shape="pill" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Animated & Striped</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={40} animated />
					<Progress value={60} striped />
					<Progress value={80} striped animated variant="success" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress value={40} animated />
<Progress value={60} striped />
<Progress value={80} striped animated variant="success" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Indeterminate State</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress indeterminate />
					<Progress indeterminate variant="info" />
					<Progress indeterminate showLabel label="Loading..." />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<Progress indeterminate />
<Progress indeterminate variant="info" />
<Progress indeterminate showLabel label="Loading..." />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Circular Progress</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-6">
					<CircularProgress value={25} />
					<CircularProgress value={50} variant="success" />
					<CircularProgress value={75} variant="warning" />
					<CircularProgress value={100} variant="danger" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`import { CircularProgress } from '@creo-team/buzz-ui/client'

<CircularProgress value={25} />
<CircularProgress value={50} variant="success" />
<CircularProgress value={75} variant="warning" />
<CircularProgress value={100} variant="danger" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Circular Sizes & Labels</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-6">
					<CircularProgress value={60} size={32} strokeWidth={3} />
					<CircularProgress value={60} size={48} strokeWidth={4} showLabel />
					<CircularProgress value={60} size={64} strokeWidth={5} showLabel />
					<CircularProgress value={60} size={80} strokeWidth={6} showLabel />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<CircularProgress value={60} size={32} strokeWidth={3} />
<CircularProgress value={60} size={48} strokeWidth={4} showLabel />
<CircularProgress value={60} size={64} strokeWidth={5} showLabel />
<CircularProgress value={60} size={80} strokeWidth={6} showLabel />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Circular Indeterminate</h2>
			<Card variant="elevated" className="mt-4">
				<div className="flex flex-wrap items-center gap-6">
					<CircularProgress indeterminate />
					<CircularProgress indeterminate size={64} variant="info" />
					<CircularProgress indeterminate size={80} variant="success" strokeWidth={8} />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<CircularProgress indeterminate />
<CircularProgress indeterminate size={64} variant="info" />
<CircularProgress indeterminate size={80} variant="success" strokeWidth={8} />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Dynamic Progress</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<Progress value={dynamicValue} showLabel label="Auto-updating" variant="primary" animated />
					<CircularProgress value={dynamicValue} showLabel size={64} variant="info" />
					<div className="flex gap-4">
						<button 
							onClick={() => setDynamicValue(0)}
							className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-xl hover:bg-[var(--c-primary-hover)]"
						>
							Reset
						</button>
						<button 
							onClick={() => setDynamicValue(100)}
							className="px-4 py-2 bg-[var(--c-success)] text-white rounded-xl hover:brightness-110"
						>
							Complete
						</button>
					</div>
				</div>
				<div className="mt-6">
					<CodeBlock code={`const [value, setValue] = useState(0)

// Update progress
useEffect(() => {
  const interval = setInterval(() => {
    setValue(prev => (prev >= 100 ? 0 : prev + 10))
  }, 1000)
  return () => clearInterval(interval)
}, [])`} />
				</div>
			</Card>

			<ApiTable
				title="Progress API Reference"
				className="mt-12"
				rows={[
					{
						prop: "value",
						type: "number",
						default: "0",
						description: "Progress percentage (0-100)"
					},
					{
						prop: "size",
						type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
						default: "'md'",
						description: "Size variant"
					},
					{
						prop: "variant",
						type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glass'",
						default: "'primary'",
						description: "Color variant"
					},
					{
						prop: "showLabel",
						type: "boolean",
						default: "false",
						description: "Show percentage label"
					},
					{
						prop: "animated",
						type: "boolean",
						default: "false",
						description: "Enable pulse animation"
					},
					{
						prop: "striped",
						type: "boolean",
						default: "false",
						description: "Show striped pattern"
					},
					{
						prop: "indeterminate",
						type: "boolean",
						default: "false",
						description: "Indeterminate loading state"
					},
					{
						prop: "label",
						type: "string",
						description: "Custom label text"
					},
					{
						prop: "shape",
						type: "'rounded' | 'square' | 'pill'",
						default: "'rounded'",
						description: "Border radius style"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>

			<ApiTable
				title="CircularProgress API Reference"
				className="mt-12"
				rows={[
					{
						prop: "value",
						type: "number",
						default: "0",
						description: "Progress percentage (0-100)"
					},
					{
						prop: "size",
						type: "number",
						default: "48",
						description: "Size in pixels"
					},
					{
						prop: "strokeWidth",
						type: "number",
						default: "4",
						description: "Stroke width in pixels"
					},
					{
						prop: "variant",
						type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
						default: "'primary'",
						description: "Color variant"
					},
					{
						prop: "showLabel",
						type: "boolean",
						default: "false",
						description: "Show percentage label"
					},
					{
						prop: "indeterminate",
						type: "boolean",
						default: "false",
						description: "Indeterminate loading state"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				                                ]}
                        />

                        <div className="mt-8">
                                <p className="text-sm text-[var(--c-text-secondary)]">
                                        Full API: <Link className="text-[var(--c-link)] hover:underline" href="/components/progress/api">/components/progress/api</Link>
                                </p>
                        </div>
                </div>
        )
}