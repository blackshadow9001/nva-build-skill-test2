import type { ComponentType } from "react"

export type Device = "mobile" | "tablet" | "desktop"

export interface ScreenDef {
  /** Canvas artboard id, e.g. "IG00" */
  id: string
  title: string
  /** Route inside the flow: "" for the entry screen, then short kebab paths */
  path: string
  /** Source artboard file on the canvas */
  artboard: string
  component: ComponentType
}

export interface FlowDef {
  slug: string
  title: string
  /** Sort order: flow number (1e → 15, 1g → 17, 2 → 20), login 5, other samples 90 */
  order: number
  device: Device
  /** Class added to the flow's root, for flow-scoped CSS (flow.css) */
  rootClass?: string
  screens: ScreenDef[]
  /** Named exits → fallback screen path inside this flow, used when journey.ts has no link for the exit */
  exits?: Record<string, string>
}
