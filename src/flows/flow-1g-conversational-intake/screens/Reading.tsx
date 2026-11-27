// IG02 · AI reads the photo
import { Link } from "react-router"
import { ArrowRight, Cake, Check, Dna, MapPin, PawPrint, Scale, Sparkles, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApScreen, BackButton, Photo, TypingDots, sp, url } from "../parts"

const readings: { icon: LucideIcon; label: string; value: string; start: number }[] = [
  { icon: PawPrint, label: "Species", value: "Dog", start: 2.4 },
  { icon: Dna, label: "Breed", value: "Golden Retriever · 92% match", start: 3.6 },
  { icon: Cake, label: "Age", value: "About 10 weeks", start: 4.8 },
  { icon: Scale, label: "Weight", value: "About 14 lb", start: 6.0 },
  { icon: MapPin, label: "Location", value: "Fremont, Seattle", start: 7.2 },
]

const tags: { text: string; left: number; top: number; delay: string }[] = [
  { text: "Dog", left: 5.5, top: 29.5, delay: "3.4s" },
  { text: "Golden Retriever", left: 49, top: 24, delay: "4.6s" },
  { text: "~10 weeks", left: 6.5, top: 59, delay: "5.8s" },
  { text: "~14 lb", left: 65.5, top: 54.5, delay: "7.0s" },
]

export default function Reading() {
  return (
    <ApScreen className="ig02">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          zIndex: 3,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--foreground) 60%, transparent) 0%, color-mix(in oklch, var(--foreground) 25%, transparent) 60%, transparent 100%)",
        }}
      />
      <header
        style={{
          position: "absolute",
          top: sp(4),
          left: sp(5),
          right: sp(5),
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackButton to={url("meet")} />
        <span
          className="small"
          style={{
            display: "flex",
            alignItems: "center",
            gap: sp(2),
            height: 36,
            padding: `0 ${sp(3.5)}`,
            borderRadius: 9999,
            background: "color-mix(in oklch, var(--foreground) 55%, transparent)",
            color: "var(--primary-foreground)",
            fontWeight: 600,
            WebkitBackdropFilter: "blur(8px)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Sparkles size={14} />
          Reading the photo
        </span>
      </header>
      <section style={{ position: "relative", height: 320, flexShrink: 0, overflow: "hidden" }}>
        <div role="img" aria-label="Your photo: Waffles sitting in the snow" className="ap-photo" style={{ position: "absolute", inset: 0 }}>
          <Photo
            name="waffles-snow.jpg"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%" }}
          />
        </div>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <span className="ap-scan" />
        </div>
        <svg
          aria-hidden="true"
          width="190"
          height="190"
          viewBox="0 0 250 250"
          style={{ position: "absolute", left: "50%", marginLeft: -95, top: sp(23) }}
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M2 30V2h28M220 2h28v28M248 220v28h-28M30 248H2v-28" />
        </svg>
        {tags.map((t) => (
          <span key={t.text} className="ap-tag" style={{ left: sp(t.left), top: sp(t.top), animationDelay: t.delay }}>
            <span className="ap-dot" />
            {t.text}
          </span>
        ))}
      </section>
      <section className="ap-sheet">
        <div className="ap-scroll ap-rise" style={{ paddingBottom: sp(6) }}>
          <div style={{ display: "flex", flexDirection: "column", gap: sp(1.5) }}>
            <span className="ap-eyebrow">Getting to know them</span>
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
              Here's what we can tell.
            </h1>
          </div>
          <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
            {readings.map(({ icon: Icon, label, value, start }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: sp(3),
                  animation: "f1g-aprise .5s var(--spring) both",
                  animationDelay: `${start}s`,
                }}
              >
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
                <span style={{ display: "flex", flexDirection: "column", gap: sp(0.25), flexGrow: 1 }}>
                  <span className="small" style={{ color: "var(--muted-foreground)" }}>
                    {label}
                  </span>
                  <span style={{ position: "relative", display: "block", minHeight: 28 }}>
                    <TypingDots style={{ animationDelay: `${start}s` }} />
                    <span
                      className="body ig-reveal"
                      style={{ display: "block", fontWeight: 600, color: "var(--foreground)", animationDelay: `${start + 1}s` }}
                    >
                      {value}
                    </span>
                  </span>
                </span>
                <span
                  className="ap-pop"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 9999,
                    background: "var(--accent-3)",
                    color: "var(--accent-3-foreground)",
                    animationDelay: `${start + 1.2}s`,
                  }}
                >
                  <Check size={16} />
                </span>
              </div>
            ))}
          </div>
          <p className="small" style={{ margin: 0, color: "var(--muted-foreground)" }}>
            Location comes from the photo's place tag, only because you chose this photo. You can change any of this next.
          </p>
        </div>
        <div className="ap-foot" style={{ borderTop: "1px solid var(--line)" }}>
          <Button size="lg" className="w-full" render={<Link to={url("confirm")} />} nativeButton={false}>
            Check the details
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </ApScreen>
  )
}
