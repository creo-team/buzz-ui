# Hotkey System

The Buzz UI library includes a simple, elegant, and reusable hotkey system built on top of `react-hotkeys-hook`.

## Features

- **Simple API** - Easy to use hook and component props
- **TypeScript Support** - Full type safety with intelligent autocomplete
- **Component Integration** - Built into Button, Modal, Drawer, and CommandPalette
- **Flexible Configuration** - Support for single hotkeys or multiple hotkey configs
- **Automatic Formatting** - Display-friendly hotkey formatting (e.g., "Ctrl+K")
- **Conditional Enabling** - Enable/disable hotkeys based on component state

## Basic Usage

### useHotkey Hook

```tsx
import { useHotkey } from '@creo-team/buzz-ui'

function MyComponent() {
  useHotkey({
    key: 'ctrl+k',
    action: () => console.log('Hotkey pressed!'),
    description: 'Open search'
  })

  // Multiple hotkeys
  useHotkey([
    { key: 'ctrl+s', action: handleSave },
    { key: 'ctrl+n', action: handleNew }
  ])

  return <div>My Component</div>
}
```

### Component Props

#### Button with Hotkey

```tsx
import { Button } from '@creo-team/buzz-ui'

<Button hotkey="ctrl+s" onClick={handleSave}>
  Save
</Button>

// With HotkeyConfig object
<Button 
  hotkey={{ key: 'enter', description: 'Submit form' }}
  onClick={handleSubmit}
>
  Submit
</Button>
```

#### Modal with Hotkeys

```tsx
import { Modal } from '@creo-team/buzz-ui'

<Modal
  isOpen={open}
  onClose={handleClose}
  hotkeys={[
    { key: 'ctrl+s', action: handleSave, description: 'Save' },
    { key: 'ctrl+enter', action: handleSubmit, description: 'Submit' }
  ]}
>
  Modal content
</Modal>
```

#### Drawer with Hotkeys

```tsx
import { Drawer } from '@creo-team/buzz-ui'

<Drawer
  open={open}
  onOpenChange={setOpen}
  hotkeys={[
    { key: 'ctrl+shift+d', action: handleSpecialAction }
  ]}
>
  Drawer content
</Drawer>
```

## API Reference

### HotkeyConfig Interface

```tsx
interface HotkeyConfig {
  /** The key combination (e.g., 'ctrl+k', 'alt+t', 'enter', 'escape') */
  key: string
  /** The action to perform when the hotkey is pressed */
  action: () => void
  /** Optional description for the hotkey (useful for tooltips/help) */
  description?: string
  /** Whether the hotkey is enabled (default: true) */
  enabled?: boolean
  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean
}
```

### useHotkey Hook

```tsx
function useHotkey(config: HotkeyConfig | HotkeyConfig[]): void
```

### formatHotkey Utility

```tsx
function formatHotkey(key: string): string

// Examples:
formatHotkey('ctrl+k') // 'Ctrl+K'
formatHotkey('alt+shift+t') // 'Alt+Shift+T'
formatHotkey('escape') // 'Esc'
```

## Key Combinations

The hotkey system supports all standard key combinations:

- **Modifiers**: `ctrl`, `alt`, `shift`, `meta` (cmd on Mac)
- **Special Keys**: `enter`, `escape`, `space`, `tab`, `backspace`, `delete`
- **Arrow Keys**: `arrowup`, `arrowdown`, `arrowleft`, `arrowright`
- **Letters/Numbers**: `a-z`, `0-9`
- **Function Keys**: `f1-f12`

## Component Behavior

### Button
- Hotkey is only active when button is enabled (not disabled or loading)
- Automatically adds hotkey hint to title attribute
- Triggers the onClick handler when hotkey is pressed

### Modal
- Includes built-in `Escape` key to close
- Custom hotkeys are only active when modal is open
- Hotkeys are automatically disabled when modal closes

### Drawer
- Includes built-in `Escape` key to close
- Custom hotkeys are only active when drawer is open
- Hotkeys are automatically disabled when drawer closes

### CommandPalette
- Includes built-in navigation (`↑`/`↓`, `Enter`, `Escape`)
- Custom hotkeys are only active when palette is open
- Hotkeys are automatically disabled when palette closes

## Best Practices

1. **Use descriptive keys**: Choose intuitive key combinations
2. **Provide descriptions**: Help users understand what hotkeys do
3. **Avoid conflicts**: Be mindful of browser and system hotkeys
4. **Test thoroughly**: Ensure hotkeys work across different browsers
5. **Document hotkeys**: Make hotkeys discoverable to users

## Examples

See the `HotkeyDemo` component for comprehensive examples of all hotkey features.
