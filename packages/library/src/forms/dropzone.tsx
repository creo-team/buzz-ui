"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconUpload, IconX } from '../internal/icons.js'
import { useFileDrop, formatFileSize, type FileRejection } from './use-file-drop.js'

export interface DropzoneProps {
	/** File-input accept grammar: `.pdf`, `image/*`, `image/png`, comma-separated. */
	accept?: string
	/** Allow selecting multiple files. @default false */
	multiple?: boolean
	/** Per-file size cap in bytes (e.g. `5 * 1024 * 1024`). */
	maxSize?: number
	/** Cap on the total number of kept files. */
	maxFiles?: number
	disabled?: boolean
	/** Primary line inside the zone. @default 'Drag and drop files here' */
	label?: React.ReactNode
	/** Secondary line; defaults to a hint built from accept/maxSize. */
	description?: React.ReactNode
	/** Controlled file list. */
	files?: File[]
	/** Uncontrolled initial file list. @default [] */
	defaultFiles?: File[]
	/** Fires with the full updated list on every add or remove. */
	onFilesChange?: (files: File[]) => void
	/** Fires with the files rejected by a selection (type/size/count). */
	onFilesRejected?: (rejections: FileRejection[]) => void
	/** Render the kept files under the zone. @default true */
	showList?: boolean
	className?: string
}

/**
 * Drag-and-drop file picker: click, keyboard (Enter/Space) or drop. Selections
 * validate against `accept`, `maxSize` and `maxFiles`; problems report inline
 * under the zone (and through `onFilesRejected`), never as toasts. Kept files
 * list with sizes and per-file remove buttons.
 *
 * @example
 * <Dropzone
 *   accept="image/*,.pdf"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFilesChange={setFiles}
 * />
 */
export function Dropzone({
	accept,
	multiple = false,
	maxSize,
	maxFiles,
	disabled = false,
	label = 'Drag and drop files here',
	description,
	files: filesProp,
	defaultFiles,
	onFilesChange,
	onFilesRejected,
	showList = true,
	className,
}: DropzoneProps) {
	const [internalFiles, setInternalFiles] = React.useState<File[]>(defaultFiles ?? [])
	const files = filesProp ?? internalFiles
	const [rejections, setRejections] = React.useState<FileRejection[]>([])
	const zoneId = React.useId()

	const updateFiles = (next: File[]) => {
		if (filesProp === undefined) setInternalFiles(next)
		onFilesChange?.(next)
	}

	const { isDragOver, openPicker, rootProps, inputProps } = useFileDrop({
		accept,
		multiple,
		maxSize,
		maxFiles,
		currentCount: files.length,
		disabled,
		onAccepted: accepted => {
			setRejections([])
			updateFiles(multiple ? [...files, ...accepted] : accepted)
		},
		onRejected: rejected => {
			setRejections(rejected)
			onFilesRejected?.(rejected)
		},
	})

	const removeFile = (index: number) => {
		updateFiles(files.filter((_, i) => i !== index))
		setRejections([])
	}

	const hint =
		description ??
		[accept ? `Accepts ${accept}` : null, maxSize != null ? `up to ${formatFileSize(maxSize)}` : null]
			.filter(Boolean)
			.join(' · ')

	return (
		<div className={cx('bz-dropzone', className)}>
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled || undefined}
				aria-labelledby={`${zoneId}-label`}
				aria-describedby={rejections.length ? `${zoneId}-errors` : undefined}
				className="bz-dropzone__zone"
				data-drag-over={isDragOver || undefined}
				data-disabled={disabled || undefined}
				onClick={openPicker}
				onKeyDown={event => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault()
						openPicker()
					}
				}}
				{...rootProps}
			>
				<input {...inputProps} className="bz-dropzone__input" aria-hidden="true" />
				<IconUpload className="bz-dropzone__icon" aria-hidden="true" />
				<span id={`${zoneId}-label`} className="bz-dropzone__label">
					{label} <span className="bz-dropzone__browse">or browse</span>
				</span>
				{hint ? <span className="bz-dropzone__hint">{hint}</span> : null}
			</div>

			{rejections.length > 0 && (
				<div id={`${zoneId}-errors`} className="bz-dropzone__errors" role="alert">
					{rejections.map((rejection, index) => (
						<div key={`${rejection.file.name}-${index}`} className="bz-field__message" data-tone="error">
							{rejection.message}
						</div>
					))}
				</div>
			)}

			{showList && files.length > 0 && (
				<ul className="bz-dropzone__files">
					{files.map((file, index) => (
						<li key={`${file.name}-${file.size}-${index}`} className="bz-dropzone__file">
							<span className="bz-dropzone__file-name">{file.name}</span>
							<span className="bz-dropzone__file-size">{formatFileSize(file.size)}</span>
							<button
								type="button"
								className="bz-dropzone__file-remove"
								aria-label={`Remove ${file.name}`}
								onClick={() => removeFile(index)}
							>
								<IconX aria-hidden="true" />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
