"use client"
import * as React from 'react'

/** Why a file was turned away, with a user-facing message. */
export interface FileRejection {
	file: File
	reason: 'type' | 'size' | 'count'
	message: string
}

/**
 * Match a file against an `accept` string using the file-input grammar:
 * extensions (`.pdf`), wildcard MIME types (`image/*`) and exact MIME types
 * (`image/png`), comma-separated. No accept means everything is accepted.
 */
export function isFileAccepted(file: File, accept?: string): boolean {
	if (!accept) return true
	const tokens = accept
		.split(',')
		.map(token => token.trim().toLowerCase())
		.filter(Boolean)
	if (tokens.length === 0) return true
	const type = (file.type || '').toLowerCase()
	const name = file.name.toLowerCase()
	return tokens.some(token => {
		if (token.startsWith('.')) return name.endsWith(token)
		if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
		return type === token
	})
}

/** Human-readable file size: 0 B, 340 B, 1.2 KB, 4.5 MB, 1.1 GB. */
export function formatFileSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) return ''
	if (bytes < 1024) return `${bytes} B`
	const units = ['KB', 'MB', 'GB', 'TB']
	let value = bytes
	let unit = -1
	do {
		value /= 1024
		unit += 1
	} while (value >= 1024 && unit < units.length - 1)
	return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

/** Options for {@link useFileDrop}. */
export interface UseFileDropOptions {
	/** File-input accept grammar: `.pdf`, `image/*`, `image/png`, comma-separated. */
	accept?: string
	/** Allow more than one file per selection. @default false */
	multiple?: boolean
	/** Per-file size cap in bytes. */
	maxSize?: number
	/** Cap on total files, counted against `currentCount`. */
	maxFiles?: number
	/** How many files the caller already holds (for `maxFiles` accounting). */
	currentCount?: number
	disabled?: boolean
	/** Receives the files that passed every check (never called empty). */
	onAccepted: (files: File[]) => void
	/** Receives the files that failed, with reasons (never called empty). */
	onRejected?: (rejections: FileRejection[]) => void
}

/**
 * The engine under Dropzone and AvatarUpload: wires a hidden file input plus
 * drag-and-drop onto any element, validates selections (type, size, count)
 * and reports accepted/rejected files. Spread `rootProps` on the drop target
 * and render `<input {...inputProps} />` inside it.
 */
export function useFileDrop({
	accept,
	multiple = false,
	maxSize,
	maxFiles,
	currentCount = 0,
	disabled = false,
	onAccepted,
	onRejected,
}: UseFileDropOptions) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = React.useState(false)
	// Drag events fire enter/leave for every child crossed; count instead of toggling.
	const dragDepth = React.useRef(0)

	const process = React.useCallback(
		(list: FileList | File[] | null) => {
			if (!list || disabled) return
			let files = Array.from(list)
			if (!multiple) files = files.slice(0, 1)

			const accepted: File[] = []
			const rejections: FileRejection[] = []
			for (const file of files) {
				if (!isFileAccepted(file, accept)) {
					rejections.push({ file, reason: 'type', message: `${file.name} isn't an accepted file type.` })
				} else if (maxSize != null && file.size > maxSize) {
					rejections.push({
						file,
						reason: 'size',
						message: `${file.name} is larger than ${formatFileSize(maxSize)}.`,
					})
				} else if (maxFiles != null && currentCount + accepted.length >= maxFiles) {
					rejections.push({ file, reason: 'count', message: `Only ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed.` })
				} else {
					accepted.push(file)
				}
			}
			if (accepted.length) onAccepted(accepted)
			if (rejections.length) onRejected?.(rejections)
		},
		[accept, multiple, maxSize, maxFiles, currentCount, disabled, onAccepted, onRejected]
	)

	const openPicker = React.useCallback(() => {
		if (!disabled) inputRef.current?.click()
	}, [disabled])

	const rootProps = {
		onDragEnter: (event: React.DragEvent) => {
			event.preventDefault()
			if (disabled) return
			dragDepth.current += 1
			setIsDragOver(true)
		},
		onDragOver: (event: React.DragEvent) => {
			// Required — without it the browser navigates to the dropped file.
			event.preventDefault()
		},
		onDragLeave: (event: React.DragEvent) => {
			event.preventDefault()
			dragDepth.current = Math.max(0, dragDepth.current - 1)
			if (dragDepth.current === 0) setIsDragOver(false)
		},
		onDrop: (event: React.DragEvent) => {
			event.preventDefault()
			dragDepth.current = 0
			setIsDragOver(false)
			process(event.dataTransfer?.files ?? null)
		},
	}

	const inputProps: React.InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> } = {
		ref: inputRef,
		type: 'file',
		accept,
		multiple,
		disabled,
		tabIndex: -1,
		onChange: event => {
			process(event.currentTarget.files)
			// Allow re-selecting the same file (change wouldn't fire otherwise).
			event.currentTarget.value = ''
		},
	}

	return { isDragOver, openPicker, inputRef, rootProps, inputProps }
}
