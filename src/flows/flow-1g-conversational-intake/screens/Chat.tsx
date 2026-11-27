// IG05 · Chat: profile → vet in one turn (hold)
import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { ArrowRight, CalendarHeart, Check, Sparkles, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotBuilt } from "@/app/flow-kit"
import { AiMark, ApScreen, AskBar, HeroBar, Photo, PetChip, TypingDots, heroTop, sp, url } from "../parts"

const HELP = ["Puppy shots", "Finding a vet", "House training", "Food and nutrition", "Socializing"]
const EASY = ["Close to home", "Evening and weekend times", "Book online", "Video visits", "Short waits"]

function Chips({
  label,
  all,
  selected,
  onToggle,
}: {
  label: string
  all: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="ig-chips" role="group" aria-label={label}>
      {all.map((c) => {
        const on = selected.includes(c)
        return (
          <Button key={c} size="sm" variant={on ? "default" : "outline"} aria-pressed={on} onClick={() => onToggle(c)}>
            {on && <Check size={14} />}
            {c}
          </Button>
        )
      })}
    </div>
  )
}

function HoldCard({ slotDay, slotTime, className, onOtherTimes }: { slotDay: string; slotTime: string; className: string; onOtherTimes: () => void }) {
  const fg = "var(--surface-brand-foreground)"
  const fgSoft = "color-mix(in oklch, var(--surface-brand-foreground) 80%, transparent)"
  return (
    <div
      className={`ig-hold ${className}`}
      style={{
        marginLeft: sp(9.5),
        display: "flex",
        flexDirection: "column",
        gap: sp(4),
        padding: sp(5),
        borderRadius: "calc(var(--radius) * 2)",
        color: fg,
        background: "var(--primary)",
        boxShadow: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: sp(3) }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 9999,
            background: "var(--secondary)",
            color: "var(--primary)",
            flexShrink: 0,
          }}
        >
          <CalendarHeart size={20} />
        </span>
        <span
          className="ui"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: sp(1.5),
            padding: `${sp(1.5)} ${sp(3)}`,
            borderRadius: 9999,
            background: "var(--color-orange-100)",
            color: "var(--color-orange-900)",
            fontWeight: 600,
          }}
        >
          <Sparkles size={14} />
          Held for Waffles
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
        <span className="small" style={{ letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600, color: fgSoft }}>
          First puppy visit
        </span>
        <span style={{ display: "flex", alignItems: "baseline", gap: sp(2) }}>
          <span className="h3" style={{ color: fg }}>
            {slotDay}
          </span>
          <span className="ui" style={{ color: fgSoft }}>
            {slotTime}
          </span>
        </span>
        <span className="ui" style={{ color: fg, textWrap: "pretty" }}>
          Maple Grove Animal Hospital, 1.2 mi. Dr. Ruiz sees lots of Golden puppies and checks hips early. We'll hold this time for 24 hrs.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: sp(3),
          padding: `${sp(3)} ${sp(3.5)}`,
          borderRadius: "calc(var(--radius) * 1.4)",
          background: "color-mix(in oklch, var(--surface-brand-foreground) 12%, transparent)",
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: sp(0.5) }}>
          <span className="small" style={{ fontWeight: 600, color: fg }}>
            Price estimate
          </span>
          <span className="small" style={{ color: fgSoft }}>
            $85 exam + about $40–$100 for her first puppy shots (DHPP)
          </span>
        </span>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.02em", color: fg, whiteSpace: "nowrap" }}>$125–$185</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: sp(2) }}>
        <Link
          to={url("booked")}
          className="ui"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: sp(2),
            height: 44,
            padding: `0 ${sp(5)}`,
            borderRadius: 9999,
            color: "var(--color-brand-950)",
            fontWeight: 600,
            backgroundColor: "var(--color-brand-200)",
          }}
        >
          Confirm visit
          <ArrowRight size={16} />
        </Link>
        <span style={{ color: fg }}>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-[color-mix(in_oklch,var(--surface-brand-foreground)_12%,transparent)] hover:text-[var(--surface-brand-foreground)]"
            onClick={onOtherTimes}
          >
            See other times
          </Button>
        </span>
      </div>
    </div>
  )
}

