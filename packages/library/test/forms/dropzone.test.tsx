import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Dropzone } from '../../src/forms/dropzone'
import { AvatarUpload } from '../../src/forms/avatar-upload'
import { isFileAccepted, formatFileSize } from '../../src/forms/use-file-drop'
import { describe, it, expect, vi } from 'vitest'

const png = (name = 'photo.png', size = 1024) => {
	const file = new File(['x'.repeat(size)], name, { type: 'image/png' })
	return file
}
const pdf = (name = 'doc.pdf') => new File(['%PDF'], name, { type: 'application/pdf' })

function dropFiles(zone: HTMLElement, files: File[]) {
	fireEvent.drop(zone, { dataTransfer: { files, types: ['Files'] } })
}

describe('isFileAccepted', () => {
	it('accepts everything without an accept string', () => {
		expect(isFileAccepted(png())).toBe(true)
	})
	it('matches extensions, wildcard and exact MIME types', () => {
		expect(isFileAccepted(pdf(), '.pdf')).toBe(true)
		expect(isFileAccepted(png(), 'image/*')).toBe(true)
		expect(isFileAccepted(png(), 'image/png')).toBe(true)
		expect(isFileAccepted(png(), 'image/jpeg,.pdf')).toBe(false)
	})
})

describe('formatFileSize', () => {
	it('formats through the unit ladder', () => {
		expect(formatFileSize(0)).toBe('0 B')
		expect(formatFileSize(999)).toBe('999 B')
		expect(formatFileSize(1536)).toBe('1.5 KB')
		expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
	})
})

describe('Dropzone', () => {
	it('renders a keyboard-reachable zone with label and hint', () => {
		render(<Dropzone accept="image/*" maxSize={5 * 1024 * 1024} />)
		const zone = screen.getByRole('button', { name: /Drag and drop files here/ })
		expect(zone).toHaveAttribute('tabindex', '0')
		expect(screen.getByText(/Accepts image\/\* · up to 5.0 MB/)).toBeInTheDocument()
	})

	it('accepts dropped files and lists them with sizes and remove buttons', () => {
		const onFilesChange = vi.fn()
		render(<Dropzone multiple onFilesChange={onFilesChange} />)
		dropFiles(screen.getByRole('button'), [png('a.png', 2048), png('b.png', 1024)])

		expect(onFilesChange).toHaveBeenCalledWith([expect.any(File), expect.any(File)])
		expect(screen.getByText('a.png')).toBeInTheDocument()
		expect(screen.getByText('2.0 KB')).toBeInTheDocument()
		expect(screen.getByLabelText('Remove a.png')).toBeInTheDocument()
	})

	it('removes a file from the list', () => {
		const onFilesChange = vi.fn()
		render(<Dropzone multiple onFilesChange={onFilesChange} />)
		dropFiles(screen.getByRole('button'), [png('a.png'), png('b.png')])
		fireEvent.click(screen.getByLabelText('Remove a.png'))

		expect(screen.queryByText('a.png')).not.toBeInTheDocument()
		expect(screen.getByText('b.png')).toBeInTheDocument()
		const lastCall = onFilesChange.mock.calls.at(-1)![0]
		expect(lastCall.map((f: File) => f.name)).toEqual(['b.png'])
	})

	it('rejects the wrong type inline, without a toast', () => {
		const onFilesRejected = vi.fn()
		render(<Dropzone accept="image/*" onFilesRejected={onFilesRejected} />)
		dropFiles(screen.getByRole('button'), [pdf('cv.pdf')])

		expect(screen.getByRole('alert')).toHaveTextContent("cv.pdf isn't an accepted file type.")
		expect(onFilesRejected).toHaveBeenCalled()
		expect(screen.queryByText('cv.pdf')).not.toBeInTheDocument()
	})

	it('rejects oversized files with the human-readable cap', () => {
		render(<Dropzone maxSize={1024} />)
		dropFiles(screen.getByRole('button'), [png('big.png', 4096)])
		expect(screen.getByRole('alert')).toHaveTextContent('big.png is larger than 1.0 KB.')
	})

	it('enforces maxFiles across selections', () => {
		render(<Dropzone multiple maxFiles={1} />)
		const zone = screen.getByRole('button')
		dropFiles(zone, [png('a.png')])
		dropFiles(zone, [png('b.png')])
		expect(screen.getByRole('alert')).toHaveTextContent('Only 1 file allowed.')
		expect(screen.getByText('a.png')).toBeInTheDocument()
		expect(screen.queryByText('b.png')).not.toBeInTheDocument()
	})

	it('single-file mode replaces instead of accumulating', () => {
		render(<Dropzone />)
		const zone = screen.getByRole('button')
		dropFiles(zone, [png('first.png')])
		dropFiles(zone, [png('second.png')])
		expect(screen.queryByText('first.png')).not.toBeInTheDocument()
		expect(screen.getByText('second.png')).toBeInTheDocument()
	})

	it('marks the zone during drag-over and clears after drop', () => {
		render(<Dropzone />)
		const zone = screen.getByRole('button')
		fireEvent.dragEnter(zone, { dataTransfer: { types: ['Files'] } })
		expect(zone).toHaveAttribute('data-drag-over')
		dropFiles(zone, [png()])
		expect(zone).not.toHaveAttribute('data-drag-over')
	})

	it('ignores interaction when disabled', () => {
		const onFilesChange = vi.fn()
		render(<Dropzone disabled onFilesChange={onFilesChange} />)
		const zone = screen.getByRole('button')
		expect(zone).toHaveAttribute('aria-disabled', 'true')
		expect(zone).toHaveAttribute('tabindex', '-1')
		dropFiles(zone, [png()])
		expect(onFilesChange).not.toHaveBeenCalled()
	})

	it('supports a fully controlled file list', () => {
		function Controlled() {
			const [files, setFiles] = React.useState<File[]>([])
			return (
				<>
					<Dropzone multiple files={files} onFilesChange={setFiles} />
					<output>{files.length}</output>
				</>
			)
		}
		render(<Controlled />)
		dropFiles(screen.getByRole('button'), [png('a.png'), png('b.png')])
		expect(screen.getByText('a.png')).toBeInTheDocument()
		expect(screen.getByRole('status')).toHaveTextContent('2')
	})
})

