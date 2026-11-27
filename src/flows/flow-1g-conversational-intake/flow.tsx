import type { FlowDef } from "@/app/types"
import "./flow.css"
import Home from "./screens/Home"
import Meet from "./screens/Meet"
import Reading from "./screens/Reading"
import Confirm from "./screens/Confirm"
import Chat from "./screens/Chat"
import Booked from "./screens/Booked"

const flow: FlowDef = {
  slug: "flow-1g-conversational-intake",
  title: "Flow 1g · Conversational intake",
  order: 17,
  device: "mobile",
  rootClass: "flow-flow-1g-conversational-intake",
  screens: [
    { id: "IG00", title: "Homepage, Get Started", path: "", artboard: "IG00-Home.dc.html", component: Home },
    { id: "IG01", title: "Meet your pet: add a photo", path: "meet", artboard: "IG01-Meet.dc.html", component: Meet },
    { id: "IG02", title: "AI reads the photo", path: "reading", artboard: "IG02-Reading.dc.html", component: Reading },
    { id: "IG03", title: "Confirm or correct", path: "confirm", artboard: "IG03-Confirm.dc.html", component: Confirm },
    { id: "IG05", title: "Chat: profile → vet in one turn (hold)", path: "chat", artboard: "IG05-Chat.dc.html", component: Chat },
    { id: "IG06", title: "Booked in chat", path: "booked", artboard: "IG06-Booked.dc.html", component: Booked },
  ],
  exits: {},
}

export default flow
