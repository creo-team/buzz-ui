"use client"
import * as React from 'react'
import Link from 'next/link'
import { Button, Modal, Timestamp, TimestampFormat, TimestampProvider } from '@creo-team/buzz-ui/client'
import { Card, Select } from '@creo-team/buzz-ui/server'
import { CodeBlock } from '../../../components/code-block'
import { ApiTable } from '../../../components/api-table'

const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const OFFSETS = [
	{ label: '−20 s', ms: -20 * SECOND },
	{ label: '−5 m', ms: -5 * MINUTE },
	{ label: '−3 h', ms: -3 * HOUR },
	{ label: '−30 h', ms: -30 * HOUR },
	{ label: '−3 d', ms: -3 * DAY },
	{ label: '−10 d', ms: -10 * DAY },
	{ label: '−400 d', ms: -400 * DAY },
	{ label: '+5 m', ms: 5 * MINUTE },
	{ label: '+1 d', ms: DAY },
]

const FORMATS = [
	TimestampFormat.Compact,
	TimestampFormat.Relative,
	TimestampFormat.Contextual,
	TimestampFormat.Time,
	TimestampFormat.Absolute,
	TimestampFormat.Date,
]

const LOCALES = ['en-US', 'en-GB', 'de-DE', 'ja-JP']
const TIME_ZONES = ['America/Denver', 'Europe/London', 'Europe/Berlin', 'Asia/Kolkata', 'Pacific/Chatham']
const DUE_DATE = '2026-10-05'

/** Clock choices: the locale's own convention, or a forced 12- or 24-hour clock. */
const CLOCKS: { label: string; value: string; hour12: boolean | undefined }[] = [
	{ label: 'Locale default', value: 'LOCALE', hour12: undefined },
	{ label: '12-hour', value: 'H12', hour12: true },
	{ label: '24-hour', value: 'H23', hour12: false },
]

const USAGE = `import { Timestamp, TimestampFormat, TimestampProvider } from '@creo-team/buzz-ui/client'

// Once, near the root, from the signed-in user's settings:
<TimestampProvider locale={user.locale} timeZone={user.timeZone} hour12={user.hour12}>
  <App />
</TimestampProvider>

// Anywhere:
<Timestamp value={comment.createdAt} />                                    // 5 minutes ago
<Timestamp value={message.sentAt} format={TimestampFormat.Contextual} />    // Today at 3:04 PM
<Timestamp value={invoice.issuedAt} format={TimestampFormat.Absolute} />    // Oct 1, 2026, 3:04 PM
<Timestamp value={task.dueOn} format={TimestampFormat.Date} />              // '2026-10-05' → Mon, Oct 5, 2026

// Inside a link, keep it non-interactive:
<a href={post.url}>Posted <Timestamp value={post.createdAt} copyable={false} /></a>`

const LOGGER_USAGE = `"use client"
// Wrap the provider to pass onError (a function) from your app's logger.
export function AppTimestampProvider({ children, ...settings }: TimestampProviderProps) {
  return <TimestampProvider {...settings} onError={issue => logger.warn(issue, 'timestamp issue')}>{children}</TimestampProvider>
}`

/** Read once after mount, so the prerendered page never bakes in a build-time clock. */
function useMountedNow(): number | null {
	const [now, setNow] = React.useState<number | null>(null)
	React.useEffect(() => setNow(Date.now()), [])
	return now
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return <h2 className="mt-12 mb-4 text-2xl font-semibold text-[var(--c-text)]">{children}</h2>
}

