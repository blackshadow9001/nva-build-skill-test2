#!/usr/bin/env node
// Repo checks: keeps flows self-contained and the app contract intact.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const errors = []
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
const rel = (p) => path.relative(root, p)

for (const f of ["src/app/journey.ts", "src/app/registry.ts", "src/app/flow-kit.tsx", "src/styles/syrup-tokens.css"]) {
  if (!existsSync(path.join(root, f))) errors.push(`missing ${f}`)
}

const flowsDir = path.join(root, "src/flows")
const slugs = existsSync(flowsDir) ? readdirSync(flowsDir).filter((d) => statSync(path.join(flowsDir, d)).isDirectory()) : []

for (const slug of slugs) {
  const dir = path.join(flowsDir, slug)
  for (const f of ["flow.tsx", "source.json", "HANDOFF.md"]) {
    if (!existsSync(path.join(dir, f))) errors.push(`${slug}: missing ${f}`)
  }
  const flowSrc = existsSync(path.join(dir, "flow.tsx")) ? readFileSync(path.join(dir, "flow.tsx"), "utf8") : ""
  if (flowSrc && !new RegExp(`slug:\\s*["']${slug}["']`).test(flowSrc)) errors.push(`${slug}: flow.tsx slug must equal the folder name`)
  for (const file of walk(dir).filter((f) => /\.(tsx?|css)$/.test(f))) {
    const src = readFileSync(file, "utf8")
    for (const m of src.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
      const spec = m[1]
      const abs = spec.startsWith(".") ? path.resolve(path.dirname(file), spec) : spec.startsWith("@/") ? path.join(root, "src", spec.slice(2)) : null
      if (!abs) continue
      const inFlows = abs.startsWith(flowsDir + path.sep)
      if (inFlows && !abs.startsWith(dir + path.sep) && abs !== dir) errors.push(`${rel(file)}: imports another flow (${spec})`)
      if (!inFlows && abs.startsWith(path.join(root, "src")) && !/src[\\/](app|components|lib|styles|hooks)\b/.test(abs)) errors.push(`${rel(file)}: imports outside shared code (${spec})`)
    }
    if (/\.tsx?$/.test(file) && /#[0-9a-fA-F]{3,8}\b/.test(src.replace(/\/\/.*$/gm, ""))) errors.push(`${rel(file)}: raw hex colour, use tokens`)
  }
  try {
    JSON.parse(readFileSync(path.join(dir, "source.json"), "utf8"))
  } catch (e) {
    errors.push(`${slug}: source.json is not valid JSON (${e.message})`)
  }
}

const journeySrc = readFileSync(path.join(root, "src/app/journey.ts"), "utf8").replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
const start = /start:\s*["']([^"']+)["']/.exec(journeySrc)?.[1]
if (start && !slugs.includes(start.split("/")[0])) {
  if (slugs.length) errors.push(`journey.start "${start}" is not a flow in src/flows`)
  else console.warn(`! journey.start "${start}" is not published yet (no flows in src/flows)`)
}
for (const m of journeySrc.matchAll(/["']([\w-]+):([\w-]+)["']\s*:\s*["']([^"']+)["']/g)) {
  if (!slugs.includes(m[1])) errors.push(`journey link ${m[1]}:${m[2]}: unknown flow ${m[1]}`)
  if (!slugs.includes(m[3].split("/")[0])) errors.push(`journey link ${m[1]}:${m[2]}: unknown target ${m[3]}`)
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"))
  process.exit(1)
}
console.log(`✓ check passed (${slugs.length} flow${slugs.length === 1 ? "" : "s"})`)
