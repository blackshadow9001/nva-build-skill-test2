import type { ReactNode } from "react"

/** Phone-width frame, centred, up to 480px wide. The screen fills the viewport height. */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted">
      <div className="relative mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-background shadow-xl">
        {children}
      </div>
    </div>
  )
}
