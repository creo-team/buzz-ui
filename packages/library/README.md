# Buzz UI

Elegant, SSR-friendly React components with clear theming and great DX.

## Installation

```bash
npm install @creo-team/buzz-ui
```

Peer deps:

```bash
npm install react react-dom
```

## Usage

```tsx
// SSR-safe imports
import { Button, Card } from '@creo-team/buzz-ui/server'

// Client-only imports (hooks, contexts, interactive components)
// import { Tooltip, Modal, ThemeProvider } from '@creo-team/buzz-ui/client'

export default function Example() {
	return <Card header="Hello"><Button>Click me</Button></Card>
}
```

Code blocks can add a copy button with the `CopyButton`:

```tsx
import { CopyButton } from '@creo-team/buzz-ui/client'

export function MySnippet() {
	return <CopyButton value="npm i @creo-team/buzz-ui" label="install" />
}
```

## Server vs Client

- `@creo-team/buzz-ui/server`: SSR-safe primitives, layout, navigation, data display
- `@creo-team/buzz-ui/client`: interactive/animated overlays, providers, hooks

This split prevents client-only code from executing on the server in Next.js.

## Components

### Primitives
- Button - Multiple variants with hotkey support

### Forms
- TextInput, Textarea, Select
- Checkbox, RadioGroup

### Overlays
- Tooltip - Smart positioning, overflow prevention
- Modal - Backdrop, animations, document title
- Drawer - Slide-out panels
- Dropdown - Context menus
- CommandPalette - Command search interface
- Toast - Beautiful notifications (react-hot-toast)

### Layout
- Card - Content containers
- TopNav - Navigation header
- Footer - Page footer
- SidebarNav - Side navigation
- SidebarNavEnhanced - Advanced sidebar with search, sorting, and grouping

### Data Display
- Table - Data tables
- CodeBox - Syntax highlighted code
- Alert, Banner - Notifications
- Badge, Chip - Labels
- Avatar - User avatars
- Skeleton - Loading states
- Progress - Progress indicators

### Navigation
- Breadcrumbs - Navigation trail
- Tabs - Tab navigation
- Pagination - Page navigation
- Menu - Menu dropdowns

### Miscellaneous
- Accordion - Collapsible content
- Sheet - Slide-over panels
- Stepper - Step indicators
- InfoTip - Information tooltips
- ThemeSwitcher - Theme selection

## Theming

Buzz UI uses a comprehensive CSS variable system for complete theme customization. Choose from 6 built-in themes or create your own.

```tsx
// In your app root (client)
import { ThemeProvider } from '@creo-team/buzz-ui/client'
import { createThemeConfig, ThemePreset } from '@creo-team/buzz-ui'

const themes = [
	createThemeConfig(ThemePreset.Light),
	createThemeConfig(ThemePreset.Dark),
	// Add more themes as needed
]

export default function Root({ children }) {
	return <ThemeProvider themes={themes} defaultTheme="light">
		{children}
	</ThemeProvider>
}
```

**See [THEMING.md](./THEMING.md) for the complete theming guide with all CSS variables.**

## SSR with Next.js

- Import SSR-safe components from `/server` and client-only from `/client`
- For client providers (ThemeProvider, ToastProvider), wrap in client components or dynamic imports with `ssr: false`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, coding standards, and release process.

## Testing

We use Vitest + Testing Library. Run:

```bash
npm run test
```

Aim for high coverage by adding unit tests for each component and state.

## License

MIT