function FormatsTable({ now }: { now: number | null }) {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-sm">
				<thead>
					<tr className="text-left text-[var(--c-text-secondary)]">
						<th className="py-2 pr-4 font-medium">Δ</th>
						{FORMATS.map(format => (
							<th key={format} className="py-2 pr-4 font-medium">
								{format}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{OFFSETS.map(offset => (
						<tr key={offset.label} className="border-t border-[var(--c-border)]">
							<td className="py-2 pr-4 text-[var(--c-text-secondary)]">{offset.label}</td>
							{FORMATS.map(format => (
								<td key={format} className="py-2 pr-4">
									{now !== null && <Timestamp value={now + offset.ms} format={format} />}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default function TimestampDocs() {
	const now = useMountedNow()
	const [locale, setLocale] = React.useState(LOCALES[0])
	const [timeZone, setTimeZone] = React.useState(TIME_ZONES[0])
	const [clock, setClock] = React.useState(CLOCKS[0])
	const [copied, setCopied] = React.useState('')
	const [rowClicks, setRowClicks] = React.useState(0)
	const [dialogOpen, setDialogOpen] = React.useState(false)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12">
			<h1 className="text-3xl font-bold text-[var(--c-text)]">Timestamp</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				Every date and time in one component. Hover or focus shows the full local date, time and zone; a click, Enter or
				Space copies an explicit string that still makes sense when pasted into an email read in another zone.
			</p>

			<SectionTitle>Formats</SectionTitle>
			<Card>
				<p className="mb-4 text-sm text-[var(--c-text-secondary)]">
					Compact for dense lists, Relative for activity, Contextual for chat and schedules, Absolute for audit, billing and
					exports, Time under a day divider, Date for calendar dates. Today, yesterday and the year come from calendar days
					in your zone.
				</p>
				<FormatsTable now={now} />
			</Card>

			<SectionTitle>Viewer settings</SectionTitle>
			<Card>
				<div className="grid gap-4 sm:grid-cols-3">
					<Select label="Locale" value={locale} onChange={event => setLocale(event.target.value)}>
						{LOCALES.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
					<Select label="Time zone" value={timeZone} onChange={event => setTimeZone(event.target.value)}>
						{TIME_ZONES.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
					<Select
						label="Clock"
						value={clock.value}
						onChange={event => setClock(CLOCKS.find(option => option.value === event.target.value) ?? CLOCKS[0])}
					>
						{CLOCKS.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>
				</div>
				<TimestampProvider locale={locale} timeZone={timeZone} hour12={clock.hour12}>
					<dl className="mt-6 grid gap-2 text-sm sm:grid-cols-[10rem_1fr]">
						<dt className="text-[var(--c-text-secondary)]">Relative</dt>
						<dd>{now !== null && <Timestamp value={now - 3 * HOUR} />}</dd>
						<dt className="text-[var(--c-text-secondary)]">Contextual</dt>
						<dd>{now !== null && <Timestamp value={now - 2 * DAY} format={TimestampFormat.Contextual} />}</dd>
						<dt className="text-[var(--c-text-secondary)]">Absolute</dt>
						<dd>{now !== null && <Timestamp value={now} format={TimestampFormat.Absolute} />}</dd>
					</dl>
				</TimestampProvider>
			</Card>

			<SectionTitle>Date-only values</SectionTitle>
			<Card>
				<p className="mb-4 text-sm text-[var(--c-text-secondary)]">
					A <code>YYYY-MM-DD</code> value is a calendar date: no time, no zone, never shifted a day.
				</p>
				<dl className="grid gap-2 text-sm sm:grid-cols-[10rem_1fr]">
					<dt className="text-[var(--c-text-secondary)]">Due (Date)</dt>
					<dd>
						<Timestamp value={DUE_DATE} format={TimestampFormat.Date} />
					</dd>
					<dt className="text-[var(--c-text-secondary)]">Due (Relative)</dt>
					<dd>
						<Timestamp value={DUE_DATE} />
					</dd>
					<dt className="text-[var(--c-text-secondary)]">Due (Compact)</dt>
					<dd>
						<Timestamp value={DUE_DATE} format={TimestampFormat.Compact} />
					</dd>
				</dl>
			</Card>

			<SectionTitle>Copy</SectionTitle>
			<Card>
				<p className="text-sm text-[var(--c-text-secondary)]">
					Click the time, then paste below. The copy carries the weekday, the year, the zone name when your locale has one,
					and the UTC offset, with plain spaces.
				</p>
				<p className="mt-4">
					Sent {now !== null && <Timestamp value={now - 5 * MINUTE} onCopied={setCopied} />}
				</p>
				<p className="mt-2 text-sm text-[var(--c-text-secondary)]">
					Last copied: <code>{copied || '—'}</code>
				</p>
				<textarea
					aria-label="Paste target"
					className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--c-border)] bg-[var(--c-background)] p-3 text-sm"
					rows={2}
					placeholder="Paste here"
				/>
			</Card>

			<SectionTitle>Inside a link</SectionTitle>
			<Card>
				<p className="mb-4 text-sm text-[var(--c-text-secondary)]">
					A button inside a link is invalid HTML, so pass <code>copyable={'{false}'}</code>: the tooltip still shows on
					hover, and the link keeps the label in its name.
				</p>
				<a className="text-[var(--c-link)] underline" href="#inside-a-link" id="inside-a-link">
					Release notes, posted {now !== null && <Timestamp value={now - 2 * DAY} copyable={false} />}
				</a>
			</Card>

			<SectionTitle>Clickable row</SectionTitle>
			<Card>
				<p className="mb-4 text-sm text-[var(--c-text-secondary)]">
					The row opens on click; clicking the timestamp copies and stops there. Row clicks: {rowClicks}
				</p>
				<table className="min-w-full text-sm">
					<tbody>
						<tr className="cursor-pointer hover:bg-[var(--c-hover)]" onClick={() => setRowClicks(count => count + 1)}>
							<td className="py-2 pr-4">Invoice #1042</td>
							<td className="py-2">{now !== null && <Timestamp value={now - 26 * HOUR} format={TimestampFormat.Compact} />}</td>
						</tr>
					</tbody>
				</table>
			</Card>

			<SectionTitle>Inside a dialog</SectionTitle>
			<Card>
				<p className="mb-4 text-sm text-[var(--c-text-secondary)]">
					Focus a timestamp in the dialog: Escape closes the tooltip first, and a second Escape closes the dialog.
					&ldquo;Copied&rdquo; is announced inside the dialog.
				</p>
				<Button onClick={() => setDialogOpen(true)}>Open activity</Button>
				<Modal open={dialogOpen} onOpenChange={setDialogOpen} header="Activity" showCloseButton>
					<ul className="space-y-2 text-sm">
						<li>Created {now !== null && <Timestamp value={now - 40 * DAY} format={TimestampFormat.Contextual} />}</li>
						<li>Edited {now !== null && <Timestamp value={now - 5 * MINUTE} />}</li>
						<li>Archived {now !== null && <Timestamp value={now - HOUR} format={TimestampFormat.Absolute} />}</li>
					</ul>
				</Modal>
			</Card>

			<SectionTitle>Usage</SectionTitle>
			<CodeBlock code={USAGE} label="Timestamp" />
			<div className="mt-4">
				<CodeBlock code={LOGGER_USAGE} label="Reporting issues to your logger" />
			</div>

			<ApiTable
				title="Timestamp Props"
				className="mt-12"
				rows={[
					{ prop: 'value', type: 'Date | number | string', required: true, description: 'A Date, epoch milliseconds, an ISO 8601 instant with an offset, or a YYYY-MM-DD calendar date.' },
					{ prop: 'format', type: 'TimestampFormat', default: 'TimestampFormat.Relative', description: 'Compact, Relative, Contextual, Time, Absolute or Date.' },
					{ prop: 'copyable', type: 'boolean', default: 'true', description: 'Set false inside a link or stretched-link card.' },
					{ prop: 'direction', type: 'TooltipDirection | Side', default: 'TooltipDirection.Top', description: 'Side the tooltip prefers.' },
					{ prop: 'locale', type: 'string', default: 'provider, else browser', description: 'BCP 47 locale. Invalid values fall back and are reported.' },
					{ prop: 'timeZone', type: 'string', default: 'provider, else viewer', description: 'IANA zone. Invalid values fall back and are reported.' },
					{ prop: 'hour12', type: 'boolean', default: 'provider, else locale', description: 'Force a 12-hour (true) or 24-hour (false) clock.' },
					{ prop: 'onCopied', type: '(text: string) => void', description: 'Called with the copied text after a successful copy.' },
					{ prop: 'className / id / data-* / ref', type: '—', description: 'Applied to the root span, which exists in every state.' },
				]}
			/>

			<ApiTable
				title="TimestampProvider Props"
				className="mt-8"
				rows={[
					{ prop: 'locale', type: 'string', description: 'Validated once; an invalid tag falls back to the browser locale and is reported.' },
					{ prop: 'timeZone', type: 'string', description: 'Validated once; an invalid zone falls back to the viewer’s zone and is reported.' },
					{ prop: 'hour12', type: 'boolean', default: 'locale convention', description: 'Force a 12-hour or 24-hour clock.' },
					{ prop: 'messages', type: 'Partial<TimestampMessages>', description: 'Localize the hints, "Copied" and failure text.' },
					{ prop: 'onError', type: '(issue: TimestampIssue) => void', description: 'Invalid values, invalid settings and copy failures, for your logger.' },
				]}
			/>

			<div className="mt-8">
				<p className="text-sm text-[var(--c-text-secondary)]">
					Full API:{' '}
					<Link className="text-[var(--c-link)] hover:underline" href="/components/timestamp/api">
						/components/timestamp/api
					</Link>
				</p>
			</div>
		</div>
	)
}
