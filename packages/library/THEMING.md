# Theming System

Buzz UI is themed entirely through CSS custom properties. The shipped
stylesheet (`@creo-team/buzz-ui/styles.css`) defines every token for six
built-in themes — `light`, `dark`, `midnight`, `forest`, `ocean`, `umbro` —
selected via `data-theme` on `<html>` (a matching class is also applied).

## Quick Start

```tsx
// 1. Import the stylesheet once (tokens + component styles)
import '@creo-team/buzz-ui/styles.css'

// 2. Add a switcher anywhere
import { ThemeSwitcher } from '@creo-team/buzz-ui/client'

<ThemeSwitcher />
```

Theme choice persists in a cookie, so the server can render the right theme on
the next request.

## Flicker-free SSR

Render the persisted theme on the server and guard against stale cached HTML
with a tiny inline script:

```tsx
// app/layout.tsx (Next.js App Router)
import { cookies } from 'next/headers'
import { getServerTheme, themeInitScript } from '@creo-team/buzz-ui/server'

export default async function RootLayout({ children }) {
	// `await` is required on Next 15 (async cookies) and harmless on Next 14.
	const theme = getServerTheme(await cookies(), 'light')
	return (
		<html lang="en" data-theme={theme} className={theme}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript(theme) }} />
			</head>
			<body>{children}</body>
		</html>
	)
}
```

`getServerTheme` also accepts a raw `Cookie` header string, so it works in any
framework: `getServerTheme(request.headers.get('cookie') ?? '')`.

Pass the value to any switcher as `initialTheme` to skip its mount fallback:

```tsx
<ThemeSwitcher initialTheme={theme} />
```

## Switcher components

| Component | UI |
| --- | --- |
| `ThemeSwitcher` | Segmented pills (up to 3 themes) |
| `EnhancedThemeSwitcher` | Pills + dropdown for the rest |
| `CycleThemeSwitcher` | One button that cycles |

All share one engine (`useThemeSwitcher`) — cookie persistence, DOM
application, Alt+T cycling, and a toast announcement. Build your own switcher
on the same hook:

```tsx
import { useThemeSwitcher } from '@creo-team/buzz-ui/client'

const { theme, setTheme, cycle } = useThemeSwitcher({
	themes: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
})
```

## App-level context (optional)

```tsx
import { ThemeProvider, useTheme } from '@creo-team/buzz-ui/client'

<ThemeProvider defaultTheme="light">…</ThemeProvider>
const { theme, setTheme } = useTheme()
```

## CSS Variable Reference

These are the tokens the shipped stylesheet defines per theme and that every
component consumes. Override any of them under your own theme selector.

### Core

| Token | Purpose |
| --- | --- |
| `--c-background` | Page background |
| `--c-text` / `--c-text-secondary` / `--c-text-muted` | Text hierarchy |
| `--c-surface` / `--c-surface-2` / `--c-surface-3` | Surface hierarchy (cards → nested → code) |
| `--c-border` / `--c-border-strong` | Borders |
| `--c-hover` / `--c-active` | Interactive state backgrounds |
| `--c-focus` | Focus outline color (page-level `:focus-visible`) |

### Brand

| Token | Purpose |
| --- | --- |
| `--c-primary` / `--c-primary-hover` | Primary color + hover |
| `--c-primary-light` | Light primary background (badges, active nav) |
| `--c-on-primary` | Text on primary backgrounds |
| `--c-primary-ring` | Focus rings |

### Semantic

| Token | Purpose |
| --- | --- |
| `--c-success` / `--c-success-light` | Success + light background |
| `--c-warning` / `--c-warning-light` | Warning + light background |
| `--c-danger` / `--c-danger-light` | Danger/error + light background |
| `--c-info` / `--c-info-light` | Info + light background |
| `--c-on-success` / `--c-on-danger` | Text on success/danger buttons (default `#fff`) |

### Component overrides (optional, with fallbacks)

| Token | Falls back to |
| --- | --- |
| `--c-tooltip-bg` / `--c-tooltip-text` / `--c-tooltip-border` | surface / text / border |
| `--c-modal-bg` / `--c-modal-overlay` / `--c-modal-border` | surface / `rgba(0,0,0,.6)` / border |
| `--c-dropdown-bg` / `--c-dropdown-border` / `--c-dropdown-hover` | surface / border / hover |

