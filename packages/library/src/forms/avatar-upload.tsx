"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Avatar, type AvatarSize } from '../media/avatar.js'
import { IconCamera, IconX } from '../internal/icons.js'
import { useFileDrop, type FileRejection } from './use-file-drop.js'

export interface AvatarUploadProps {
	/** Current image URL (e.g. the saved avatar). */
	src?: string
	/** Name for the initials fallback while no image is set. */
	name?: string
	/** Avatar size preset. @default 'xl' */
	size?: AvatarSize
	/** Per-file size cap in bytes. */
	maxSize?: number
	/** Accepted image types. @default 'image/*' */
	accept?: string
	disabled?: boolean
	/**
	 * Fires when a valid image is picked or dropped, with a data-URL preview
	 * (the component also shows it immediately).
	 */
	onImageChange?: (file: File, previewUrl: string) => void
	/** When set, a remove button appears while an image is showing. */
	onRemove?: () => void
	/** Accessible label for the change control. @default 'Change avatar' */
	changeLabel?: string
	className?: string
}

/**
 * Avatar with built-in image upload: click or drop a picture onto it. Shows
 * an instant local preview, validates type and size inline, and falls back
 * to initials when empty — the profile-photo pattern, without wiring a
 * Dropzone yourself.
 *
 * @example
 * <AvatarUpload
 *   name={user.name}
 *   src={user.avatarUrl}
 *   maxSize={2 * 1024 * 1024}
 *   onImageChange={(file) => uploadAvatar(file)}
 *   onRemove={() => clearAvatar()}
 * />
 */
export function AvatarUpload({
	src,
	name,
	size = 'xl',
	maxSize,
	accept = 'image/*',
	disabled = false,
	onImageChange,
	onRemove,
	changeLabel = 'Change avatar',
	className,
}: AvatarUploadProps) {
	const [preview, setPreview] = React.useState<string | null>(null)
	const [error, setError] = React.useState<string | null>(null)
	const errorId = React.useId()

	const { isDragOver, openPicker, rootProps, inputProps } = useFileDrop({
		accept,
		maxSize,
		disabled,
		onAccepted: ([file]) => {
			setError(null)
			// FileReader (not object URLs): works everywhere the component
			// renders, needs no revocation bookkeeping, and avatars are small.
			const reader = new FileReader()
			reader.onload = () => {
				const url = typeof reader.result === 'string' ? reader.result : ''
				setPreview(url)
				onImageChange?.(file, url)
			}
			reader.readAsDataURL(file)
		},
		onRejected: (rejections: FileRejection[]) => {
			setError(rejections[0]?.message ?? 'That file can’t be used.')
		},
	})

	const shown = preview ?? src
	const showRemove = Boolean(onRemove && shown && !disabled)

	return (
		<div className={cx('bz-avatar-upload', className)}>
			<div className="bz-avatar-upload__frame" data-drag-over={isDragOver || undefined} {...rootProps}>
				<Avatar name={name} src={shown} size={size} />
				<button
					type="button"
					className="bz-avatar-upload__change"
					aria-label={changeLabel}
					aria-describedby={error ? errorId : undefined}
					disabled={disabled}
					onClick={openPicker}
				>
					<IconCamera aria-hidden="true" />
				</button>
				{showRemove && (
					<button
						type="button"
						className="bz-avatar-upload__remove"
						aria-label="Remove avatar"
						onClick={() => {
							setPreview(null)
							setError(null)
							onRemove?.()
						}}
					>
						<IconX aria-hidden="true" />
					</button>
				)}
				<input {...inputProps} className="bz-dropzone__input" aria-hidden="true" />
			</div>
			{error && (
				<div id={errorId} className="bz-field__message" data-tone="error" role="alert">
					{error}
				</div>
			)}
		</div>
	)
}
