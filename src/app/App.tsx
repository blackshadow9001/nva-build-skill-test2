import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router"
import { flows, getFlow, screenUrl } from "./registry"
import { journey } from "./journey"
import { MobileShell } from "./MobileShell"
import { ScreenPicker } from "./ScreenPicker"
import { ToastProvider } from "./flow-kit"
import type { FlowDef, ScreenDef } from "./types"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Screen({ flow, screen }: { flow: FlowDef; screen: ScreenDef }) {
  const Component = screen.component
  useEffect(() => {
    document.title = `${screen.title} · ${flow.title}`
  }, [flow.title, screen.title])
  const body = (
    <div className={flow.rootClass ? `${flow.rootClass} flex min-h-0 flex-1 flex-col` : "flex min-h-0 flex-1 flex-col"}>
      <Component />
    </div>
  )
  return flow.device === "mobile" ? <MobileShell>{body}</MobileShell> : <div className="min-h-dvh">{body}</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              getFlow(journey.start.split("/")[0]) ? (
                <Navigate to={screenUrl(...(journey.start.split(/\/(.*)/) as [string, string?]))} replace />
              ) : (
                <p className="p-8 text-muted-foreground">No flows published yet.</p>
              )
            }
          />
          {flows.flatMap((flow) =>
            flow.screens.map((screen) => (
              <Route
                key={`${flow.slug}/${screen.path}`}
                path={screenUrl(flow.slug, screen.path)}
                element={<Screen flow={flow} screen={screen} />}
              />
            )),
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ScreenPicker />
      </ToastProvider>
    </BrowserRouter>
  )
}
