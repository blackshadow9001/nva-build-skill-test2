// Scripted replies for the IG05 chat. There is no AI service behind the prototype:
// Lucy's message is matched to a topic by keywords and answered from this script.
// Swap point: replace replyTo() with a call to the real agent.

export type Topic = "vet" | "shots" | "training" | "food" | "social" | "greeting" | "thanks" | "other"

export interface Reply {
  /** Start the booking conversation instead of answering with text */
  book?: boolean
  /** Help topics to tick when booking starts (e.g. "Puppy shots") */
  preset?: string[]
  text: string
  /** Suggested next messages, shown as chips under the reply */
  quick: { label: string; topic: Topic }[]
}

const rules: [Topic, RegExp][] = [
  ["vet", /\b(vet|vets|book|booking|appointment|appt|visit|check[- ]?up|clinic|doctor|exam|sick|ill|hurt|injur|vomit|limp|schedule)\w*/i],
  ["shots", /\b(shot|vaccin|jab|dhpp|parvo|distemper|rabies|booster)\w*/i],
  ["training", /\b(train|potty|toilet|pee|poop|accident|crate|housebreak|house[- ]?train)\w*/i],
  ["food", /\b(food|feed|eat|meal|diet|nutrition|kibble|treat)\w*/i],
  ["social", /\b(social|meet other|other dogs|puppy class|bite|biting|nip)\w*/i],
  ["thanks", /\b(thanks|thank you|thx|cheers|great|perfect)\b/i],
  ["greeting", /^\s*(hi|hello|hey|good (morning|afternoon|evening))\b/i],
]

export function topicOf(text: string): Topic {
  // Asking to book shots is a booking, not a question about shots
  if (/\b(shot|vaccin|jab)\w*/i.test(text) && /\b(book|get|schedule|appointment|need)\b/i.test(text)) return "vet"
  return rules.find(([, re]) => re.test(text))?.[0] ?? "other"
}

export function replyTo(text: string, ctx: { name: string; age: string; held: boolean }, hint?: Topic): Reply {
  const { name, held } = ctx
  const topic = hint ?? topicOf(text)
  const findVet = { label: `Find a vet for ${name}`, topic: "vet" as Topic }
  const shots = { label: "Know more about puppy shots", topic: "shots" as Topic }
  const training = { label: "House training tips", topic: "training" as Topic }
  const weeks = Number(/^(\d+) weeks$/.exec(ctx.age)?.[1] ?? NaN)

  switch (topic) {
    case "vet":
      if (held)
        return {
          text: `${name}'s visit is already held for you above. Tap Confirm visit to book it, or See other times to change it.`,
          quick: [],
        }
      return {
        book: true,
        preset: /\b(shot|vaccin|jab)\w*/i.test(text) ? ["Puppy shots"] : undefined,
        text: "",
        quick: [],
      }
    case "shots":
      return {
        text:
          `Puppies get a series of core shots (DHPP) every 3–4 weeks, usually starting around 6–8 weeks and finishing at about 16 weeks, with rabies from around 12–16 weeks.` +
          (Number.isFinite(weeks) ? ` At ${weeks} weeks, ${name} is probably due for her next round.` : "") +
          ` Your vet will confirm the exact schedule at her first visit.`,
        quick: held ? [training] : [{ label: `Book ${name}'s puppy shots`, topic: "vet" }, training],
      }
    case "training":
      return {
        text: `A few things help most puppies: take ${name} out first thing in the morning, after meals, naps and play, and every 1–2 hours in between. Praise her the moment she goes outside, and clean accidents with an enzyme cleaner so she doesn't go back to the same spot.`,
        quick: held ? [shots] : [findVet, shots],
      }
    case "food":
      return {
        text: `At this age most puppies do well on a food made for puppies, split into 3–4 small meals a day. The vet can weigh ${name} and suggest portions at her first visit.`,
        quick: held ? [training] : [findVet, training],
      }
    case "social":
      return {
        text: `Gentle, positive meetings with new people, sounds and calm, vaccinated dogs help ${name} grow up confident. Ask the vet when she's covered enough for puppy classes.`,
        quick: held ? [training] : [findVet, shots],
      }
    case "thanks":
      return { text: `Anytime. I'm here whenever ${name} needs something.`, quick: held ? [] : [findVet] }
    case "greeting":
      return { text: `Hi! What can I help ${name} with?`, quick: held ? [shots, training] : [findVet, shots, training] }
    default:
      return {
        text: `I can't help with that in this prototype yet. I can find ${name} a vet, explain puppy shots, or share house training tips.`,
        quick: held ? [shots, training] : [findVet, shots, training],
      }
  }
}
