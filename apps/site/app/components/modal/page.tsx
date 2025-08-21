"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button as BuzzButton } from '@creo-team/buzz-ui/client'
import { Card } from '@creo-team/buzz-ui/client'
import { Modal } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

function ModalDocsContent() {
	const [basicOpen, setBasicOpen] = React.useState(false)
	const [formOpen, setFormOpen] = React.useState(false)
	const [confirmOpen, setConfirmOpen] = React.useState(false)
	const [isClient, setIsClient] = React.useState(false)
	
	// Query parameter state management example
	const searchParams = useSearchParams()
	const router = useRouter()
	const queryModalOpen = isClient && searchParams.get('modal') === 'settings'
	
	// Ensure we're on the client before using query params
	React.useEffect(() => {
		setIsClient(true)
	}, [])
	
	const openQueryModal = () => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.set('modal', 'settings')
		router.push(`?${params.toString()}`)
	}
	
	const closeQueryModal = () => {
		if (!isClient) return
		const params = new URLSearchParams(searchParams.toString())
		params.delete('modal')
		router.push(`?${params.toString()}`)
	}

	return (
		<div className="space-y-12">
			<div>
				<h1 className="text-4xl font-bold text-[var(--c-text)] mb-4">Modal</h1>
				<p className="text-xl text-[var(--c-text-secondary)]">
					Flexible modal dialogs with multiple patterns and state management options.
				</p>
			</div>

			{/* Basic Modal Example */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Basic Modal</h2>
				
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6 mb-6">
					<div className="flex gap-4 mb-4">
						<BuzzButton onClick={() => setBasicOpen(true)} variant="bold">
							Open Basic Modal
						</BuzzButton>
					</div>
					
					<CodeBlock 
						code={`import { Modal, Button } from '@creo-team/buzz-ui'
import { useState } from 'react'

export default function BasicExample() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        header="Basic Modal"
      >
        <p>This is a basic modal with header and close functionality.</p>
      </Modal>
    </>
  )
}`}
						label="Basic Modal Usage"
					/>
				</div>
				
				<Modal isOpen={basicOpen} onClose={() => setBasicOpen(false)} header="Basic Modal">
					<div className="space-y-4">
						<p className="text-[var(--c-text-secondary)]">
							This is a basic modal example with a header and close functionality.
						</p>
						<div className="flex gap-2">
							<BuzzButton onClick={() => setBasicOpen(false)} variant="bold">
								Close
							</BuzzButton>
						</div>
					</div>
				</Modal>
			</section>

			{/* Query Parameter State Management */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Query Parameter State Management</h2>
				
				<div className="bg-[var(--c-info-light)] border border-[var(--c-info)] rounded-[var(--radius-lg)] p-6 mb-6">
					<h3 className="text-lg font-semibold text-[var(--c-info)] mb-3">💡 Recommended Pattern</h3>
					<p className="text-[var(--c-text)]">
						Using query parameters for modal state allows for shareable URLs, browser back/forward navigation, 
						and better user experience.
					</p>
				</div>
				
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6 mb-6">
					<div className="flex gap-4 mb-4">
						<BuzzButton onClick={openQueryModal} variant="bold">
							Open Settings Modal (Query Param)
						</BuzzButton>
						<span className="text-sm text-[var(--c-text-secondary)] self-center">
							Check the URL when opened!
						</span>
					</div>
					
					<CodeBlock 
						code={`import { Modal, Button } from '@creo-team/buzz-ui'
import { useSearchParams, useRouter } from 'next/navigation'

export default function QueryParamModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  
  // Prevent SSR issues
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const isOpen = isClient && searchParams.get('modal') === 'settings'
  
  const openModal = () => {
    if (!isClient) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('modal', 'settings')
    router.push(\`?\${params.toString()}\`)
  }
  
  const closeModal = () => {
    if (!isClient) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete('modal')
    router.push(\`?\${params.toString()}\`)
  }
  
  return (
    <>
      <Button onClick={openModal}>Open Settings</Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={closeModal} 
        header="Settings"
      >
        <div className="space-y-4">
          <p>Settings content here...</p>
          <p className="text-sm text-[var(--c-text-secondary)]">
            💡 Notice the URL changes and browser back button works!
          </p>
        </div>
      </Modal>
    </>
  )
}`}
						label="Query Parameter Modal"
					/>
				</div>
				
				<Modal isOpen={queryModalOpen} onClose={closeQueryModal} header="Settings Modal">
					<div className="space-y-4">
						<p className="text-[var(--c-text-secondary)]">
							This modal's state is managed via query parameters!
						</p>
						<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-md)] p-3">
							<p className="text-sm text-[var(--c-text-secondary)]">
								💡 <strong>Benefits:</strong> Shareable URLs, browser navigation, better UX
							</p>
						</div>
						<div className="flex gap-2">
							<BuzzButton onClick={closeQueryModal} variant="bold">
								Close
							</BuzzButton>
						</div>
					</div>
				</Modal>
			</section>

			{/* Form Modal Example */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Form Modal</h2>
				
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6 mb-6">
					<div className="flex gap-4 mb-4">
						<BuzzButton onClick={() => setFormOpen(true)} variant="bold">
							Open Form Modal
						</BuzzButton>
					</div>
					
					<CodeBlock 
						code={`import { Modal, Button } from '@creo-team/buzz-ui'
import { useState } from 'react'

export default function FormModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setOpen(false)
  }
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Create User</Button>
      
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        header="Create New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="bold">Create</Button>
            <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}`}
						label="Form Modal Example"
					/>
				</div>
				
				<Modal isOpen={formOpen} onClose={() => setFormOpen(false)} header="Create New User">
					<form onSubmit={(e) => { e.preventDefault(); setFormOpen(false) }} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[var(--c-text)] mb-2">Name</label>
							<input
								type="text"
								className="w-full p-2 border border-[var(--c-border)] rounded-[var(--radius-md)] bg-[var(--c-surface)] text-[var(--c-text)]"
								placeholder="Enter name"
								required
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-[var(--c-text)] mb-2">Email</label>
							<input
								type="email"
								className="w-full p-2 border border-[var(--c-border)] rounded-[var(--radius-md)] bg-[var(--c-surface)] text-[var(--c-text)]"
								placeholder="Enter email"
								required
							/>
						</div>
						
						<div className="flex gap-2 pt-4">
							<BuzzButton type="submit" variant="bold">Create</BuzzButton>
							<BuzzButton type="button" onClick={() => setFormOpen(false)}>Cancel</BuzzButton>
						</div>
					</form>
				</Modal>
			</section>

			{/* Confirmation Modal */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Confirmation Modal</h2>
				
				<div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6 mb-6">
					<div className="flex gap-4 mb-4">
						<BuzzButton onClick={() => setConfirmOpen(true)} variant="danger">
							Delete Item
						</BuzzButton>
					</div>
					
					<CodeBlock 
						code={`import { Modal, Button } from '@creo-team/buzz-ui'
import { useState } from 'react'

export default function ConfirmationModal() {
  const [open, setOpen] = useState(false)
  
  const handleDelete = () => {
    // Perform delete action
    console.log('Item deleted')
    setOpen(false)
  }
  
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="danger">
        Delete Item
      </Button>
      
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        header="Confirm Deletion"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}`}
						label="Confirmation Modal"
					/>
				</div>
				
				<Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} header="Confirm Deletion">
					<div className="space-y-4">
						<p className="text-[var(--c-text-secondary)]">
							Are you sure you want to delete this item? This action cannot be undone.
						</p>
						
						<div className="flex gap-2 pt-4">
							<BuzzButton onClick={() => setConfirmOpen(false)} variant="danger">
								Delete
							</BuzzButton>
							<BuzzButton onClick={() => setConfirmOpen(false)}>
								Cancel
							</BuzzButton>
						</div>
					</div>
				</Modal>
			</section>

			{/* Advanced Patterns */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Advanced Patterns</h2>
				
				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Custom Hook for Query Params</h3>
						<CodeBlock 
							code={`// Now available as a built-in hook!
import { useModalQuery } from '@creo-team/buzz-ui'

export default function MyComponent() {
  const settingsModal = useModalQuery('settings')
  const createModal = useModalQuery('create')
  
  return (
    <>
      <Button onClick={settingsModal.open}>Settings</Button>
      <Button onClick={createModal.open}>Create</Button>
      
      <Modal isOpen={settingsModal.isOpen} onClose={settingsModal.close}>
        Settings content
      </Modal>
      
      <Modal isOpen={createModal.isOpen} onClose={createModal.close}>
        Create form
      </Modal>
    </>
  )
}

// The hook handles SSR safety automatically:
// - Prevents "document is not defined" errors
// - Only accesses query params after client hydration
// - Provides clean open/close API`}
							label="Custom Hook Pattern"
						/>
					</div>

					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Multiple Modal Management</h3>
						<CodeBlock 
							code={`// For managing multiple modals with query params
const MODAL_KEYS = {
  SETTINGS: 'settings',
  CREATE_USER: 'create-user',
  EDIT_PROFILE: 'edit-profile',
  CONFIRM_DELETE: 'confirm-delete'
} as const

export function useModals() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const currentModal = searchParams.get('modal')
  
  const openModal = (modalKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('modal', modalKey)
    router.push(\`?\${params.toString()}\`)
  }
  
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('modal')
    router.push(\`?\${params.toString()}\`)
  }
  
  return {
    currentModal,
    openModal,
    closeModal,
    isOpen: (modalKey: string) => currentModal === modalKey
  }
}`}
							label="Multiple Modal Manager"
						/>
					</div>

					<div>
						<h3 className="text-xl font-medium text-[var(--c-text)] mb-3">Modal with Data Loading</h3>
						<CodeBlock 
							code={`import { Modal, Button } from '@creo-team/buzz-ui'
import { useState, useEffect } from 'react'

export default function DataModal() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (open) {
      setLoading(true)
      // Load data when modal opens
      fetch('/api/user-data')
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false))
    }
  }, [open])
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>View Profile</Button>
      
      <Modal isOpen={open} onClose={() => setOpen(false)} header="User Profile">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3>Welcome, {data?.name}</h3>
            <p>Email: {data?.email}</p>
          </div>
        )}
			</Modal>
    </>
  )
}`}
							label="Data Loading Modal"
						/>
					</div>
				</div>
			</section>

						{/* API Reference */}
			<section>
				<ApiTable
					title="API Reference"
					rows={[
						{
							prop: "isOpen",
							type: "boolean",
							default: "false",
							required: true,
							description: "Controls modal visibility"
						},
						{
							prop: "onClose",
							type: "() => void",
							required: true,
							description: "Called when modal should close"
						},
						{
							prop: "header",
							type: "ReactNode",
							description: "Optional header content"
						},
						{
							prop: "children",
							type: "ReactNode",
							description: "Modal body content"
						},
						{
							prop: "className",
							type: "string",
							description: "Additional CSS classes"
						},
						{
							prop: "closeOnBackdrop",
							type: "boolean",
							default: "true",
							description: "Close when clicking backdrop"
						}
					]}
				/>
			</section>

			{/* Best Practices */}
			<section>
				<h2 className="text-2xl font-semibold text-[var(--c-text)] mb-6">Best Practices</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-[var(--c-success-light)] border border-[var(--c-success)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-success)] mb-3">✅ Do</h3>
						<ul className="space-y-2 text-[var(--c-text)] text-sm">
							<li>• Use query params for shareable modal states</li>
							<li>• Provide clear close affordances</li>
							<li>• Keep modal content focused and concise</li>
							<li>• Use appropriate modal sizes</li>
							<li>• Handle loading states in data modals</li>
						</ul>
					</div>

					<div className="bg-[var(--c-danger-light)] border border-[var(--c-danger)] rounded-[var(--radius-lg)] p-6">
						<h3 className="text-lg font-semibold text-[var(--c-danger)] mb-3">❌ Don't</h3>
						<ul className="space-y-2 text-[var(--c-text)] text-sm">
							<li>• Nest modals inside other modals</li>
							<li>• Make modals too large or complex</li>
							<li>• Forget to handle escape key</li>
							<li>• Use modals for simple confirmations</li>
							<li>• Block the entire UI unnecessarily</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Related Components */}
			<div className="bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-[var(--radius-lg)] p-6">
				<h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Related Components</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<a href="/components/sheet" className="text-[var(--c-primary)] hover:underline">Sheet</a>
					<a href="/components/drawer" className="text-[var(--c-primary)] hover:underline">Drawer</a>
					<a href="/components/tooltip" className="text-[var(--c-primary)] hover:underline">Tooltip</a>
					<a href="/components/button" className="text-[var(--c-primary)] hover:underline">Button</a>
				</div>
			</div>
		</div>
	)
}

export default function ModalDocs() {
	return (
		<Suspense fallback={<div className="p-8">Loading...</div>}>
			<ModalDocsContent />
		</Suspense>
	)
}

