# Contributing to Buzz UI

Thanks for helping make Buzz UI better!

## Development

- Node 18+
- pnpm or npm

Install dependencies and run builds/tests:

```bash
npm install
npm run dev # in packages/library for watch builds
npm run test
npm run typecheck
```

## Project Structure

- `src/server.ts`: SSR-safe exports
- `src/client.ts`: client-only exports (hooks/contexts/overlays)
- `src/*`: components organized by domain (primitives, overlays, forms, etc.)
- `dist/`: build outputs (esm/cjs/dts)

## SSR & Client Boundaries (Important)

- Components using React hooks, context, or DOM APIs must live in client-only modules and be exported via `client.ts`
- SSR primitives/layout should not import client-only code
- Keep the split clean to ensure Next.js RSC compatibility

## Code Style

- TypeScript with explicit prop types
- Prefer simple, readable code; avoid deep nesting
- Add concise JSDoc for props to improve generated API docs
- Tabs, no semicolons

## Testing

- Vitest + Testing Library (jsdom)
- Add tests for new components

```bash
npm run test
```

Strive for high coverage. Add tests for interactive states, ARIA roles, keyboard navigation, and SSR-safe imports.

## Building

- We use `tsup` to emit ESM, CJS, and DTS with sourcemaps
- React and ReactDOM are peer dependencies and excluded from bundles

```bash
npm run build
```

## Releasing

- Prepublish guard runs typecheck, tests, and build
- Recommended: use Changesets for versioning and changelogs, and configure a CI workflow to publish on tag

## License

MIT
