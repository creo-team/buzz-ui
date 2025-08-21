"use client"
import React from 'react'
import { Card, Button } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import toast from 'react-hot-toast'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function ToastDocs() {
	const showSuccessToast = () => {
		toast.success('Successfully saved!')
	}

	const showErrorToast = () => {
		toast.error('Something went wrong')
	}

	const showLoadingToast = () => {
		toast.loading('Loading...')
	}

	const showCustomToast = () => {
		toast.custom(
			(t) => (
				<div 
					className="max-w-md w-full bg-[var(--c-surface)] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
					style={{
						opacity: t.visible ? 1 : 0,
						transform: `scale(${t.visible ? 1 : 0.95})`,
						transition: 'all 0.2s ease-in-out'
					}}
				>
					<div className="flex-1 w-0 p-4">
						<div className="flex items-start">
							<div className="ml-3 flex-1">
								<p className="text-sm font-medium text-[var(--c-text)]">
									Custom Toast
								</p>
								<p className="mt-1 text-sm text-[var(--c-text-secondary)]">
									This is a custom toast with React components!
								</p>
							</div>
						</div>
					</div>
					<div className="flex border-l border-[var(--c-border)]">
						<button
							onClick={() => toast.dismiss(t.id)}
							className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
						>
							Close
						</button>
					</div>
				</div>
			),
			{
				duration: 6000,
			}
		)
	}

	const showPromiseToast = () => {
		const myPromise = new Promise((resolve) => {
			setTimeout(() => resolve('Data loaded!'), 2000)
		})

		toast.promise(
			myPromise,
			{
				loading: 'Loading data...',
				success: 'Data loaded successfully!',
				error: 'Failed to load data',
			}
		)
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">{/* Toaster is already included in the root layout */}

			<h1 className="text-2xl font-semibold mb-4">Toast</h1>
			<p className="text-[var(--c-text-secondary)] mb-8">
				Beautiful toast notifications powered by the excellent{' '}
				<a 
					href="https://react-hot-toast.com" 
					target="_blank" 
					rel="noopener noreferrer"
					className="text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] underline font-medium"
				>
					react-hot-toast
				</a>{' '}
				library - lightweight, customizable, and beautiful by default with automatic theme integration.
			</p>

			<Card className="mb-8">
				<h2 className="text-lg font-semibold mb-4">Basic Toasts</h2>
				<div className="flex flex-wrap gap-3 mb-6">
					<Button variant="success" onClick={showSuccessToast}>Success Toast</Button>
					<Button variant="danger" onClick={showErrorToast}>Error Toast</Button>
					<Button variant="outline" onClick={showLoadingToast}>Loading Toast</Button>
					<Button variant="bold" onClick={showPromiseToast}>Promise Toast</Button>
					<Button variant="subtle" onClick={showCustomToast}>Custom Toast</Button>
				</div>
				<CodeBlock code={`import toast, { Toaster } from 'react-hot-toast'

// Basic usage
toast.success('Successfully saved!')
toast.error('Something went wrong')
toast.loading('Loading...')

// Promise toast
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save',
  }
)`} />
			</Card>

			<Card className="mb-8">
				<h2 className="text-lg font-semibold mb-4">Setup</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					Add the Toaster component to your app root with theme-aware styling:
				</p>
				<CodeBlock code={`import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--c-surface)',
            color: 'var(--c-text)',
            border: '1px solid var(--c-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--c-success)',
              secondary: 'var(--c-on-primary)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--c-error)',
              secondary: 'var(--c-on-primary)',
            },
          },
        }}
      />
      <YourAppComponents />
    </>
  )
}`} />
			</Card>

			<Card className="mb-8">
				<h2 className="text-lg font-semibold mb-4">Custom Toast</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					Create fully custom toasts with React components:
				</p>
				<CodeBlock code={`toast.custom(
  (t) => (
    <div 
      className="max-w-md w-full bg-[var(--c-surface)] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
      style={{
        opacity: t.visible ? 1 : 0,
        transform: \`scale(\${t.visible ? 1 : 0.95})\`,
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-[var(--c-text)]">
              Custom Toast
            </p>
            <p className="mt-1 text-sm text-[var(--c-text-secondary)]">
              This is a custom toast with React components!
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-[var(--c-border)]">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[var(--c-primary)] hover:text-[var(--c-primary-hover)]"
        >
          Close
        </button>
      </div>
    </div>
  ),
  {
    duration: 6000, // Custom toasts often need longer duration
  }
)`} />
			</Card>

			<Card>
				<h2 className="text-lg font-semibold mb-4">API Reference</h2>
				<table className="w-full text-left text-sm">
					<thead>
						<tr className="border-b border-[var(--c-border)]">
							<th className="py-2 pr-4 text-[var(--c-text-secondary)]">Method</th>
							<th className="py-2 pr-4 text-[var(--c-text-secondary)]">Type</th>
							<th className="py-2 text-[var(--c-text-secondary)]">Description</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.success</code></td>
							<td className="py-2 pr-4">(message: string) =&gt; string</td>
							<td className="py-2">Show success toast</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.error</code></td>
							<td className="py-2 pr-4">(message: string) =&gt; string</td>
							<td className="py-2">Show error toast</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.loading</code></td>
							<td className="py-2 pr-4">(message: string) =&gt; string</td>
							<td className="py-2">Show loading toast</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.promise</code></td>
							<td className="py-2 pr-4">(promise: Promise) =&gt; Promise</td>
							<td className="py-2">Handle async operations</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.custom</code></td>
							<td className="py-2 pr-4">(jsx: ReactNode) =&gt; string</td>
							<td className="py-2">Custom toast component</td>
						</tr>
						<tr className="border-b border-[var(--c-border)]">
							<td className="py-2 pr-4"><code>toast.dismiss</code></td>
							<td className="py-2 pr-4">(toastId?: string) =&gt; void</td>
							<td className="py-2">Dismiss toast(s)</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</div>
	)
}