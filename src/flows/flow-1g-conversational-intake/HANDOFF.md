# Flow 1g · Conversational intake

After confirming her details, Lucy asks for a vet and the agent holds a visit in one turn (copy of 1f, no avatar).

| | |
|---|---|
| **Status** | Prototype. Exported from the canvas, then made interactive on request (chosen photo and name carry through, a working chat composer, voice input) |
| **Device** | Mobile (390 artboards, rendered in `MobileShell`, up to 480px wide) |
| **Routes** | `/flow-1g-conversational-intake` … `/booked` |
| **Source** | Canvas "NVA 2103 - Waffles 2.0 Sandbox", version `1795803706-1921`, note `flow1g` (IG00–IG06) |
| **Persona / timepoint** | Lucy, new ACME client; Waffles, Golden Retriever puppy, ~10 weeks, Fremont (Seattle). Visit held for Tue, Nov 17 |

## Screens

| ID | Title | Route | What happens |
|---|---|---|---|
| IG00 | Homepage, Get Started | `/flow-1g-conversational-intake` | Entry. Resets the flow's answers. "Get started with ACME" → IG01. "Sign in" and the menu are not built. |
| IG01 | Meet your pet: add a photo | `/meet` | Pick one of three recent photos (radio). The chosen photo is used on every later screen. "Take a photo" / "Choose from library" open the real file picker (an uploaded file isn't used yet). "Use this photo" → IG02. |
| IG02 | AI reads the photo | `/reading` | Scan animation; species, breed, age, weight and location appear one by one. "Check the details" → IG03. |
| IG03 | Confirm or correct | `/confirm` | Name field: tapping it suggests "Waffles" (as on the canvas) with the text selected, so typing replaces it. "Lovely name" tag, five expandable rows with choice chips; picking a guess marks it Confirmed. "Confirm details" is disabled until there's a name, then → IG05. The name and details are used on IG05 and IG06. |
| IG05 | Chat: profile → vet in one turn (hold) | `/chat` | A real chat. Lucy can tap a starter chip, type in the field (Enter or Send) or speak (mic button). Her own words appear as her message and the scripted agent replies to the topic: vet or booking starts the booking; shots, house training, food, socializing and greetings get an answer with suggested next chips; anything else gets "I can't help with that yet" plus options. While booking, a typed answer counts as the answer to the open question. Step by step: help chips → Next → care chips → Find a time → held visit card. "Evening and weekend times" switches the slot to 6:00 PM (else 10:15 AM). "Confirm visit" → IG06. |
| IG06 | Booked in chat | `/booked` | Booked card with the pet's name, photo and the time held on IG05. "Add to calendar" downloads a real `.ics` for that time. "Get ready for her visit" is not built. |

## Components used

shadcn/ui (Base UI, `base-vega`): `button`, `badge`, `input`, `label`. Icons: lucide-react.
No `Custom.*` Syrup components. The artboards' own `.ap` / `.ig-*` styles are ported to `flow.css`, scoped under `.flow-flow-1g-conversational-intake`, using Syrup tokens only.

## State kept

`useFlowState` (`state.ts`), reset on IG00:

- `photo`: set on IG01, shown on IG02, IG03, IG05 and IG06.
- `petName`, `species`, `breed`, `age`, `weight`, `place`: set on IG03. The name and details line appear on IG05 and IG06. A deep link straight to a later screen falls back to "Waffles".
- `slotTime`: the time held on IG05, shown on IG06.

The chat messages, booking step and chip choices are per-screen `useState`.

## Chat and voice

- **Replies are scripted** in `chat-script.ts`: keyword topics, no AI service. `replyTo()` is the swap point for the real agent.
- **Voice input** uses the browser's Web Speech API: Chrome, Edge and Safari (not Firefox). The first tap asks for microphone permission. Words appear in the field as you speak; tap the mic again to stop early, then Send. Unsupported browsers and a denied permission show a message. In Chrome, speech is processed by Google's speech service.

## Journey exits

None used. This flow ends on IG06. `journey.ts` currently starts the app at this flow, because `login-sample` and `flow-1e-photo-first` are not in this repo yet.

## Tweaks → URL

| Canvas tweak | URL | Values |
|---|---|---|
| IG05 Chat style | `?chat=all` | default Step by step; `all` = All in one |
| IG05 Conversation | `?conversation=sent` | default Start; `sent` = already asked |

Example: `/flow-1g-conversational-intake/chat?chat=all&conversation=sent`

## Data

All from the canvas artboards (made up for the prototype): photo readings, Maple Grove Animal Hospital, Dr. Ruiz, Marcus Lee, price estimate $125–$185, Tue Nov 17 slot.

## Swap points for real APIs

- IG01 photo upload → image upload + storage.
- IG02 readings → photo analysis service (species, breed, age, weight, place tag).
- IG03 answers → pet profile create/update.
- IG05 chat → agent conversation (`replyTo()` in `chat-script.ts`); voice → the same Web Speech API or a speech-to-text service; held slot → clinic availability + hold API.
- IG06 booking → appointment confirmation; `.ics` from the real appointment.

## Not built (show "… isn't part of this prototype yet.")

Sign in, menu (IG00) · the pet's profile button (IG05, IG06) · See other times (IG05) · Get ready for her visit (IG06) · Sending a message after booking (IG06: the field and voice work, but sending shows the not-built message).

## Assets

All four canvas photos are exported into `assets/` (see `source.json`). Nothing missing.

## Open questions

- Device chrome stripped: the fake status bar and browser toolbar are gone; hero tops were moved up to match.
- Pronouns stay "her" for any name, as on the canvas.
- The clinic distance still says "from Fremont" on IG05/IG06 even if a different location is picked on IG03.
- The canvas skips IG04 (IG03 → IG05). Intended?
- nva-review: not confirmed to have run since the last edits to these artboards.
