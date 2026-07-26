# Hotkey System

Buzz UI ships its own zero-dependency hotkey system.

## Features

- **Single listener** — one document listener handles any number of hotkeys;
  dynamic hotkey arrays are always hook-safe
- **`mod` key** — `mod+k` means ⌘K on macOS and Ctrl+K everywhere else
- **Form-tag awareness** — plain keys don't fire while typing in inputs;
  modifier combos always do (override with `enableOnFormTags`)
- **Display formatting** — `formatHotkey('mod+k')` → `⌘+K` / `Ctrl+K`
- **Component integration** — built into Button, Modal, Drawer, CommandPalette
- **`<Kbd>`** — a matching key-cap component for rendering shortcuts

## useHotkey

```tsx
import { useHotkey } from '@creo-team/buzz-ui/client'

function MyComponent() {
	useHotkey({
		key: 'mod+k',
		action: openSearch,
		description: 'Open search',
	})

	// Arrays are fine, and may change length between renders
	useHotkey([
		{ key: 'mod+s', action: handleSave },
		{ key: 'escape', action: handleCancel, enabled: isEditing },
	])
}
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | — | Combination, e.g. `'ctrl+k'`, `'mod+shift+p'`, `'escape'` |
| `action` | `() => void` | — | Handler |
| `enabled` | `boolean` | `true` | Toggle without unregistering |
| `preventDefault` | `boolean` | `true` | Prevent the browser default |
| `enableOnFormTags` | `boolean` | `false` | Fire plain keys inside inputs/textareas |
| `description` | `string` | — | For tooltips / help surfaces |

Key aliases: `esc`, `return`, `space`, `up/down/left/right`, plus any
`event.key` value (`arrowdown`, `tab`, `f5`, single characters…).

## Buttons with shortcuts

```tsx
<Button hotkey="mod+s" onClick={save}>Save</Button>
```

The hotkey clicks the real button (so forms and analytics behave), is disabled
while the button is disabled or loading, and adds a "Press ⌘+S" title hint.

## Displaying shortcuts

```tsx
import { Kbd, formatHotkey } from '@creo-team/buzz-ui/client'

<Kbd>{formatHotkey('mod+k')}</Kbd>
```

## Overlays

Escape handling for Modal, Drawer, Dropdown, and CommandPalette goes through a
shared **layer stack** — when overlays nest, Escape closes only the topmost
one. Extra shortcuts can be scoped to an open overlay:

```tsx
<Modal
	open={open}
	onClose={close}
	hotkeys={[{ key: 'mod+enter', action: submit, description: 'Submit' }]}
>
	…
</Modal>
```
