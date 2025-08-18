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

- Button
- Tooltip
- Infotip
- TextInput
- Checkbox
- Card
- TopNav
- Footer
 - Breadcrumbs
 - Tabs
 - Alert
 - Badge
 - Select, RadioGroup, Textarea
 - Skeleton, Progress
 - Avatar, Chip, Table, Stepper
 - Accordion, Menu, Sheet, Pagination

## Theming

Buzz UI uses CSS variables on the `html[data-theme]` node. Choose from built-in themes or define your own.

```tsx
// In your app root (client)
import { ThemeProvider } from '@creo-team/buzz-ui/client'

export default function Root({ children }) {
	return <ThemeProvider>{children}</ThemeProvider>
}
```

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
