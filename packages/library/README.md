# Buzz UI

Elegant, zero-dependency React components. Server-first, SSR-safe, themeable with CSS tokens.

```bash
npm install @creo-team/buzz-ui
```

## Why Buzz UI

- **Zero runtime dependencies.** No animation library, no toast library, no icon
  library, no CSS-in-JS. Just React. Nothing to version-conflict with, and the
  smallest possible footprint in your bundle.
- **Server Components first.** Static components (Card, Badge, Table, Alert,
  forms, Footer, …) ship **zero client JavaScript**. Interactive pieces are
  precise client islands — even inside server components (e.g. the Footer's
  newsletter form, the Avatar image fallback, Checkbox's indeterminate sync).
- **Real accessibility.** Focus trapping and restoration, layered Escape /
  outside-press dismissal (nested overlays close one at a time), roving
  tabindex tabs, WAI-ARIA menu keyboard support with typeahead, combobox
  command palette, `aria-*` wiring done for you.
- **Zero-runtime styling.** One shipped stylesheet with CSS custom-property
  design tokens. Works with Tailwind, CSS Modules, or nothing. All motion is
  CSS-driven and honors `prefers-reduced-motion`.
- **Collision-aware overlays.** Tooltips, popovers, and menus render in a
  portal with flip/shift positioning — never clipped by `overflow: hidden`.
- **React 18.3 & 19.** Modern hooks (`useSyncExternalStore`, `useId`),
  controlled *and* uncontrolled modes everywhere, `asChild` polymorphism.

## Setup

Import the stylesheet once (tokens + all component styles, ~8 kB gzipped):

```tsx
// app/layout.tsx (or your app entry)
import '@creo-team/buzz-ui/styles.css'
```

Then use components:

```tsx
import { Card, Button } from '@creo-team/buzz-ui'

export default function Example() {
	return (
		<Card header="Hello">
			<Button hotkey="mod+s" onClick={save}>Save</Button>
		</Card>
	)
}
```

### Entry points

| Import | Contents |
| --- | --- |
| `@creo-team/buzz-ui` | Everything |
| `@creo-team/buzz-ui/server` | RSC-safe subset — static components render with zero client JS |
| `@creo-team/buzz-ui/client` | Interactive components, overlays, hooks, theme system |
| `@creo-team/buzz-ui/styles.css` | Design tokens + component styles |

The package is ESM-only with per-file modules, so tree-shaking works at file
granularity and `"use client"` boundaries are preserved exactly.

## Highlights

### Composition with `asChild`

Lend Button's styling and behavior to your router's link — no wrapper element:

```tsx
<Button asChild variant="outline">
	<Link href="/docs">Documentation</Link>
</Button>
```

### Toasts (no dependency)

```tsx
import { Toaster, toast } from '@creo-team/buzz-ui/client'

// Mount once near the root
<Toaster position="bottom-right" />

// Anywhere — including outside React
toast.success('Profile updated', { description: 'Changes are live.' })
toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Failed' })
```

### Keyboard shortcuts

```tsx
import { useHotkey, formatHotkey, Kbd } from '@creo-team/buzz-ui/client'

useHotkey({ key: 'mod+k', action: openPalette })
// 'mod' = ⌘ on macOS, Ctrl elsewhere
<Kbd>{formatHotkey('mod+k')}</Kbd>
```

### SSR theming without flashes

```tsx
// Server layout
import { cookies } from 'next/headers'
import { getServerTheme, themeInitScript } from '@creo-team/buzz-ui/server'

const theme = getServerTheme(cookies())
<html data-theme={theme}>
	<head><script dangerouslySetInnerHTML={{ __html: themeInitScript(theme) }} /></head>
```

See [THEMING.md](./THEMING.md) for the token reference and custom themes, and
[HOTKEYS.md](./HOTKEYS.md) for the shortcut system.

## Components

**Primitives** Button (9 variants, loading, hotkeys, asChild) · Spinner · Kbd ·
Separator · VisuallyHidden · Slot

**Forms** TextInput/Input · Textarea (CSS auto-resize) · Select · Checkbox
(indeterminate) · RadioGroup · Switch · Field

**Display** Card · Badge · Chip (removable) · Alert · Banner · Avatar +
AvatarGroup · Skeleton · Table · CodeBox · Progress · CircularProgress ·
Stepper

**Overlays** Tooltip · Infotip · Popover · Modal · Drawer · Dropdown ·
CommandPalette · Toast

**Navigation** Tabs + TabPanel · Breadcrumbs · Pagination · TopNav ·
SidebarNav · Menu · Footer

**Theme** ThemeProvider · ThemeSwitcher · EnhancedThemeSwitcher ·
CycleThemeSwitcher · six built-in themes + preset factory

## Styling and customization

Components expose stable styling hooks instead of utility soup:

- a class per part: `.bz-button`, `.bz-modal__panel`, `.bz-tabs__tab`, …
- state/variant data-attributes: `[data-variant="bold"]`, `[data-state="open"]`,
  `[data-selected]`, …

Override with plain CSS (or Tailwind's arbitrary variants):

```css
.bz-button[data-variant='bold'] { border-radius: 999px; }
```

Every color, radius and shadow is a CSS custom property (`--c-primary`,
`--radius-lg`, `--shadow-md`, …) — redefine them under your own
`[data-theme='…']` selector to create themes with no JavaScript at all.

## License

MIT
