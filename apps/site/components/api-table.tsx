interface ApiTableRow {
	prop: string
	type: string
	default?: string
	required?: boolean
	description: string
}

interface ApiTableProps {
	title?: string
	rows: ApiTableRow[]
	className?: string
}

export function ApiTable({ title = "API Reference", rows, className = "" }: ApiTableProps) {
	return (
		<div className={`mt-8 ${className}`}>
			<h3 className="text-xl font-semibold text-[var(--c-text)] mb-4">{title}</h3>
			<div className="overflow-x-auto border border-[var(--c-border)] rounded-md">
				<table className="min-w-full divide-y divide-[var(--c-border)]">
					<thead className="bg-[var(--c-surface)]">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-secondary)] uppercase tracking-wider">
								Prop
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-secondary)] uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-secondary)] uppercase tracking-wider">
								Default
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-secondary)] uppercase tracking-wider">
								Description
							</th>
						</tr>
					</thead>
					<tbody className="bg-[var(--c-background)] divide-y divide-[var(--c-border)]">
						{rows.map((row) => (
							<tr key={row.prop} className="hover:bg-[var(--c-surface)]">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<code className="text-sm font-mono text-[var(--c-text)] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
											{row.prop}
										</code>
										{row.required && (
											<span className="ml-2 text-red-500 text-sm">*</span>
										)}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<code className="text-sm font-mono text-[var(--c-text-secondary)]">
										{row.type}
									</code>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--c-text-secondary)]">
									{row.default ? (
										<code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
											{row.default}
										</code>
									) : (
										<span>—</span>
									)}
								</td>
								<td className="px-6 py-4 text-sm text-[var(--c-text-secondary)]">
									{row.description}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
