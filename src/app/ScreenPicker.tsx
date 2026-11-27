import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { journey } from "./journey"
import { flows, screenUrl } from "./registry"
import { resetAllFlowState } from "./flow-kit"

/** Hidden screen picker: Ctrl/⌘+K, or add ?screens to any URL. The only place that lists every screen. */
export function ScreenPicker() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(() => new URLSearchParams(location.search).has("screens"))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(location.search).has("screens")) setOpen(true)
  }, [location.search])

  if (!open) return null

  const go = (url: string) => {
    setOpen(false)
    navigate(url)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-foreground/40 p-4 pt-[10vh]"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="All screens"
        className="max-h-[75vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-4 text-card-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">All screens</h2>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary hover:bg-muted"
            onClick={() => {
              resetAllFlowState()
              go(screenUrl(journey.start))
            }}
          >
            Restart the journey
          </button>
        </div>
        {flows.map((flow) => (
          <section key={flow.slug} className="mb-3">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{flow.title}</h3>
            <ul>
              {flow.screens.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => go(screenUrl(flow.slug, s.path))}
                  >
                    <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{s.id}</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
