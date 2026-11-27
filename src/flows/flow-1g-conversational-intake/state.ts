// Answers kept across this flow's screens (useFlowState). The entry screen resets them.
export const defaults = {
  /** Photo picked on IG01 (file name in ./assets) */
  photo: "waffles-snow.jpg",
  petName: "",
  species: "Dog",
  breed: "Golden Retriever",
  age: "10 weeks",
  weight: "14 lb",
  place: "Fremont, Seattle",
  /** Time of the visit held on IG05, shown on IG06 */
  slotTime: "6:00 PM",
}
export type PetState = typeof defaults

/** The three photos offered on IG01, with the crop each one needs. */
export const PHOTOS = [
  { name: "waffles-snow.jpg", pos: "50% 28%", label: "Golden Retriever puppy sitting in the snow" },
  { name: "waffles-sun.jpg", pos: "70% 82%", label: "Golden Retriever puppy asleep in a patch of sun on a wood floor" },
  { name: "waffles-paws.jpg", pos: "50% 62%", label: "Golden Retriever puppy resting its head on its paws" },
]

export const photoOf = (s: PetState) => PHOTOS.find((p) => p.name === s.photo) ?? PHOTOS[0]

/** The name typed on IG03. Deep links straight to a later screen fall back to the canvas name. */
export const nameOf = (s: PetState) => s.petName.trim() || "Waffles"

/** "Waffles" → "Waffles'", "Biscuit" → "Biscuit's" */
export const possessive = (name: string) => (/s$/i.test(name) ? `${name}'` : `${name}'s`)

const short = (s: PetState) => ({
  age: /^\d+ weeks$/.test(s.age) ? s.age.replace(" weeks", " wks") : "",
  place: /,/.test(s.place) ? s.place.split(",")[0] : "",
})

/** "Golden Retriever · 10 wks · 14 lb · Fremont", built from the confirmed details. */
export function detailsLine(s: PetState, withWeight: boolean) {
  const { age, place } = short(s)
  return [s.breed, age, withWeight ? s.weight : "", place].filter(Boolean).join(" · ")
}