function AiTurn({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="ig-ai ig-turn">
      <AiMark />
      <div style={{ display: "flex", flexDirection: "column", gap: sp(3), flex: 1, minWidth: 0 }}>
        <div className="ig-intro">
          <span className="ig-bub ig-wait" aria-hidden="true">
            <TypingDots style={{ display: "flex", gap: 4 }} />
          </span>
          <div className="ig-bub ig-say">{text}</div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Chat() {
  const [params] = useSearchParams()
  const notBuilt = useNotBuilt()
  const allInOneStyle = params.get("chat") === "all"
  const [sent, setSent] = useState(params.get("conversation") === "sent")
  const [step, setStep] = useState(1)
  const [help, setHelp] = useState<string[]>(["Puppy shots", "Finding a vet"])
  const [easy, setEasy] = useState<string[]>(["Close to home", "Evening and weekend times", "Book online"])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const go = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    const timers = [60, 1700, 2000, 2400].map((t) => window.setTimeout(go, t))
    return () => timers.forEach(window.clearTimeout)
  }, [step, sent])

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  const send = () => {
    setSent(true)
    setStep(1)
  }
  const next = () => setStep((s) => s + 1)

  const evening = easy.includes("Evening and weekend times")
  const slotDay = "Tue, Nov 17"
  const slotTime = evening ? "6:00 PM" : "10:15 AM"
  const allInOne = sent && allInOneStyle
  const stepMode = sent && !allInOneStyle
  const starters = ["Waffles needs a vet", "Know more about puppy shots", "House training tips"]
  const profile = (
    <Button variant="outline" size="icon" aria-label="Waffles' profile" style={{ width: 44, height: 44 }} onClick={() => notBuilt("Waffles' profile")}>
      <UserRound size={18} />
    </Button>
  )

  return (
    <ApScreen className="ig05">
      <section className="ap-hero ap-forest" style={{ paddingTop: heroTop, paddingBottom: sp(4), boxSizing: "border-box" }}>
        <HeroBar back={url("confirm")} right={profile} />
        {!sent && (
          <div
            className="ap-rise"
            style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: sp(2), marginTop: sp(2) }}
          >
            <Photo
              name="waffles-snow.jpg"
              alt="Photo of Waffles"
              className="ap-float"
              style={{
                display: "block",
                width: 112,
                height: 112,
                borderRadius: 9999,
                objectFit: "cover",
                objectPosition: "50% 28%",
                boxShadow: "0 14px 30px -16px color-mix(in oklch, var(--foreground) 55%, transparent), 0 0 0 4px var(--card)",
              }}
            />
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
              Waffles
            </h1>
            <span className="small" style={{ color: "var(--muted-foreground)" }}>
              Golden Retriever · 10 wks · 14 lb · Fremont
            </span>
          </div>
        )}
        {sent && <PetChip details="Golden Retriever · 10 wks · Fremont" />}
      </section>
      <section className="ap-sheet">
        <div ref={scrollRef} className="ap-scroll" style={{ gap: sp(4), paddingTop: sp(5) }} aria-live="polite">
          <div className="ig-ai ap-pop" style={{ transformOrigin: "left top" }}>
            <AiMark />
            <div style={{ display: "flex", flexDirection: "column", gap: sp(3), flex: 1, minWidth: 0 }}>
              <div className="ig-intro">
                <span className="ig-bub ig-wait" aria-hidden="true">
                  <TypingDots style={{ display: "flex", gap: 4 }} />
                </span>
                <div className="ig-bub ig-say">
                  <b style={{ fontWeight: 600 }}>How can we help Waffles today?</b> Ask anything, or pick a place to start.
                </div>
              </div>
              {!sent && (
                <div className="ig-chips ig-stag">
                  {starters.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={send}>
                      {s}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {sent && (
            <div className="ig-bub ig-me ap-pop" style={{ transformOrigin: "right top" }}>
              Waffles needs a vet.
            </div>
          )}

          {allInOne && (
            <>
              <div className="ig-ai ap-pop" style={{ transformOrigin: "left top" }}>
                <AiMark />
                <div style={{ display: "flex", flexDirection: "column", gap: sp(3), flex: 1, minWidth: 0 }}>
                  <div className="ig-bub">
                    Of course. Let's get Waffles her first visit. I've picked what fits a 10-week-old puppy. Tap anything to change it.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
                    <span className="ig-q">What do you need help with right now?</span>
                    <Chips label="What do you need help with right now?" all={HELP} selected={help} onToggle={toggle(help, setHelp)} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
                    <span className="ig-q">What would make care easier?</span>
                    <Chips label="What would make care easier?" all={EASY} selected={easy} onToggle={toggle(easy, setEasy)} />
                  </div>
                </div>
              </div>
              <HoldCard className="ap-pop" slotDay={slotDay} slotTime={slotTime} onOtherTimes={() => notBuilt("Other times")} />
            </>
          )}

          {stepMode && (
            <AiTurn text="Of course. Let's get Waffles her first visit. What do you need help with right now?">
              {step === 1 && (
                <div className="ig-after" style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
                  <Chips label="What do you need help with right now?" all={HELP} selected={help} onToggle={toggle(help, setHelp)} />
                  <div>
                    <Button size="sm" onClick={next}>
                      Next
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </AiTurn>
          )}

          {stepMode && step >= 2 && (
            <>
              <div className="ig-bub ig-me ap-pop" style={{ transformOrigin: "right top" }}>
                {help.join(", ") || "Not sure yet"}
              </div>
              <AiTurn text="Got it. What would make care easier?">
                {step === 2 && (
                  <div className="ig-after" style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
                    <Chips label="What would make care easier?" all={EASY} selected={easy} onToggle={toggle(easy, setEasy)} />
                    <div>
                      <Button size="sm" onClick={next}>
                        Find a time
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </AiTurn>
            </>
          )}

          {stepMode && step >= 3 && (
            <>
              <div className="ig-bub ig-me ap-pop" style={{ transformOrigin: "right top" }}>
                {easy.join(", ") || "Anything works"}
              </div>
              <AiTurn text="Here's a visit that fits. I'm holding it for you." />
              <HoldCard className="ig-late" slotDay={slotDay} slotTime={slotTime} onOtherTimes={() => notBuilt("Other times")} />
            </>
          )}
        </div>
        <div className="ap-foot">
          <AskBar text={sent ? "Message ACME" : "Waffles needs a vet"} onSend={send} onSpeak={() => notBuilt("Voice input")} />
        </div>
      </section>
    </ApScreen>
  )
}
