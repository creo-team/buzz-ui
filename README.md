# Buzz UI

A lean, elegant React component library with a Next.js showcase app.

## ⚠️ Disclaimer

⚠️ **This project is under very active development.**  
⚠️ **Expect bugs and breaking changes.**  
⚠️ **Do not use this in production without thorough testing.**  
⚠️ **Always follow best practices for component library versioning!**

## Repository layout

- `packages/library` – the reusable component library (`@creo-team/buzz-ui`)
- `apps/site` – Next.js site that showcases components

## Getting started

```bash
# install
npm install

# develop (runs the Next.js showcase)
npm run dev

# build the library
npm run -w @buzz-ui/library build
```

## Components (initial)

- Buttons (primary, secondary, ghost)
- Tooltip
- Infotip
- TextInput
- Checkbox
- Card
- TopNav
- Footer

## Design principles

- Accessibility by default
- CSS-first styling (Tailwind in showcase; library stays framework-agnostic CSS-utility-friendly)
- Minimal props, sensible defaults
- No semicolons, tabs preferred in code style

## Installation (as a dependency)

```bash
npm i @creo-team/buzz-ui
```

## License

MIT
