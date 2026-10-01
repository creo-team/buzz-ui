"use client"
import { Card, CodeBox } from '@creo-team/buzz-ui/server'
import { Button, CopyStatus, useCopyToClipboard } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

const exampleCode = `function fibonacci(n: number): number {
	if (n <= 1) return n
	return fibonacci(n - 1) + fibonacci(n - 2)
}

// Example usage
console.log(fibonacci(10)) // 55`

const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<h1>Hello World</h1>
</body>
</html>`

const cssExample = `.container {
	display: flex
	flex-direction: column
	gap: 1rem
	padding: 2rem
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
}`

const SHARE_URL = 'https://buzz-ui.dev/components/code-box'

const COPY_HOOK_USAGE = `import { CopyStatus, useCopyToClipboard } from '@creo-team/buzz-ui/client'

function ShareLink({ url }: { url: string }) {
  const { copy, status } = useCopyToClipboard({
    onCopyError: error => logger.warn({ error }, 'copy failed'),
  })
  // Call copy directly in the handler: no await before it, or Safari drops the gesture.
  return (
    <button type="button" onClick={() => void copy(url)}>
      {status === CopyStatus.Copied ? 'Copied' : status === CopyStatus.Failed ? "Couldn't copy" : 'Copy link'}
    </button>
  )
}`

function CopyHookDemo() {
	const { copy, status } = useCopyToClipboard()
	const label = status === CopyStatus.Copied ? 'Copied' : status === CopyStatus.Failed ? "Couldn't copy" : 'Copy link'
	return (
		<Button variant="outline" onClick={() => void copy(SHARE_URL)}>
			{label}
		</Button>
	)
}

export default function CodeBoxDocs() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Code Box</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Display code snippets with syntax highlighting, line numbers, and copy functionality.
			</p>
			
			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Basic Usage</h2>
			<Card variant="elevated" className="mt-4">
				<CodeBox code={exampleCode} language="typescript" label="fibonacci.ts" />
				<div className="mt-6">
					<CodeBlock code={`import { CodeBox } from '@creo-team/buzz-ui/client'

const code = \`function fibonacci(n: number): number {
	if (n <= 1) return n
	return fibonacci(n - 1) + fibonacci(n - 2)
}\`

export default function Example() {
	return <CodeBox code={code} language="typescript" label="fibonacci.ts" />
}`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">With Line Numbers</h2>
			<Card variant="elevated" className="mt-4">
				<CodeBox 
					code={exampleCode} 
					language="typescript" 
					label="fibonacci.ts" 
					showLineNumbers
				/>
				<div className="mt-6">
					<CodeBlock code={`<CodeBox 
	code={code} 
	language="typescript" 
	label="fibonacci.ts" 
	showLineNumbers
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Different Languages</h2>
			<Card variant="elevated" className="mt-4">
				<div className="space-y-4">
					<CodeBox code={htmlExample} language="html" label="index.html" />
					<CodeBox code={cssExample} language="css" label="styles.css" />
				</div>
				<div className="mt-6">
					<CodeBlock code={`<CodeBox code={htmlCode} language="html" label="index.html" />
<CodeBox code={cssCode} language="css" label="styles.css" />`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Without Copy Button</h2>
			<Card variant="elevated" className="mt-4">
				<CodeBox 
					code="const secretKey = 'do-not-copy-this'" 
					language="javascript" 
					label="secret.js"
					copyable={false}
				/>
				<div className="mt-6">
					<CodeBlock code={`<CodeBox 
	code="const secretKey = 'do-not-copy-this'" 
	language="javascript" 
	label="secret.js"
	copyable={false}
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">Without Label</h2>
			<Card variant="elevated" className="mt-4">
				<CodeBox 
					code="console.log('Hello, World!')" 
					language="javascript"
					label=""
				/>
				<div className="mt-6">
					<CodeBlock code={`<CodeBox 
	code="console.log('Hello, World!')" 
	language="javascript"
	label=""
/>`} />
				</div>
			</Card>

			<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">useCopyToClipboard</h2>
			<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
				The hook behind CopyButton and Timestamp, for custom copy controls. It writes synchronously inside the
				gesture, reports <code>COPIED</code> for 1.5 s, and keeps <code>FAILED</code> until you reset it, so a refusal is
				never silent. It renders and announces nothing; your component does.
			</p>
			<Card variant="elevated" className="mt-4">
				<CopyHookDemo />
				<div className="mt-6">
					<CodeBlock code={COPY_HOOK_USAGE} label="useCopyToClipboard" />
				</div>
			</Card>

			<ApiTable
				title="API Reference"
				className="mt-12"
				rows={[
					{
						prop: "code",
						type: "string",
						required: true,
						description: "The code to display"
					},
					{
						prop: "language",
						type: "string",
						default: "'typescript'",
						description: "Programming language for syntax highlighting"
					},
					{
						prop: "label",
						type: "string",
						default: "'Code'",
						description: "Label/filename to display above the code"
					},
					{
						prop: "showLineNumbers",
						type: "boolean",
						default: "false",
						description: "Whether to show line numbers"
					},
					{
						prop: "copyable",
						type: "boolean",
						default: "true",
						description: "Whether to show the copy button"
					},
					{
						prop: "className",
						type: "string",
						description: "Additional CSS classes"
					}
				]}
			/>
		</div>
	)
}
