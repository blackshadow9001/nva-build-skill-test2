// IG00 · Homepage, Get Started
import { useEffect } from "react"
import { Link } from "react-router"
import { ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFlowState, useNotBuilt } from "@/app/flow-kit"
import { ApScreen, Photo, SLUG, sp, url } from "../parts"
import { defaults } from "../state"

export default function Home() {
  const notBuilt = useNotBuilt()
  const [, , reset] = useFlowState(SLUG, defaults)
  // Entry screen: start the flow with fresh answers.
  useEffect(() => {
    reset()
  }, [reset])
  return (
    <ApScreen>
      <section style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Photo
            name="home-hero.webp"
            alt="A smiling ACME team member holds a scruffy gray dog on a city sidewalk"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, color-mix(in oklch, var(--foreground) 45%, transparent) 0%, transparent 30%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: sp(4),
              left: sp(5),
              right: sp(5),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "var(--primary-foreground)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: sp(2.5), fontSize: 15, fontWeight: 600, letterSpacing: ".2em" }}>
              ACME
            </span>
            <Button variant="secondary" size="icon" aria-label="Menu" style={{ width: 44, height: 44 }} onClick={() => notBuilt("The menu")}>
              <Menu size={18} />
            </Button>
          </div>
        </div>
        <div className="ap-sheet" style={{ flex: "none", marginTop: sp(-11) }}>
          <div
            className="ap-rise"
            style={{ display: "flex", flexDirection: "column", gap: sp(3.5), padding: `${sp(8)} ${sp(5)} ${sp(5)}` }}
          >
            <span className="ap-eyebrow" style={{ color: "var(--primary)" }}>
              Rooted in care. Guided by science.
            </span>
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)", textWrap: "balance" }}>
              Care that grows with them.
            </h1>
            <p className="body" style={{ margin: 0, color: "var(--muted-foreground)", textWrap: "pretty" }}>
              One photo and a few taps. We'll shape everything around them, from the first visit on.
            </p>
            <Button size="lg" className="w-full" style={{ marginTop: sp(1.5) }} render={<Link to={url("meet")} />} nativeButton={false}>
              Get started with ACME
              <ArrowRight size={18} />
            </Button>
            <div style={{ color: "var(--primary)" }}>
              <Button variant="ghost" size="lg" className="w-full" onClick={() => notBuilt("Signing in")}>
                Sign in to your account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ApScreen>
  )
}
