// IG03 · Confirm or correct
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { ArrowRight, Cake, Check, ChevronUp, Dna, MapPin, PawPrint, Pencil, Scale, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFlowState } from "@/app/flow-kit"
import { ApScreen, HeroBar, Photo, SLUG, heroTop, sp, url } from "../parts"
import { defaults, photoOf } from "../state"

type Field = "species" | "breed" | "age" | "weight" | "place"
const defs: { id: Field; icon: LucideIcon; label: string; conf: "sure" | "guess"; options: string[] }[] = [
  { id: "species", icon: PawPrint, label: "Species", conf: "sure", options: ["Dog", "Cat", "Something else"] },
  { id: "breed", icon: Dna, label: "Breed", conf: "sure", options: ["Golden Retriever", "Labrador Retriever", "Golden mix"] },
  { id: "age", icon: Cake, label: "Age", conf: "guess", options: ["8 weeks", "10 weeks", "12 weeks", "Enter birthday"] },
  { id: "weight", icon: Scale, label: "Weight", conf: "guess", options: ["12 lb", "14 lb", "16 lb"] },
  { id: "place", icon: MapPin, label: "Location", conf: "sure", options: ["Fremont, Seattle", "Use a different ZIP", "Don't use location"] },
]

export default function Confirm() {
  const [pet, setPet] = useFlowState(SLUG, defaults)
  const [open, setOpen] = useState<Field | "">("age")
  const [ok, setOk] = useState<Partial<Record<Field, boolean>>>({})
  const [nameTag, setNameTag] = useState(!!pet.petName)
  const nameTimer = useRef<number | undefined>(undefined)
  const nameInput = useRef<HTMLInputElement>(null)
  useEffect(() => () => window.clearTimeout(nameTimer.current), [])

  // Prototype shortcut from the artboard: tapping the empty name field suggests "Waffles".
  // The suggestion is selected, so typing straight away replaces it with another name.
  const fillName = () => {
    if (pet.petName) return
    setPet({ petName: "Waffles" })
    window.setTimeout(() => nameInput.current?.select(), 0)
    window.clearTimeout(nameTimer.current)
    nameTimer.current = window.setTimeout(() => setNameTag(true), 450)
  }
  const ready = !!pet.petName.trim()
  const photo = photoOf(pet)

  return (
    <ApScreen>
      <section className="ap-hero ap-forest" style={{ paddingTop: heroTop, paddingBottom: sp(6), boxSizing: "border-box" }}>
        <HeroBar back={url("reading")} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: sp(3.5), marginTop: sp(3.5) }}>
          <span
            className="ap-photo"
            role="img"
            aria-label="Your photo"
            style={{
              width: 112,
              height: 112,
              borderRadius: 9999,
              boxShadow: "0 14px 30px -16px color-mix(in oklch, var(--foreground) 55%, transparent), 0 0 0 4px var(--card)",
            }}
          >
            <Photo
              name={photo.name}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: photo.pos }}
            />
          </span>
        </div>
      </section>
      <section className="ap-sheet">
        <div className="ap-scroll ap-rise">
          <div style={{ display: "flex", flexDirection: "column", gap: sp(2.5) }}>
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
              Did we get it right?
            </h1>
            <p className="body" style={{ margin: 0, color: "var(--muted-foreground)" }}>
              Tap anything that's off. Best guesses are marked.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
            <Label htmlFor="ig03-name">Their name</Label>
            <Input
              id="ig03-name"
              ref={nameInput}
              value={pet.petName}
              placeholder="Tap to add their name"
              aria-label="Pet name"
              className="h-12"
              onFocus={fillName}
              onClick={fillName}
              onChange={(e) => {
                setPet({ petName: e.target.value })
                setNameTag(!!e.target.value)
              }}
            />
            {nameTag && (
              <span
                className="small ap-pop"
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  gap: sp(1.5),
                  padding: `${sp(1.5)} ${sp(3)}`,
                  borderRadius: 9999,
                  color: "var(--forest)",
                  fontWeight: 600,
                  backgroundColor: "var(--wellness-subtle)",
                }}
              >
                <Check size={14} />
                <span>Lovely name</span>
              </span>
            )}
          </div>
          <div className="ap-card" style={{ overflow: "hidden" }}>
            {defs.map(({ id, icon: Icon, label, conf, options }) => {
              const isOpen = open === id
              const sure = conf === "sure"
              return (
                <div key={id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <button type="button" className="ap-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? "" : id)}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: "var(--radius)",
                        background: "var(--lime-soft)",
                        color: "var(--forest)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: sp(0.25), flexGrow: 1, minWidth: 0 }}>
                      <span className="small" style={{ color: "var(--muted-foreground)" }}>
                        {label}
                      </span>
                      <span className="body" style={{ fontWeight: 600, color: "var(--foreground)" }}>
                        {pet[id]}
                      </span>
                    </span>
                    <Badge variant={sure || ok[id] ? "secondary" : "outline"} className="shrink-0">
                      {sure ? "Sure" : ok[id] ? "Confirmed" : "Best guess"}
                    </Badge>
                    {isOpen ? (
                      <ChevronUp size={16} style={{ color: "var(--muted-foreground)" }} />
                    ) : (
                      <Pencil size={16} style={{ color: "var(--muted-foreground)" }} />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      role="radiogroup"
                      aria-label={label}
                      className="ap-pop"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: sp(2),
                        padding: `0 ${sp(4)} ${sp(3.5)} ${sp(16)}`,
                        transformOrigin: "top left",
                      }}
                    >
                      {options.map((o) => {
                        const on = pet[id] === o
                        return (
                          <Button
                            key={o}
                            size="sm"
                            variant={on ? "default" : "outline"}
                            role="radio"
                            aria-checked={on}
                            onClick={() => {
                              setPet({ [id]: o })
                              setOk((s) => ({ ...s, [id]: true }))
                            }}
                          >
                            {o}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="ap-foot">
          {ready ? (
            <Button size="lg" className="w-full" render={<Link to={url("chat")} />} nativeButton={false}>
              Confirm details
              <ArrowRight size={18} />
            </Button>
          ) : (
            <>
              <Button size="lg" className="w-full" disabled>
                Confirm details
                <ArrowRight size={18} />
              </Button>
              <span className="small" style={{ textAlign: "center", color: "var(--muted-foreground)" }}>
                Add their name to continue
              </span>
            </>
          )}
        </div>
      </section>
    </ApScreen>
  )
}
