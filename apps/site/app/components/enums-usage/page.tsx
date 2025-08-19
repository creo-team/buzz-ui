'use client'

import { 
	Alert, 
	AlertVariant,
	Badge,
	BadgeVariant,
	Banner,
	BannerVariant,
	Button,
	ButtonVariant,
	ButtonSize,
	Card,
	CardVariant,
	Chip,
	ChipVariant,
	CircularProgress,
	CircularProgressVariant,
	Progress,
	ProgressVariant,
	ProgressSize,
	ProgressShape,
	Footer,
	FooterVariant,
	SidebarNav,
	SidebarNavVariant,
	Tabs,
	TabsVariant,
	TabsSize,
	Dropdown,
	DropdownItemVariant
} from '@creo-team/buzz-ui'

export default function EnumsUsagePage() {
	return (
		<div className="container mx-auto p-8 space-y-8">
			<h1 className="text-3xl font-bold text-[var(--c-text)] mb-8">
				Using Component Enums
			</h1>

			<Card variant={CardVariant.Elevated}>
				<h2 className="text-xl font-semibold mb-4">Why Enums?</h2>
				<p className="text-[var(--c-text-secondary)] mb-4">
					All component variants in Buzz UI are now defined as TypeScript enums for better type safety, 
					IDE autocomplete, and maintainability. You can still use string literals if you prefer, 
					as they will be automatically converted to the enum values.
				</p>
			</Card>

			<Card variant={CardVariant.Outlined}>
				<h2 className="text-xl font-semibold mb-4">Button Examples</h2>
				<div className="space-y-4">
					<div className="flex gap-3">
						{/* Using enum values (recommended) */}
						<Button variant={ButtonVariant.Bold} size={ButtonSize.Medium}>
							Bold Button
						</Button>
						<Button variant={ButtonVariant.Outline} size={ButtonSize.Small}>
							Outline Small
						</Button>
						<Button variant={ButtonVariant.Glass} size={ButtonSize.Large}>
							Glass Large
						</Button>
					</div>
					<div className="flex gap-3">
						{/* String literals still work for backwards compatibility */}
						<Button variant="success">Success</Button>
						<Button variant="danger">Danger</Button>
					</div>
				</div>
			</Card>

			<Card variant={CardVariant.Default}>
				<h2 className="text-xl font-semibold mb-4">Alert & Banner Examples</h2>
				<div className="space-y-4">
					<Alert variant={AlertVariant.Info} header="Information">
						Using AlertVariant.Info enum value
					</Alert>
					<Alert variant={AlertVariant.Success} header="Success">
						Operation completed successfully!
					</Alert>
					<Banner variant={BannerVariant.Development} animated>
						Development mode enabled
					</Banner>
				</div>
			</Card>

			<Card variant={CardVariant.Elevated}>
				<h2 className="text-xl font-semibold mb-4">Progress Components</h2>
				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-medium mb-2">Linear Progress</h3>
						<Progress 
							value={65} 
							variant={ProgressVariant.Primary}
							size={ProgressSize.Medium}
							shape={ProgressShape.Rounded}
							showLabel
						/>
					</div>
					<div>
						<h3 className="text-lg font-medium mb-2">Circular Progress</h3>
						<CircularProgress
							value={75}
							variant={CircularProgressVariant.Success}
							showLabel
						/>
					</div>
				</div>
			</Card>

			<Card variant={CardVariant.Outlined}>
				<h2 className="text-xl font-semibold mb-4">Data Display</h2>
				<div className="flex gap-3 flex-wrap">
					<Badge variant={BadgeVariant.Default}>Default</Badge>
					<Badge variant={BadgeVariant.Info}>Info</Badge>
					<Badge variant={BadgeVariant.Success}>Success</Badge>
					<Badge variant={BadgeVariant.Warning}>Warning</Badge>
					<Badge variant={BadgeVariant.Danger}>Danger</Badge>
					<Badge variant={BadgeVariant.Outline}>Outline</Badge>
				</div>
				<div className="flex gap-3 flex-wrap mt-4">
					<Chip variant={ChipVariant.Default}>Default Chip</Chip>
					<Chip variant={ChipVariant.Info}>Info Chip</Chip>
					<Chip variant={ChipVariant.Success}>Success Chip</Chip>
					<Chip variant={ChipVariant.Warning}>Warning Chip</Chip>
					<Chip variant={ChipVariant.Danger}>Danger Chip</Chip>
				</div>
			</Card>

			<Card variant={CardVariant.Default}>
				<h2 className="text-xl font-semibold mb-4">Navigation Components</h2>
				<Tabs
					variant={TabsVariant.Pills}
					size={TabsSize.Medium}
					value="tab1"
					onChange={() => {}}
					items={[
						{ key: 'tab1', label: 'Tab 1' },
						{ key: 'tab2', label: 'Tab 2' },
						{ key: 'tab3', label: 'Tab 3' }
					]}
				/>
			</Card>

			<Card variant={CardVariant.Elevated}>
				<h2 className="text-xl font-semibold mb-4">Import Example</h2>
				<pre className="bg-[var(--c-surface-3)] p-4 rounded-lg overflow-x-auto">
					<code>{`import { 
  Button,
  ButtonVariant,
  ButtonSize,
  Card,
  CardVariant,
  Alert,
  AlertVariant
} from '@creo-team/buzz-ui'

// Use enums for better type safety
<Button 
  variant={ButtonVariant.Bold}
  size={ButtonSize.Large}
>
  Click Me
</Button>

<Card variant={CardVariant.Elevated}>
  Card Content
</Card>

<Alert variant={AlertVariant.Success}>
  Success Message
</Alert>`}</code>
				</pre>
			</Card>
		</div>
	)
}
