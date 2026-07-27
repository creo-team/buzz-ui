import * as React from 'react'
import { cx } from '../internal/cx.js'
import { CopyButton } from '../utils/copy.js'

export interface CodeBoxProps {
	code: string
	language?: string
	label?: string
	showLineNumbers?: boolean
	className?: string
	copyable?: boolean
}

/**
 * Code display block with optional line numbers and a copy button.
 * Server-component safe — only the copy button hydrates.
 */
export function CodeBox({
	code,
	language = 'typescript',
	label = 'Code',
	showLineNumbers = false,
	className,
	copyable = true,
}: CodeBoxProps) {
	const lines = code.split('\n')

	return (
		<div className={cx('bz-code-box', className)}>
			{label && (
				<div className="bz-code-box__header">
					<span>{label}</span>
					{language && <span className="bz-code-box__language">{language}</span>}
				</div>
			)}
			<div className="bz-code-box__frame" data-has-header={label ? '' : undefined}>
				<pre className="bz-code-box__pre">
					<code className="bz-code-box__code">
						{showLineNumbers ? (
							lines.map((line, index) => (
								<span key={index} className="bz-code-box__line">
									<span className="bz-code-box__line-number" aria-hidden="true">
										{index + 1}
									</span>
									<span className="bz-code-box__line-content">{line || '\n'}</span>
								</span>
							))
						) : (
							code
						)}
					</code>
				</pre>
				{copyable && <CopyButton value={code} label="code" className="bz-code-box__copy" />}
			</div>
		</div>
	)
}
