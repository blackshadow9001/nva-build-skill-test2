// Pieces shared by the screens of this flow only (never imported from another flow).
import type { CSSProperties, ReactNode } from "react"
import { Link } from "react-router"
import { ArrowUp, ChevronLeft, Mic, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

/** The chat composer at the foot of IG05 / IG06. */
export function AskBar({ text, onSend, onSpeak }: { text: string; onSend: () => void; onSpeak: () => void }) {
  return (
    <div className="ig-ask">
      <span className="body" style={{ flexGrow: 1, color: "var(--muted-foreground)" }}>
        {text}
      </span>
      <Button variant="ghost" size="icon" aria-label="Speak" className="size-10 shrink-0 rounded-full" onClick={onSpeak}>
        <Mic size={18} />
      </Button>
      <Button size="icon" aria-label="Send" className="size-10 shrink-0 rounded-full" onClick={onSend}>
        <ArrowUp size={18} />
      </Button>
    </div>
  )
}

/** Compact pet header used once the chat is going (IG05 chatting, IG06). */
export function PetChip({ details }: { details: string }) {
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
        name="waffles-snow.jpg"
        alt="Photo of Waffles"
        style={{
          display: "block",
          width: 44,
          height: 44,
          borderRadius: 9999,
          objectFit: "cover",
          objectPosition: "50% 28%",
          boxShadow: "0 0 0 3px var(--card)",
        }}
      />
      <span style={{ display: "flex", flexDirection: "column", gap: sp(0.25) }}>
        <span className="body" style={{ fontWeight: 700, color: "var(--surface-brand)" }}>
          Waffles
        </span>
        <span className="small" style={{ color: "var(--muted-foreground)" }}>
          {details}
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
