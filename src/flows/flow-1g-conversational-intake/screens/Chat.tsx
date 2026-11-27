// IG05 · Chat: profile → vet in one turn (hold)
// The conversation is scripted (no AI service): replies follow what Lucy picks, types or says.
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useSearchParams } from "react-router"
import { ArrowRight, CalendarHeart, Check, Sparkles, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFlowState, useNotBuilt, useToast } from "@/app/flow-kit"
import { AiMark, ApScreen, AskBar, HeroBar, Photo, PetChip, SLUG, TypingDots, heroTop, sp, url } from "../parts"
import { defaults, detailsLine, nameOf, photoOf, possessive } from "../state"
import { replyTo, type Topic } from "../chat-script"

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

function HoldCard({
  name,
  slotDay,
  slotTime,
  className,
  onOtherTimes,
}: {
  name: string
  slotDay: string
  slotTime: string
  className: string
  onOtherTimes: () => void
}) {
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
          Held for {name}
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

function AiTurn({ text, children }: { text: ReactNode; children?: ReactNode }) {
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

/** "10 weeks" → "a 10-week-old puppy" (the canvas wording); anything else → "a young puppy". */
const puppyWords = (age: string) => {
  const weeks = /^(\d+) weeks$/.exec(age)?.[1]
  return weeks ? `a ${weeks}-week-old puppy` : "a young puppy"
}

/** One entry in the conversation. Booking turns render their chips only while they are the open question. */
type Msg =
  | { id: number; from: "me"; text: string }
  | { id: number; from: "ai"; kind: "text"; text: string; quick: { label: string; topic: Topic }[] }
  | { id: number; from: "ai"; kind: "help" | "easy" | "hold" | "allInOne" }

type NewMsg = Msg extends infer M ? (M extends Msg ? Omit<M, "id"> : never) : never

/** Where the booking conversation is: which question is waiting for an answer. */
type Stage = "none" | "help" | "easy" | "held"

export default function Chat() {
  const [params] = useSearchParams()
  const notBuilt = useNotBuilt()
  const toast = useToast()
  const [pet, setPet] = useFlowState(SLUG, defaults)
  const name = nameOf(pet)
  const photo = photoOf(pet)
  const allInOneStyle = params.get("chat") === "all"

  const nextId = useRef(1)
  const msg = (m: NewMsg): Msg => ({ ...m, id: nextId.current++ }) as Msg
  const [stage, setStage] = useState<Stage>("none")
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState("")
  const [help, setHelp] = useState<string[]>(["Puppy shots", "Finding a vet"])
  const [easy, setEasy] = useState<string[]>(["Close to home", "Evening and weekend times", "Book online"])
  const scrollRef = useRef<HTMLDivElement>(null)

  const sent = messages.some((m) => m.from === "me")
  const evening = easy.includes("Evening and weekend times")
  const slotDay = "Tue, Nov 17"
  const slotTime = evening ? "6:00 PM" : "10:15 AM"

  // IG06 shows the time that was held here
  useEffect(() => {
    if (pet.slotTime !== slotTime) setPet({ slotTime })
  }, [pet.slotTime, slotTime, setPet])

  useEffect(() => {
    const go = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    const timers = [60, 1700, 2000, 2400].map((t) => window.setTimeout(go, t))
    return () => timers.forEach(window.clearTimeout)
  }, [messages.length])

  /** Start booking: one turn with everything (All in one) or one question at a time (Step by step). */
  const startBooking = (preset?: string[]): Msg[] => {
    if (preset) setHelp((h) => [...new Set([...h, ...preset])])
    if (allInOneStyle) {
      setStage("held")
      return [msg({ from: "ai", kind: "allInOne" })]
    }
    setStage("help")
    return [msg({ from: "ai", kind: "help" })]
  }

  /** Lucy says something (chip, typed or spoken). The reply depends on what she said and where the booking is. */
  const say = (text: string, topicHint?: Topic) => {
    const clean = text.trim()
    if (!clean) return
    const mine = msg({ from: "me", text: clean })
    // A typed answer to the open booking question moves the booking on.
    if (!topicHint && stage === "help") {
      setStage("easy")
      setMessages((m) => [...m, mine, msg({ from: "ai", kind: "easy" })])
      return
    }
    if (!topicHint && stage === "easy") {
      setStage("held")
      setMessages((m) => [...m, mine, msg({ from: "ai", kind: "hold" })])
      return
    }
    const reply = replyTo(clean, { name, age: pet.age, held: stage === "held" }, topicHint)
    const next: Msg[] = reply.book
      ? startBooking(reply.preset)
      : [msg({ from: "ai", kind: "text", text: reply.text, quick: reply.quick })]
    setMessages((m) => [...m, mine, ...next])
  }

  // ?conversation=sent opens the chat as if Lucy already asked for a vet
  const opened = useRef(false)
  useEffect(() => {
    if (opened.current || params.get("conversation") !== "sent") return
    opened.current = true
    say(`${name} needs a vet.`, "vet")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answerHelp = () => {
    setStage("easy")
    setMessages((m) => [...m, msg({ from: "me", text: help.join(", ") || "Not sure yet" }), msg({ from: "ai", kind: "easy" })])
  }
  const answerEasy = () => {
    setStage("held")
    setMessages((m) => [...m, msg({ from: "me", text: easy.join(", ") || "Anything works" }), msg({ from: "ai", kind: "hold" })])
  }
  const send = () => {
    // Before the first message the field suggests "<name> needs a vet"; sending it empty uses that suggestion.
    const text = draft.trim() || (sent ? "" : `${name} needs a vet`)
    setDraft("")
    say(text)
  }

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  const starters: { label: string; topic: Topic }[] = [
    { label: `${name} needs a vet`, topic: "vet" },
    { label: "Know more about puppy shots", topic: "shots" },
    { label: "House training tips", topic: "training" },
  ]
  const lastAi = [...messages].reverse().find((m) => m.from === "ai")
  const isOpen = (m: Msg) => m === lastAi
  const profile = (
    <Button
      variant="outline"
      size="icon"
      aria-label={`${possessive(name)} profile`}
      style={{ width: 44, height: 44 }}
      onClick={() => notBuilt(`${possessive(name)} profile`)}
    >
      <UserRound size={18} />
    </Button>
  )
  const hold = (className: string) => (
    <HoldCard name={name} className={className} slotDay={slotDay} slotTime={slotTime} onOtherTimes={() => notBuilt("Other times")} />
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
              name={photo.name}
              alt={`Photo of ${name}`}
              className="ap-float"
              style={{
                display: "block",
                width: 112,
                height: 112,
                borderRadius: 9999,
                objectFit: "cover",
                objectPosition: photo.pos,
                boxShadow: "0 14px 30px -16px color-mix(in oklch, var(--foreground) 55%, transparent), 0 0 0 4px var(--card)",
              }}
            />
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
              {name}
            </h1>
            <span className="small" style={{ color: "var(--muted-foreground)" }}>
              {detailsLine(pet, true)}
            </span>
          </div>
        )}
        {sent && <PetChip />}
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
                  <b style={{ fontWeight: 600 }}>How can we help {name} today?</b> Ask anything, or pick a place to start.
                </div>
              </div>
              {!sent && (
                <div className="ig-chips ig-stag">
                  {starters.map((s) => (
                    <Button key={s.label} variant="outline" size="sm" onClick={() => say(s.label, s.topic)}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {messages.map((m) => {
            if (m.from === "me")
              return (
                <div key={m.id} className="ig-bub ig-me ap-pop" style={{ transformOrigin: "right top" }}>
                  {m.text}
                </div>
              )
            if (m.kind === "text")
              return (
                <AiTurn key={m.id} text={m.text}>
                  {isOpen(m) && m.quick.length > 0 && (
                    <div className="ig-chips ig-after">
                      {m.quick.map((q) => (
                        <Button key={q.label} variant="outline" size="sm" onClick={() => say(q.label, q.topic)}>
                          {q.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </AiTurn>
              )
            if (m.kind === "help")
              return (
                <AiTurn key={m.id} text={`Of course. Let's get ${name} her first visit. What do you need help with right now?`}>
                  {isOpen(m) && stage === "help" && (
                    <div className="ig-after" style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
                      <Chips label="What do you need help with right now?" all={HELP} selected={help} onToggle={toggle(help, setHelp)} />
                      <div>
                        <Button size="sm" onClick={answerHelp}>
                          Next
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </AiTurn>
              )
            if (m.kind === "easy")
              return (
                <AiTurn key={m.id} text="Got it. What would make care easier?">
                  {isOpen(m) && stage === "easy" && (
                    <div className="ig-after" style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
                      <Chips label="What would make care easier?" all={EASY} selected={easy} onToggle={toggle(easy, setEasy)} />
                      <div>
                        <Button size="sm" onClick={answerEasy}>
                          Find a time
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </AiTurn>
              )
            if (m.kind === "hold")
              return (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: sp(4) }}>
                  <AiTurn text="Here's a visit that fits. I'm holding it for you." />
                  {hold("ig-late")}
                </div>
              )
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: sp(4) }}>
                <div className="ig-ai ap-pop" style={{ transformOrigin: "left top" }}>
                  <AiMark />
                  <div style={{ display: "flex", flexDirection: "column", gap: sp(3), flex: 1, minWidth: 0 }}>
                    <div className="ig-bub">
                      Of course. Let's get {name} her first visit. I've picked what fits {puppyWords(pet.age)}. Tap anything to change it.
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
                {hold("ap-pop")}
              </div>
            )
          })}
        </div>
        <div className="ap-foot">
          <AskBar
            value={draft}
            onChange={setDraft}
            onSend={send}
            placeholder={sent ? "Message ACME" : `${name} needs a vet`}
            onVoiceError={toast}
          />
        </div>
      </section>
    </ApScreen>
  )
}
