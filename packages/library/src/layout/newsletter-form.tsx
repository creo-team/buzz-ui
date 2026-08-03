"use client"
import * as React from 'react'

export interface NewsletterFormProps {
	title: string
	description: string
	/** Client callback. When rendering the Footer from a Server Component, use `action` instead. */
	onSubmit?: (email: string) => void
	/** Form action — a URL or a server action; serializable across the RSC boundary. */
	action?: string | ((formData: FormData) => void | Promise<void>)
	buttonLabel?: string
}

/**
 * Client island for the Footer's newsletter signup — keeps the rest of the
 * footer a zero-JS Server Component.
 */
export function NewsletterForm({ title, description, onSubmit, action, buttonLabel = 'Subscribe' }: NewsletterFormProps) {
	const [email, setEmail] = React.useState('')
	const inputId = React.useId()

	return (
		<form
			className="bz-footer__newsletter"
			action={action as string | undefined}
			onSubmit={
				onSubmit
					? event => {
							event.preventDefault()
							if (email) onSubmit(email)
						}
					: undefined
			}
		>
			<h3 className="bz-footer__newsletter-title">{title}</h3>
			<p className="bz-footer__newsletter-description">{description}</p>
			<div className="bz-footer__newsletter-row">
				<label htmlFor={inputId} className="bz-visually-hidden">
					Email address
				</label>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					value={email}
					onChange={event => setEmail(event.target.value)}
					placeholder="Enter your email"
					className="bz-footer__newsletter-input"
				/>
				<button type="submit" className="bz-footer__newsletter-button">
					{buttonLabel}
				</button>
			</div>
		</form>
	)
}
