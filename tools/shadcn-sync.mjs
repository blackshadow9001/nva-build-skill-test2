#!/usr/bin/env node
// Fallback shadcn/ui installer for when ui.shadcn.com is blocked.
// Pulls the official Base UI component source from raw.githubusercontent.com (shadcn-ui/ui),
// resolves the style's `cn-*` classes into Tailwind utilities, swaps icon placeholders for lucide-react,
// writes src/components/ui/<name>.tsx and installs missing npm dependencies.
//
//   SHADCN_STYLE=vega node tools/shadcn-sync.mjs button badge input
//
// Output matches `npx shadcn@latest add` for the base-<style> registry. Never hand-edit the result.
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const REF = process.env.SHADCN_REF || "main"
const STYLE = process.env.SHADCN_STYLE || "vega"
const RAW = `https://raw.githubusercontent.com/shadcn-ui/ui/${REF}/apps/v4/registry`
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const names = process.argv.slice(2)
if (!names.length) {
  console.error("usage: SHADCN_STYLE=vega node tools/shadcn-sync.mjs <component> [...]")
  process.exit(1)
}

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

function parseStyle(css) {
  const map = new Map()
  const re = /\.(cn-[\w-]+)\s*\{\s*@apply\s+([^;]*);\s*\}/g
  let m
  while ((m = re.exec(css))) map.set(m[1], m[2].trim())
  return map
}

function resolveClasses(src, styles) {
  return src.replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)\1/g, (whole, q, body) => {
    if (!/\bcn-[\w-]+/.test(body)) return whole
    const out = body
      .split(/(\s+)/)
      .map((tok) => (styles.has(tok) ? styles.get(tok) : /^cn-[\w-]+$/.test(tok) ? "" : tok))
      .join("")
      .replace(/\s{2,}/g, " ")
      .trim()
    return q + out + q
  })
}

function resolveIcons(src) {
  const used = new Set()
  src = src.replace(/<IconPlaceholder\b([^>]*?)\/>/gs, (_, attrs) => {
    const lucide = /lucide="([\w]+)"/.exec(attrs)?.[1]
    if (!lucide) throw new Error("IconPlaceholder without lucide name")
    used.add(lucide)
    const rest = attrs.replace(/\s(lucide|tabler|hugeicons|phosphor|remixicon)="[^"]*"/g, "")
    return `<${lucide}${rest}/>`
  })
  src = src.replace(/^import\s+\{\s*IconPlaceholder\s*\}\s+from\s+["'][^"']+["']\s*\n/m, "")
  if (used.size) src = `import { ${[...used].sort().join(", ")} } from "lucide-react"\n` + src
  return src
}

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const have = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})])
const styles = parseStyle(await get(`${RAW}/styles/style-${STYLE}.css`))
const outDir = path.join(root, "src/components/ui")
mkdirSync(outDir, { recursive: true })
const needed = new Set()
const queue = [...names]
const done = new Set()

while (queue.length) {
  const name = queue.shift()
  if (done.has(name)) continue
  done.add(name)
  let src = await get(`${RAW}/bases/base/ui/${name}.tsx`)
  src = src.replace(/from\s+["']cn["']/g, 'from "@/lib/utils"')
  src = src.replace(/from\s+["']@\/registry\/bases\/base\/ui\/([\w-]+)["']/g, (_, dep) => {
    if (!existsSync(path.join(outDir, `${dep}.tsx`))) queue.push(dep)
    return `from "@/components/ui/${dep}"`
  })
  src = src.replace(/from\s+["']@\/registry\/bases\/base\/lib\/utils["']/g, 'from "@/lib/utils"')
  src = src.replace(/from\s+["']@\/registry\/bases\/base\/hooks\/([\w-]+)["']/g, 'from "@/hooks/$1"')
  src = resolveIcons(resolveClasses(src, styles))
  for (const m of src.matchAll(/from\s+["']((?:@[\w.-]+\/)?[\w.-]+)[^"']*["']/g)) {
    const spec = m[1]
    if (!spec.startsWith("@/") && !spec.startsWith(".") && spec !== "react" && !have.has(spec)) needed.add(spec)
  }
  writeFileSync(path.join(outDir, `${name}.tsx`), src)
  console.log(`✓ src/components/ui/${name}.tsx`)
}

if (needed.size) {
  console.log(`installing ${[...needed].join(" ")}`)
  execSync(`npm install --save-exact ${[...needed].join(" ")}`, { cwd: root, stdio: "inherit" })
}