### Shape & elevation

| Token | Purpose |
| --- | --- |
| `--radius-sm` … `--radius-2xl` | Radius scale (6–16px) |
| `--shadow-sm` … `--shadow-xl` | Elevation scale |
| `--bz-ease` / `--bz-duration` | Motion timing |

## Creating Custom Themes

### Method 1: Override Individual Variables

```css
html[data-theme="custom"] {
  --c-primary: #ff6b35;
  --c-primary-hover: #ff5722;
  --c-primary-light: #fff3f0;
  
  --c-surface: #fafafa;
  --c-surface-2: #f5f5f5;
  --c-surface-3: #eeeeee;
  
  --c-tooltip-bg: #333333;
  --c-tooltip-text: #ffffff;
}
```

### Method 2: Use Theme Configuration

```tsx
import { createThemeConfig, ThemePreset } from '@creo-team/buzz-ui'

const customTheme = createThemeConfig(ThemePreset.Light, {
  label: 'Custom Light',
  colors: {
    primary: '#ff6b35',
    primaryHover: '#ff5722',
    primaryLight: '#fff3f0',
    
    surface: '#fafafa',
    surface2: '#f5f5f5',
    surface3: '#eeeeee',
    
    tooltipBg: '#333333',
    tooltipText: '#ffffff',
  }
})
```

### Method 3: Create From Scratch

```tsx
const brandTheme = {
  value: 'brand',
  label: 'Brand Theme',
  icon: 'palette', // or a React component
  colors: {
    // Text colors
    text: '#2c3e50',
    textSecondary: '#5a6c7d',
    textMuted: '#95a5a6',
    textInverse: '#ffffff',
    
    // Surfaces
    background: '#ffffff',
    surface: '#ffffff',
    surface2: '#f8f9fa',
    surface3: '#e9ecef',
    surfaceOverlay: 'rgba(255, 255, 255, 0.95)',
    
    // Borders
    border: '#dee2e6',
    borderStrong: '#adb5bd',
    borderSubtle: '#f1f3f5',
    
    // Interactive
    hover: '#f8f9fa',
    hoverBorder: '#adb5bd',
    active: '#e9ecef',
    selected: '#e3f2fd',
    focus: 'rgba(66, 153, 225, 0.5)',
    
    // Brand colors
    primary: '#3498db',
    primaryLight: '#ebf5fb',
    primaryHover: '#2980b9',
    primaryForeground: '#ffffff',
    
    // Component-specific
    tooltipBg: '#2c3e50',
    tooltipText: '#ffffff',
    tooltipBorder: 'rgba(44, 62, 80, 0.1)',
    
    modalBg: '#ffffff',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    modalBorder: '#dee2e6',
    
    dropdownBg: '#ffffff',
    dropdownBorder: '#dee2e6',
    dropdownHover: '#f8f9fa',
    
    codeBlockBg: '#282c34',
    codeBlockBorder: '#3e4451',
    codeBlockText: '#abb2bf',
    codeBlockLineNumber: '#5c6370',
    
    // Shadows
    shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    
    // Radius
    radiusSm: '0.25rem',
    radiusMd: '0.375rem',
    radiusLg: '0.5rem',
    radiusXl: '0.75rem',
  }
}
```

## Component-Specific Theming

### Tooltips

Tooltips automatically adjust their position to stay within the viewport and use dedicated CSS variables. The max-width varies by size:
- **Compact (sm)**: max 320px (20rem)
- **Comfortable (md)**: max 576px (36rem)  
- **Spacious (lg)**: max 896px (56rem) - Perfect for extensive help text and documentation

```css
/* Custom tooltip styling */
html[data-theme="custom"] {
  --c-tooltip-bg: #1a1a1a;
  --c-tooltip-text: #ffffff;
  --c-tooltip-border: rgba(255, 255, 255, 0.1);
}
```

### Modals

Modals use overlay and background variables for proper theming:

```css
html[data-theme="custom"] {
  --c-modal-bg: #ffffff;
  --c-modal-overlay: rgba(0, 0, 0, 0.75);
  --c-modal-border: #e0e0e0;
}
```

### Code Blocks

Code blocks have their own color scheme for syntax highlighting:

```css
html[data-theme="custom"] {
  --c-code-block-bg: #011627;
  --c-code-block-border: #0d2847;
  --c-code-block-text: #d6deeb;
  --c-code-block-line-number: #5e7186;
}
```

