// Pieces shared by the screens of this flow only (never imported from another flow).
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Link } from "react-router"
import { ArrowUp, ChevronLeft, Mic, MicOff, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFlowState } from "@/app/flow-kit"
import { defaults, detailsLine, nameOf, photoOf } from "./state"

export const SLUG = "flow-1g-conversational-intake"

/** calc(var(--spacing) * n), the unit the artboards use */
export const sp = (n: number) => `calc(var(--spacing) * ${n})`

const files = import.meta.glob<string>("./assets/*", { eager: true, query: "?url", import: "default" })

/** Canvas photo from ./assets, with a token-coloured fallback when the file is missing. */
export function Photo({
  name,
  alt,
  className,
  style,
}: {
  name: string
  alt: string
  className?: string
  style?: CSSProperties
}) {
  const src = files[`./assets/${name}`]
  if (!src) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn("block", className)}
        style={{ background: "var(--accent-4)", ...style }}
      />
    )
  }
  return <img src={src} alt={alt} aria-hidden={alt ? undefined : true} className={className} style={style} />
}

/** The artboard's .ap root, sized to the phone shell instead of a fixed 390×844 frame. */
export function ApScreen({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn("ap", className)}
      style={{
        position: "relative",
        flex: 1,
        minHeight: 0,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--cream)",
      }}
    >
      {children}
    </div>
  )
}

/** Header row in the hero: back, ACME wordmark, and an optional right-hand button. */
export function HeroBar({ back, right }: { back: string; right?: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${sp(1)} ${sp(5)} 0`,
      }}
    >
      <BackButton to={back} />
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: ".18em", color: "var(--primary-foreground)" }}>ACME</span>
      {right ?? <span style={{ width: 44 }} />}
    </div>
  )
}

export function BackButton({ to }: { to: string }) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Back"
      style={{ width: 44, height: 44 }}
      render={<Link to={to} />}
      nativeButton={false}
    >
      <ChevronLeft size={20} />
    </Button>
  )
}

/** Hero padding that used to make room for the (stripped) device status bar. */
export const heroTop = sp(3)

export function TypingDots({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span className={cn("ig-typing", className)} aria-hidden="true" style={style}>
      <i />
      <i style={{ animationDelay: ".15s" }} />
      <i style={{ animationDelay: ".3s" }} />
    </span>
  )
}

export function AiMark() {
  return (
    <span className="ig-mark" aria-hidden="true">
      <PawPrint size={14} />
    </span>
  )
}

/** The chat composer at the foot of IG05 / IG06: a real text field plus voice input. */
export function AskBar({
  value,
  onChange,
  onSend,
  placeholder,
  onVoiceError,
}: {
  value: string
  onChange: (text: string) => void
  onSend: () => void
  placeholder: string
  onVoiceError: (message: string) => void
}) {
  const before = useRef("")
  const speech = useSpeechInput({
    onText: (heard) => onChange((before.current ? before.current + " " : "") + heard),
    onError: onVoiceError,
  })
  const toggleVoice = () => {
    if (speech.listening) return speech.stop()
    before.current = value.trim()
    speech.start()
  }
  return (
    <form
      className="ig-ask"
      onSubmit={(e) => {
        e.preventDefault()
        speech.stop()
        onSend()
      }}
    >
      <input
        className="body ig-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={speech.listening ? "Listening…" : placeholder}
        aria-label="Message ACME"
        autoComplete="off"
        enterKeyHint="send"
      />
      <Button
        type="button"
        variant={speech.listening ? "default" : "ghost"}
        size="icon"
        aria-label={speech.listening ? "Stop listening" : "Speak"}
        aria-pressed={speech.listening}
        className={cn("size-10 shrink-0 rounded-full", speech.listening && "ig-listening")}
        onClick={toggleVoice}
      >
        {speech.listening ? <MicOff size={18} /> : <Mic size={18} />}
      </Button>
      <Button type="submit" size="icon" aria-label="Send" className="size-10 shrink-0 rounded-full">
        <ArrowUp size={18} />
      </Button>
    </form>
  )
}

// Minimal typing for the Web Speech API (Chrome, Edge, Safari; not Firefox).
type SpeechResultList = ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>
interface SpeechRec {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: { results: SpeechResultList }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SpeechCtor = new () => SpeechRec

function speechCtor(): SpeechCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/** Browser speech-to-text. Calls onText with the words heard so far while the person talks. */
export function useSpeechInput({ onText, onError }: { onText: (text: string) => void; onError: (message: string) => void }) {
  const [listening, setListening] = useState(false)
  const rec = useRef<SpeechRec | null>(null)
  const handlers = useRef({ onText, onError })
  handlers.current = { onText, onError }

  useEffect(() => () => rec.current?.abort(), [])

  const start = useCallback(() => {
    const Ctor = speechCtor()
    if (!Ctor) {
      handlers.current.onError("Voice input isn't supported in this browser. Try Chrome, Edge or Safari.")
      return
    }
    const r = new Ctor()
    r.lang = navigator.language || "en-US"
    r.interimResults = true
    r.continuous = false
    r.onresult = (e) => {
      let text = ""
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript
      handlers.current.onText(text.trim())
    }
    r.onerror = (e) => {
      if (e.error === "aborted" || e.error === "no-speech") return
      handlers.current.onError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "Allow microphone access to use voice input."
          : "Voice input stopped. Try again.",
      )
    }
    r.onend = () => {
      setListening(false)
      rec.current = null
    }
    rec.current = r
    try {
      r.start()
      setListening(true)
    } catch {
      handlers.current.onError("Voice input couldn't start. Try again.")
    }
  }, [])

  const stop = useCallback(() => {
    rec.current?.stop()
  }, [])

  return { listening, start, stop }
}

/** Compact pet header used once the chat is going (IG05 chatting, IG06). Shows the photo, name and details Lucy confirmed. */
export function PetChip() {
  const [pet] = useFlowState(SLUG, defaults)
  const photo = photoOf(pet)
  const name = nameOf(pet)
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: sp(3),
        margin: `${sp(3)} ${sp(5)} 0`,
      }}
    >
      <Photo
        name={photo.name}
        alt={`Photo of ${name}`}
        style={{
          display: "block",
          width: 44,
          height: 44,
          borderRadius: 9999,
          objectFit: "cover",
          objectPosition: photo.pos,
          boxShadow: "0 0 0 3px var(--card)",
        }}
      />
      <span style={{ display: "flex", flexDirection: "column", gap: sp(0.25) }}>
        <span className="body" style={{ fontWeight: 700, color: "var(--surface-brand)" }}>
          {name}
        </span>
        <span className="small" style={{ color: "var(--muted-foreground)" }}>
          {detailsLine(pet, false)}
        </span>
      </span>
    </div>
  )
}

/** Download a calendar file for the booked visit (a real local action). */
export function downloadIcs({ title, start, minutes, location }: { title: string; start: Date; minutes: number; location: string }) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const end = new Date(start.getTime() + minutes * 60000)
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ACME//Prototype//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@example.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }))
  const a = document.createElement("a")
  a.href = url
  a.download = "waffles-first-visit.ics"
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Absolute route to a screen in this flow ("" = entry). */
export const url = (path = "") => (path ? `/${SLUG}/${path}` : `/${SLUG}`)
