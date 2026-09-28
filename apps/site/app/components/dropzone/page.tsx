"use client"
import React from 'react'
import { Card, PageHeader } from '@creo-team/buzz-ui/server'
import { Dropzone, AvatarUpload } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

export default function DropzoneDocs() {
	const [files, setFiles] = React.useState<File[]>([])
	const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<PageHeader
				title="Dropzone"
				description="Drag-and-drop file picking with inline validation — wrong type, too big or too many report right under the zone, never as toasts."
			/>

			<Card className="mt-8" header="Multiple files with limits">
				<div className="max-w-md">
					<Dropzone
						accept="image/*,.pdf"
						multiple
						maxSize={5 * 1024 * 1024}
						maxFiles={4}
						onFilesChange={setFiles}
					/>
					<p className="mt-3 text-sm text-[var(--c-text-secondary)]" role="status">
						{files.length} file{files.length === 1 ? '' : 's'} selected
					</p>
				</div>
				<div className="mt-6">
					<CodeBlock
						code={`import { Dropzone } from '@creo-team/buzz-ui/client'

<Dropzone
  accept="image/*,.pdf"
  multiple
  maxSize={5 * 1024 * 1024}   // 5 MB per file
  maxFiles={4}
  onFilesChange={setFiles}
  onFilesRejected={rejections => log(rejections)}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Avatar upload">
				<div className="flex items-center gap-8">
					<AvatarUpload
						name="Ada Lovelace"
						maxSize={2 * 1024 * 1024}
						onImageChange={file => setAvatarFile(file)}
						onRemove={() => setAvatarFile(null)}
					/>
					<p className="text-sm text-[var(--c-text-secondary)]">
						{avatarFile ? (
							<>
								Ready to upload: <strong>{avatarFile.name}</strong>
							</>
						) : (
							'Click the camera or drop an image onto the avatar.'
						)}
					</p>
				</div>
				<div className="mt-6">
					<CodeBlock
						code={`import { AvatarUpload } from '@creo-team/buzz-ui/client'

<AvatarUpload
  name={user.name}                  // initials fallback
  src={user.avatarUrl}              // current image
  maxSize={2 * 1024 * 1024}
  onImageChange={(file, previewUrl) => uploadAvatar(file)}
  onRemove={() => clearAvatar()}
/>`}
					/>
				</div>
			</Card>

			<Card className="mt-6" header="Build your own">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Both components ride the exported <code>useFileDrop</code> hook — hidden-input plumbing,
					drag state and validation for any custom surface — plus <code>isFileAccepted</code> and{' '}
					<code>formatFileSize</code> utilities.
				</p>
				<div className="mt-4">
					<CodeBlock
						code={`import { useFileDrop } from '@creo-team/buzz-ui/client'

const { isDragOver, openPicker, rootProps, inputProps } = useFileDrop({
  accept: 'text/csv',
  onAccepted: ([file]) => importCsv(file),
  onRejected: rejections => setError(rejections[0].message),
})

return (
  <button {...rootProps} onClick={openPicker} data-drag-over={isDragOver || undefined}>
    Import CSV
    <input {...inputProps} hidden />
  </button>
)`}
					/>
				</div>
			</Card>

			<ApiTable
				title="Dropzone API"
				className="mt-12"
				rows={[
					{ prop: 'accept', type: 'string', description: "File-input accept grammar: '.pdf', 'image/*', 'image/png'." },
					{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Accumulate files instead of replacing.' },
					{ prop: 'maxSize', type: 'number', description: 'Per-file cap in bytes; larger files are rejected inline.' },
					{ prop: 'maxFiles', type: 'number', description: 'Cap on total kept files.' },
					{ prop: 'files / defaultFiles', type: 'File[]', description: 'Controlled / uncontrolled file list.' },
					{ prop: 'onFilesChange', type: '(files: File[]) => void', description: 'Full updated list on every add or remove.' },
					{ prop: 'onFilesRejected', type: '(rejections: FileRejection[]) => void', description: 'Files that failed validation, with reasons.' },
					{ prop: 'label / description', type: 'ReactNode', description: 'Zone text; description defaults to a hint built from accept/maxSize.' },
					{ prop: 'showList', type: 'boolean', default: 'true', description: 'Render the kept files under the zone.' },
				]}
			/>

			<ApiTable
				title="AvatarUpload API"
				className="mt-8"
				rows={[
					{ prop: 'src', type: 'string', description: 'Current image URL.' },
					{ prop: 'name', type: 'string', description: 'Initials fallback while no image is set.' },
					{ prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'xl'", description: 'Avatar size preset.' },
					{ prop: 'maxSize', type: 'number', description: 'Image size cap in bytes.' },
					{ prop: 'onImageChange', type: '(file: File, previewUrl: string) => void', description: 'Valid image picked or dropped; previewUrl is a data URL.' },
					{ prop: 'onRemove', type: '() => void', description: 'Shows a remove badge while an image is set.' },
				]}
			/>
		</div>
	)
}
