// IG01 · Meet your pet: add a photo
import { useRef, useState } from "react"
import { Link } from "react-router"
import { ArrowRight, Camera, Check, Images, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/app/flow-kit"
import { ApScreen, HeroBar, Photo, heroTop, sp, url } from "../parts"

const pics = [
  { name: "waffles-snow.jpg", pos: "50% 30%", label: "Golden Retriever puppy sitting in the snow" },
  { name: "waffles-sun.jpg", pos: "70% 82%", label: "Golden Retriever puppy asleep in a patch of sun on a wood floor" },
  { name: "waffles-paws.jpg", pos: "50% 62%", label: "Golden Retriever puppy resting its head on its paws" },
]

export default function Meet() {
  const [sel, setSel] = useState(0)
  const toast = useToast()
  const cameraRef = useRef<HTMLInputElement>(null)
  const libraryRef = useRef<HTMLInputElement>(null)
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) toast("Photo added. This prototype carries on with the sample photo.")
    e.target.value = ""
  }

  return (
    <ApScreen className="ig01">
      <section className="ap-hero ap-forest" style={{ height: 286, paddingTop: heroTop, boxSizing: "border-box" }}>
        <HeroBar back={url()} />
        <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: sp(5.5) }}>
          <span
            className="ap-breathe"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 200,
              height: 200,
              margin: sp(-25),
              borderRadius: 9999,
              border: "1.5px dashed color-mix(in oklch, var(--accent-3) 50%, transparent)",
            }}
          />
          <span
            className="ap-glass ap-round"
            aria-hidden="true"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 150,
              borderRadius: 9999,
              color: "var(--lime)",
            }}
          >
            <Camera size={40} />
          </span>
        </div>
      </section>
      <section className="ap-sheet">
        <div className="ap-scroll ap-rise">
          <div style={{ display: "flex", flexDirection: "column", gap: sp(2.5) }}>
            <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
              We'd love to meet your pet.
            </h1>
            <p className="body" style={{ margin: 0, color: "var(--muted-foreground)" }}>
              Add a photo and we'll take it from there. No long forms.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: sp(3) }}>
            <span
              className="ui"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 600, color: "var(--foreground)" }}
            >
              Recent uploads
              <span className="small" style={{ display: "flex", alignItems: "center", gap: sp(1), fontWeight: 500, color: "var(--muted-foreground)" }}>
                <Lock size={12} />
                On device
              </span>
            </span>
            <div
              role="radiogroup"
              aria-label="Choose a photo"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: sp(2.5) }}
            >
              {pics.map((p, i) => {
                const on = sel === i
                return (
                  <button
                    key={p.name}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`Photo ${i + 1}: ${p.label}`}
                    onClick={() => setSel(i)}
                    className="ap-lift"
                    style={{
                      position: "relative",
                      height: 112,
                      padding: 0,
                      borderRadius: 20,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: on ? "3px solid var(--foreground)" : "1px solid color-mix(in oklch, var(--foreground) 12%, transparent)",
                      background: "none",
                    }}
                  >
                    <Photo
                      name={p.name}
                      alt=""
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos }}
                    />
                    {on && (
                      <span
                        className="ap-pop"
                        style={{
                          position: "absolute",
                          top: sp(2),
                          right: sp(2),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          borderRadius: 9999,
                          background: "var(--lime)",
                          color: "var(--ink)",
                        }}
                      >
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp(2.5) }}>
            <Button variant="outline" size="lg" className="w-full" onClick={() => cameraRef.current?.click()}>
              <Camera size={16} />
              Take a photo
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => libraryRef.current?.click()}>
              <Images size={16} />
              Choose from library
            </Button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
            <input ref={libraryRef} type="file" accept="image/*" hidden onChange={onFile} />
          </div>
        </div>
        <div className="ap-foot">
          <Button size="lg" className="w-full" render={<Link to={url("reading")} />} nativeButton={false}>
            Use this photo
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </ApScreen>
  )
}
