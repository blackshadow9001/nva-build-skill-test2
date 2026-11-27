// IG06 · Booked in chat
import { CalendarPlus, CircleCheck, MessageCircleHeart, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotBuilt } from "@/app/flow-kit"
import { AiMark, ApScreen, AskBar, HeroBar, PetChip, downloadIcs, heroTop, sp, url } from "../parts"

export default function Booked() {
  const notBuilt = useNotBuilt()
  const addToCalendar = () =>
    downloadIcs({
      title: "Waffles: first puppy visit with Dr. Ruiz",
      // Tue, Nov 17 · 6:00 PM (local time), as shown on the artboard
      start: new Date(2026, 10, 17, 18, 0),
      minutes: 45,
      location: "Maple Grove Animal Hospital",
    })

  return (
    <ApScreen className="ig06">
      <section className="ap-hero ap-forest" style={{ paddingTop: heroTop, paddingBottom: sp(4), boxSizing: "border-box" }}>
        <HeroBar
          back={url("chat")}
          right={
            <Button variant="outline" size="icon" aria-label="Waffles' profile" style={{ width: 44, height: 44 }} onClick={() => notBuilt("Waffles' profile")}>
              <UserRound size={18} />
            </Button>
          }
        />
        <PetChip details="Golden Retriever · 10 wks · Fremont" />
      </section>
      <section className="ap-sheet">
        <div className="ap-scroll" style={{ gap: sp(4), paddingTop: sp(5) }}>
          <div className="ig-bub ig-me" style={{ transformOrigin: "right top" }}>
            Confirm visit
          </div>
          <div className="ig-ai ap-pop" style={{ transformOrigin: "left top" }}>
            <AiMark />
            <div style={{ display: "flex", flexDirection: "column", gap: sp(3), flex: 1, minWidth: 0 }}>
              <div className="ig-bub">You're all set. Waffles is booked for her first visit.</div>
            </div>
          </div>
          <div className="ig-hold ap-pop" style={{ marginLeft: sp(9.5) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${sp(3)} ${sp(4)}`,
                background: "var(--color-sage-50)",
              }}
            >
              <span
                className="small"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: sp(1.5),
                  padding: `${sp(1)} ${sp(2.5)}`,
                  borderRadius: 9999,
                  fontWeight: 600,
                  background: "var(--color-sage-100)",
                  color: "var(--color-sage-900)",
                }}
              >
                <CircleCheck size={14} />
                Booked
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: sp(1), padding: sp(4) }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.02em", color: "var(--surface-brand)" }}>Tue, Nov 17 · 6:00 PM</span>
              <span className="body" style={{ color: "var(--foreground)" }}>
                First puppy visit with Dr. Ruiz
              </span>
              <span className="small" style={{ color: "var(--muted-foreground)" }}>
                Maple Grove Animal Hospital · 1.2 mi from Fremont
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: sp(2), padding: `0 ${sp(4)} ${sp(4)}` }}>
              <Button size="lg" className="w-full" onClick={addToCalendar}>
                <CalendarPlus size={18} />
                Add to calendar
              </Button>
              <Button variant="ghost" size="lg" className="w-full" onClick={() => notBuilt("Visit prep")}>
                Get ready for her visit
              </Button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: sp(3),
              marginLeft: sp(9.5),
              padding: sp(4),
              borderRadius: "calc(var(--radius) * 3)",
              background: "var(--muted)",
            }}
          >
            <span className="small" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>
              What happens next
            </span>
            <div className="ig-li" style={{ alignItems: "flex-start" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  background: "var(--secondary)",
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                <MessageCircleHeart size={16} />
              </span>
              <span style={{ color: "var(--foreground)" }}>
                <b style={{ fontWeight: 600 }}>Marcus Lee</b>, the vet tech at Maple Grove, will reach out in a moment with a few details to help you get
                Waffles ready for her visit.
              </span>
            </div>
          </div>
        </div>
        <div className="ap-foot">
          <AskBar text="Message ACME" onSend={() => notBuilt("Chatting after booking")} onSpeak={() => notBuilt("Voice input")} />
        </div>
      </section>
    </ApScreen>
  )
}