describe('AvatarUpload', () => {
	it('renders the initials fallback and a labelled change control', () => {
		render(<AvatarUpload name="Ada Lovelace" />)
		expect(screen.getByText('AL')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Change avatar' })).toBeInTheDocument()
	})

	it('previews a dropped image and reports the file with a data URL', async () => {
		const onImageChange = vi.fn()
		const { container } = render(<AvatarUpload name="Ada" onImageChange={onImageChange} />)
		const frame = container.querySelector('.bz-avatar-upload__frame') as HTMLElement
		fireEvent.drop(frame, { dataTransfer: { files: [png()], types: ['Files'] } })

		await waitFor(() => expect(onImageChange).toHaveBeenCalled())
		const [file, url] = onImageChange.mock.calls[0]
		expect(file.name).toBe('photo.png')
		expect(url).toMatch(/^data:/)
		await waitFor(() => expect(container.querySelector('img')).not.toBeNull())
	})

	it('rejects non-images inline', async () => {
		render(<AvatarUpload name="Ada" />)
		const frame = document.querySelector('.bz-avatar-upload__frame') as HTMLElement
		fireEvent.drop(frame, { dataTransfer: { files: [pdf()], types: ['Files'] } })
		expect(await screen.findByRole('alert')).toHaveTextContent("doc.pdf isn't an accepted file type.")
	})

	it('shows remove only when an image exists and onRemove is provided', () => {
		const onRemove = vi.fn()
		const { rerender } = render(<AvatarUpload name="Ada" onRemove={onRemove} />)
		expect(screen.queryByRole('button', { name: 'Remove avatar' })).not.toBeInTheDocument()

		rerender(<AvatarUpload name="Ada" src="https://example.com/a.png" onRemove={onRemove} />)
		fireEvent.click(screen.getByRole('button', { name: 'Remove avatar' }))
		expect(onRemove).toHaveBeenCalled()
	})
})
