# ACME prototype app

One React prototype for the NVA Waffles 2.0 work: React + TypeScript + Vite, Tailwind v4, shadcn/ui on Base UI, React Router.
It behaves like the product: `/` opens at the journey start and flows hand over to each other through `src/app/journey.ts`.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run check      # repo rules (flows self-contained, journey valid)
npm run build
```

- **See every screen:** press Ctrl/⌘+K, or add `?screens` to any URL. "Restart the journey" is in there too.
- **Flows** live in `src/flows/<slug>/`, one folder each, published from the canvas one flow per PR. A flow never imports from another flow.
- **Shared code:** `src/app` (shell), `src/components/ui` (shadcn, installed with the CLI or `tools/shadcn-sync.mjs`, never hand-edited), `src/lib`, `src/styles` (`syrup-tokens.css` is a verbatim copy of the Syrup tokens).
- **Preview:** Netlify builds every PR (`netlify.toml`) and posts the link on it.
