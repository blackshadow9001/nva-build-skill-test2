# Flow 1g · Conversational intake

After confirming her details, Lucy asks for a vet and the agent holds a visit in one turn (copy of 1f, no avatar).

| | |
|---|---|
| **Status** | Prototype, first export |
| **Device** | Mobile (390 artboards, rendered in `MobileShell`, up to 480px wide) |
| **Routes** | `/flow-1g-conversational-intake` … `/booked` |
| **Source** | Canvas "NVA 2103 - Waffles 2.0 Sandbox", version `1795803706-1921`, note `flow1g` (IG00–IG06) |
| **Persona / timepoint** | Lucy, new ACME client; Waffles, Golden Retriever puppy, ~10 weeks, Fremont (Seattle). Visit held for Tue, Nov 17 |

## Screens

| ID | Title | Route | What happens |
|---|---|---|---|
| IG00 | Homepage, Get Started | `/flow-1g-conversational-intake` | Entry. Resets the flow's answers. "Get started with ACME" → IG01. "Sign in" and the menu are not built. |
| IG01 | Meet your pet: add a photo | `/meet` | Pick one of three recent photos (radio). "Take a photo" / "Choose from library" open the real file picker (the flow continues with the sample photo). "Use this photo" → IG02. |
| IG02 | AI reads the photo | `/reading` | Scan animation; species, breed, age, weight and location appear one by one. "Check the details" → IG03. |
| IG03 | Confirm or correct | `/confirm` | Name field (tapping it fills "Waffles", as on the canvas), "Lovely name" tag, five expandable rows with choice chips; picking a guess marks it Confirmed. "Confirm details" is disabled until there's a name, then → IG05. |
| IG05 | Chat: profile → vet in one turn (hold) | `/chat` | Starter chips or Send start the conversation. Step by step: help chips → Next → care chips → Find a time → held visit card. "Evening and weekend times" switches the slot to 6:00 PM (else 10:15 AM). "Confirm visit" → IG06. |
| IG06 | Booked in chat | `/booked` | Booked card. "Add to calendar" downloads a real `.ics`. "Get ready for her visit" is not built. |

## Components used

shadcn/ui (Base UI, `base-vega`): `button`, `badge`, `input`, `label`. Icons: lucide-react.
No `Custom.*` Syrup components. The artboards' own `.ap` / `.ig-*` styles are ported to `flow.css`, scoped under `.flow-flow-1g-conversational-intake`, using Syrup tokens only.

## State kept

`useFlowState` (`state.ts`): `petName`, `species`, `breed`, `age`, `weight`, `place`, set on IG03 and reset on IG00. Chat chips and steps are per-screen `useState`.

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
- IG05 chat → agent conversation; held slot → clinic availability + hold API.
- IG06 booking → appointment confirmation; `.ics` from the real appointment.

## Not built (show "… isn't part of this prototype yet.")

Sign in, menu (IG00) · Waffles' profile button (IG05, IG06) · See other times (IG05) · Voice input (IG05, IG06) · Get ready for her visit (IG06) · Sending a message after booking (IG06).

## Assets

All four canvas photos are exported into `assets/` (see `source.json`). Nothing missing.

## Open questions

- Device chrome stripped: the fake status bar and browser toolbar are gone; hero tops were moved up to match.
- The photo picked on IG01 doesn't carry into IG02–IG06; the canvas always shows the snow photo, so the prototype does too.
- IG06 always shows "Tue, Nov 17 · 6:00 PM", even if Lucy deselected evening times on IG05 (the held slot then reads 10:15 AM). Same as the canvas; worth aligning.
- The canvas skips IG04 (IG03 → IG05). Intended?
- nva-review: not confirmed to have run since the last edits to these artboards.