## Applying Themes at Runtime

```tsx
import { applyThemeColors } from '@creo-team/buzz-ui'

// Apply theme colors dynamically
applyThemeColors({
  value: 'custom',
  label: 'Custom',
  colors: {
    primary: '#ff6b35',
    // ... other colors
  }
})
```

## Built-in Themes

The library includes 6 built-in themes:

- **Light** - Clean, bright theme
- **Dark** - Modern dark theme
- **Midnight** - Deep blue dark theme
- **Forest** - Nature-inspired green theme
- **Ocean** - Calming blue theme
- **Umbro** - Premium glassmorphic theme

Each theme provides a complete set of CSS variables for consistent styling across all components.

## Shape: a second, independent dimension

Color theme answers *light or dark, which brand color*. **Shape** answers a
completely different question — *how tight are the corners, how heavy are
the shadows, how snappy is the motion* — and the two combine freely. Six
color themes × three shapes is eighteen distinct looks from one stylesheet,
with zero extra CSS to write.

Shape is selected via `data-shape` on `<html>`, exactly like color theme is
selected via `data-theme` — a separate attribute, a separate cookie, zero
coupling. It overrides only the radius, shadow and motion tokens; it never
touches color.

| Preset | Feel |
| --- | --- |
| `sharp` | Tight corners, flat shadows, snappy 120ms motion. Architectural, dashboard-dense — a Linear or Vercel-console feel. |
| `soft` | The shipped default — unmodified `:root` values. Upgrading consumers see no change unless they opt in. |
| `round` | Generous corners, soft glow shadows, a gentle 220ms overshoot. Warm and consumer-friendly — an Arc or Craft feel. |

```tsx
import { ShapeSwitcher } from '@creo-team/buzz-ui/client'

<ShapeSwitcher />
```

It persists to its own `shape` cookie and reads it back with `getServerShape`
for the same flicker-free SSR pattern as the color theme:

```tsx
// app/layout.tsx
import { cookies } from 'next/headers'
import { getServerShape, shapeInitScript } from '@creo-team/buzz-ui/server'
import { ShapeSwitcher } from '@creo-team/buzz-ui/client'

export default async function RootLayout({ children }) {
	const shape = getServerShape(await cookies(), 'soft')
	return (
		<html data-shape={shape}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: shapeInitScript(shape) }} />
			</head>
			<body>
				<ShapeSwitcher initialShape={shape} />
				{children}
			</body>
		</html>
	)
}
```

The switcher is a convenience — the mechanism underneath is three plain
attribute selectors, so a fourth preset is just more CSS:

```css
[data-shape='brutalist'] {
	--radius-sm: 0;
	--radius-md: 0;
	--radius-lg: 0;
	--radius-xl: 0;
	--shadow-md: none;
	--bz-duration: 0ms;
}
```

Build a custom switcher on the same engine `ThemeSwitcher` uses, minus the
color-palette application:

```tsx
import { useShapeSwitcher, ALL_SHAPES } from '@creo-team/buzz-ui/client'

const { shape, setShape, cycle } = useShapeSwitcher({ shapes: ALL_SHAPES })
```

## Best Practices

1. **Use CSS Variables** - Always use CSS variables instead of hard-coded colors
2. **Provide Fallbacks** - Include fallback values when using CSS variables
3. **Test All Themes** - Ensure your custom components work with all themes
4. **Maintain Contrast** - Keep sufficient contrast for accessibility
5. **Use Semantic Colors** - Use success/warning/error for their intended purposes

## Toast Notifications

Toasts are built in (zero dependencies) and consume the same tokens, so they
adapt to every theme automatically:

```tsx
import { toast } from '@creo-team/buzz-ui/client'

// Toasts automatically use theme colors
toast.success('Operation successful!')
toast.error('Something went wrong')
```

## Migration Guide

If you're migrating from hard-coded colors to CSS variables:

1. Replace color values with CSS variables
2. Add fallback values for safety
3. Test with multiple themes
4. Update any custom CSS

Example migration:

```css
/* Before */
.custom-component {
  background: #ffffff;
  border: 1px solid #e0e0e0;
}

/* After */
.custom-component {
  background: var(--c-surface, #ffffff);
  border: 1px solid var(--c-border, #e0e0e0);
}
```
