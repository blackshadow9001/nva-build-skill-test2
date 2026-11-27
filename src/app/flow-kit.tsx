import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { useNavigate } from "react-router"
import { journey } from "./journey"
import { getFlow, screenUrl } from "./registry"

/** Leave a flow through a named exit. journey.links decides where it goes; otherwise the flow's own fallback. */
export function useExit(slug: string) {
  const navigate = useNavigate()
  return useCallback(
    (exit: string) => {
      const target = journey.links[`${slug}:${exit}`]
      if (target) {
        const [flow, ...rest] = target.split("/")
        navigate(screenUrl(flow, rest.join("/")))
        return
      }
      const fallback = getFlow(slug)?.exits?.[exit]
      navigate(screenUrl(slug, fallback ?? ""))
    },
    [navigate, slug],
  )
}

const stateKey = (slug: string) => `proto:${slug}:state`

function readState<T extends object>(slug: string, defaults: T): T {
  try {
    const raw = sessionStorage.getItem(stateKey(slug))
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

/** Answers that later screens in the same flow read. Kept for the browser session. */
export function useFlowState<T extends object>(slug: string, defaults: T) {
  const defaultsRef = useRef(defaults)
  const [state, setState] = useState<T>(() => readState(slug, defaults))
  useEffect(() => {
    try {
      sessionStorage.setItem(stateKey(slug), JSON.stringify(state))
    } catch {
      /* storage unavailable: state lives in memory only */
    }
  }, [slug, state])
  const update = useCallback((patch: Partial<T>) => setState((s) => ({ ...s, ...patch })), [])
  const reset = useCallback(() => setState(defaultsRef.current), [])
  return [state, update, reset] as const
}

export function resetAllFlowState() {
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("proto:"))
      .forEach((k) => sessionStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

type Toast = { id: number; message: string }
const ToastContext = createContext<(message: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const show = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto max-w-sm rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background shadow-lg"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

/** For screens and #placeholders that aren't built: shows "… isn't part of this prototype yet." */
export function useNotBuilt() {
  const toast = useToast()
  return useCallback((what: string) => toast(`${what} isn't part of this prototype yet.`), [toast])
}
