import type { FlowDef } from "./types"

const modules = import.meta.glob<{ default: FlowDef }>("../flows/*/flow.tsx", { eager: true })

export const flows: FlowDef[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order)

export function getFlow(slug: string): FlowDef | undefined {
  return flows.find((f) => f.slug === slug)
}

export function screenUrl(slug: string, path = ""): string {
  return path ? `/${slug}/${path}` : `/${slug}`
}
